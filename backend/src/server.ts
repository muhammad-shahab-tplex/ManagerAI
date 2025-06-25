import express, { Application } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from './generated/prisma';

// Route files
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

// Get database connection info
const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:shahab@localhost:5432/managerai';
const dbInfo = new URL(dbUrl);
console.log('Database connection info:');
console.log(`Database: ${dbInfo.pathname.substring(1)}`);
console.log(`User: ${dbInfo.username}`);
console.log(`Port: ${dbInfo.port}`);

// Initialize express app
const app: Application = express();

// Body parser
app.use(express.json());

// Configure CORS with specific options
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Test endpoint for verification
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString()
  });
});

// Database health check endpoint
app.get('/api/health/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, message: 'Database connection is healthy' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
  }
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Test Prisma database connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database via Prisma');
    
    // Test a simple query to make sure everything works
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query test successful');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('✅ All systems operational');
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️  Starting server without database connectivity...');
    
    // Start server anyway for development
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('WARNING: Server is running without database connectivity');
      console.log('Some features may not work correctly');
      console.log('\nTo fix database issues:');
      console.log('1. Make sure PostgreSQL is running');
      console.log('2. Check your database credentials');
      console.log('3. Ensure the database "managerai" exists');
    });
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await prisma.$disconnect();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('Error during disconnect:', error);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await prisma.$disconnect();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('Error during disconnect:', error);
  }
  process.exit(0);
});

startServer(); 