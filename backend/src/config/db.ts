import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'managerai',
  password: process.env.DB_PASSWORD || 'postgres',
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
    process.exit(1); // Exit with failure
  }
};

export { pool, testConnection }; 