import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'managerai',
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'shahab',
  port: parseInt(process.env.DB_PORT || '5432'),
};

console.log('Database configuration:', {
  ...dbConfig,
  password: '***hidden***'
});

// Create connection pool (keeping for backward compatibility but not actively used)
export const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Note: The application now primarily uses Prisma Client for database operations
// This pool connection is maintained for backward compatibility only
console.log('📝 Note: Application uses Prisma Client for database operations'); 