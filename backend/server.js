const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const { sequelize } = require('./config/database');
const { errorHandler } = require('./src/middleware/errorHandler');
const swaggerSpec = require('./src/config/swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware (allow Swagger CSS/JS)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost',
  'http://localhost:80',
  'http://localhost:3000'
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI with Gabon theme customization
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar {
      background: linear-gradient(90deg, #009E60 0%, #FCD116 50%, #3A75C4 100%);
    }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .info .title { color: #009E60; }
    .swagger-ui .info .title small { background: #009E60; }
    .swagger-ui .opblock.opblock-post { border-color: #009E60; }
    .swagger-ui .opblock.opblock-get { border-color: #3A75C4; }
    .swagger-ui .opblock.opblock-put { border-color: #FCD116; }
    .swagger-ui .opblock.opblock-delete { border-color: #D32F2F; }
    .swagger-ui .btn.execute { background-color: #009E60; }
  `,
  customSiteTitle: 'CGA API Documentation',
  customfavIcon: '/favicon.ico',
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// API Documentation JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check endpoint
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API and database are running properly
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'cga-backend',
    database: sequelize.authenticate() ? 'connected' : 'disconnected',
  });
});

// API routes
app.use('/api/v1/auth', require('./src/routes/auth'));
app.use('/api/v1/roles', require('./src/routes/roles'));
// Add other routes as they are implemented

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    app.listen(PORT, () => {
      console.log(`🚀 Serveur CGA Backend démarré sur le port ${PORT}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
