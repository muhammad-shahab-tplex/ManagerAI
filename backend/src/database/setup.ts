import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

// Function to initialize the database
const initializeDatabase = async () => {
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'init.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    // Connect to the database
    const client = await pool.connect();
    console.log('Connected to database, initializing schema...');

    try {
      // Execute the SQL script
      await client.query(sqlScript);
      console.log('✅ Database schema initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing database schema:', error);
      throw error;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// If this file is run directly (not imported)
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization completed.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Database initialization failed:', err);
      process.exit(1);
    });
}

export default initializeDatabase; 