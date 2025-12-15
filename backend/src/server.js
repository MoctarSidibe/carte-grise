require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { sequelize, testConnection } = require('../config/database');
const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { securityMiddlewares, apiLimiter } = require('./middleware/security');
const { auditLog } = require('./middleware/auditLog');

// Create Express app
const app = express();

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Security middlewares (helmet, xss-clean, etc.)
securityMiddlewares.forEach(middleware => app.use(middleware));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Audit logging
app.use(auditLog);

// Rate limiting
app.use(`/api/${process.env.API_VERSION || 'v1'}`, apiLimiter);

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
const API_VERSION = process.env.API_VERSION || 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

// TODO: Import and use route files as you implement them
// app.use(`${API_PREFIX}/auth`, require('./routes/auth'));
// app.use(`${API_PREFIX}/users`, require('./routes/users'));
app.use(`${API_PREFIX}/roles`, require('./routes/roles')); // Dynamic roles management
// app.use(`${API_PREFIX}/workflows`, require('./routes/workflows'));
// app.use(`${API_PREFIX}/forms`, require('./routes/forms'));
// app.use(`${API_PREFIX}/applications`, require('./routes/applications'));
// app.use(`${API_PREFIX}/documents`, require('./routes/documents'));
// app.use(`${API_PREFIX}/signatures`, require('./routes/signatures'));

// Test route
app.get(`${API_PREFIX}/test`, (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    version: API_VERSION
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    logger.info('Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Sync database (use with caution in production)
    if (process.env.NODE_ENV === 'development') {
      // await sequelize.sync({ alter: true });
      logger.info('Database sync skipped (manual migration recommended)');
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`
╔════════════════════════════════════════════════════════════╗
║  CGA Backend Server - Carte Grise Administrative          ║
║  Environment: ${process.env.NODE_ENV?.padEnd(45) || 'development'.padEnd(45)}║
║  Port: ${PORT.toString().padEnd(51)}║
║  API Version: ${API_VERSION.padEnd(46)}║
║  Time: ${new Date().toISOString().padEnd(47)}║
╚════════════════════════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  app.close(() => {
    logger.info('Process terminated');
    sequelize.close();
  });
});

// Start the server
startServer();

module.exports = app;
