import express, { Application } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { testConnection } from './config/db';
import initializeDatabase from './database/setup';

// Route files
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Initialize database if needed
    if (process.env.INIT_DB === 'true') {
      await initializeDatabase();
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
};

startServer(); 