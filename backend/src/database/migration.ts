import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

// Function to run migrations
const runMigrations = async () => {
  const client = await pool.connect();
  
  try {
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    // Get list of migrations that have already been applied
    const { rows } = await client.query('SELECT name FROM migrations ORDER BY id');
    const appliedMigrations = rows.map(row => row.name);
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure migrations are applied in order
    
    console.log(`Found ${migrationFiles.length} migration files, ${appliedMigrations.length} already applied.`);
    
    // Start a transaction
    await client.query('BEGIN');
    
    // Apply migrations that haven't been applied yet
    for (const file of migrationFiles) {
      if (!appliedMigrations.includes(file)) {
        console.log(`Applying migration: ${file}`);
        
        // Read and execute the migration
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        try {
          await client.query(sql);
          
          // Record that the migration has been applied
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [file]
          );
          
          console.log(`✅ Migration applied: ${file}`);
        } catch (error) {
          console.error(`❌ Error applying migration ${file}:`, error);
          throw error;
        }
      } else {
        console.log(`Skipping already applied migration: ${file}`);
      }
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    console.log('✅ All migrations applied successfully');
    
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('❌ Migration failed, rolling back:', error);
    throw error;
  } finally {
    client.release();
  }
};

// If this file is run directly (not imported)
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration process completed.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Migration process failed:', err);
      process.exit(1);
    });
}

export default runMigrations; 