import express, { Application } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { prisma } from './prisma';
import { runMigrations, generatePrismaClient } from './prisma/migrate';

// Route files
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

// Get database connection info
const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/managerai';
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

// Set port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  let databaseConnected = false;

  try {
    // Test database connection
    await prisma.$connect();
    console.log('Connected to the database successfully');
    databaseConnected = true;

    // Run Prisma migrations if needed
    if (process.env.RUN_MIGRATIONS === 'true' && databaseConnected) {
      await runMigrations();
      await generatePrismaClient();
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    console.log('Server will start without database functionality');
  }

  // Start server regardless of database connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!databaseConnected) {
      console.log('WARNING: Server is running without database connectivity');
      console.log('Some features may not work correctly');
    }
  });
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error during disconnect:', error);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error during disconnect:', error);
  }
  process.exit(0);
});

startServer(); 