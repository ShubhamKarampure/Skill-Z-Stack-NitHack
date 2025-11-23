// src/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { devLogger, prodLogger } from './middleware/logger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { checkConnection } from './blockchain/utils/provider.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ================================
// Middleware Setup
// ================================

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(prodLogger);
} else {
  app.use(devLogger);
}

// Rate limiting
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100
}));

// ================================
// Database Connection
// ================================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// ================================
// Blockchain Connection Check
// ================================

const checkBlockchainConnection = async () => {
  try {
    const status = await checkConnection();
    if (status.connected) {
      console.log('✓ Blockchain connected successfully');
      console.log(`  Network ID: ${status.networkId}`);
      console.log(`  Block Number: ${status.blockNumber}`);
    } else {
      console.error('✗ Blockchain connection failed');
    }
  } catch (error) {
    console.error('✗ Blockchain connection error:', error.message);
  }
};

// ================================
// Routes
// ================================

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Skills Passport API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      issuers: '/api/v1/issuers',
      credentials: '/api/v1/credentials',
      verify: '/api/v1/verify',
      blockchain: '/api/v1/blockchain'
    }
  });
});

// API routes
app.use('/api/v1', routes);

// ================================
// Error Handling
// ================================

// 404 handler - MUST come after all routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

// ================================
// Server Startup
// ================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Check blockchain connection
    await checkBlockchainConnection();

    // Start server
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log('🚀 Skills Passport Backend Server');
      console.log('='.repeat(50));
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API: http://localhost:${PORT}/api/v1`);
      console.log(`✓ Health: http://localhost:${PORT}/api/v1/health`);
      console.log('='.repeat(50) + '\n');
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// Start the server
startServer();

export default app;
