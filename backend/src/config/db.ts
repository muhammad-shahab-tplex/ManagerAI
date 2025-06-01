import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Display connection information (without password)
console.log('Database connection info:');
console.log(`Database: ${process.env.DB_NAME || 'yourmanagerai'}`);
console.log(`User: ${process.env.DB_USER || 'postgres'}`);
console.log(`Port: ${process.env.DB_PORT || '5432'}`);

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'yourmanagerai',
  password: process.env.DB_PASSWORD || 'shahab',
  port: parseInt(process.env.DB_PORT || '5432'),
  // Maximum number of clients the pool should contain
  max: 20,
  // Number of milliseconds a client must sit idle before it is disconnected
  idleTimeoutMillis: 30000,
  // Number of milliseconds to wait before timing out when connecting a new client
  connectionTimeoutMillis: 2000,
});

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL database connection established successfully');
    client.release();
  } catch (error) {
    console.error('❌ Error connecting to PostgreSQL database:', error);
    console.error('\nPossible solutions:');
    console.error('1. Make sure PostgreSQL is installed and running');
    console.error(`2. Check that the database "${process.env.DB_NAME || 'yourmanagerai'}" exists`);
    console.error('3. Verify your database credentials in the .env file');
    console.error('4. Ensure PostgreSQL is listening on the specified port');
    
    if (process.env.NODE_ENV !== 'production') {
      console.error('\nFor local development:');
      console.error('- Install PostgreSQL from https://www.postgresql.org/download/');
      console.error(`- Create a database named "${process.env.DB_NAME || 'yourmanagerai'}"`);
      console.error('- Update .env file with correct credentials');
    }
    
    process.exit(1); // Exit with failure
  }
};

export { pool, testConnection }; 