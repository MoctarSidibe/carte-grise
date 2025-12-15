const swaggerJsdoc = require('swagger-jsdoc');

// Swagger configuration with Gabon theme colors
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CGA - Carte Grise Administrative API',
      version: '1.0.0',
      description: `
        **API Documentation for Carte Grise Administrative (CGA)**

        Enterprise-grade REST API for administrative vehicle registration management in the Gabonese Republic 🇬🇦

        ## Features
        - 🔒 JWT Authentication
        - 🔄 Dynamic Roles (Patrimoine, DCRTCT, etc.)
        - 📝 Dynamic Workflows
        - 📄 Document Management
        - ✍️ Digital Signatures
        - 📊 Audit Logging

        ## Gabon Theme Colors
        - 🟢 Green: #009E60
        - 🟡 Yellow: #FCD116
        - 🔵 Blue: #3A75C4
      `,
      contact: {
        name: 'CGA API Support',
        email: 'support@cga.local',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://yourdomain.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from /api/auth/login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            status: {
              type: 'integer',
              description: 'HTTP status code',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier',
            },
            username: {
              type: 'string',
              description: 'Username',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            roles: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'User roles (e.g., SYSTEM_ADMIN, Patrimoine, DCRTCT)',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Role: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
              description: 'Role name (e.g., Patrimoine, DCRTCT)',
              example: 'Patrimoine',
            },
            description: {
              type: 'string',
              description: 'Role description',
            },
            permissions: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of permissions',
            },
            isSystemRole: {
              type: 'boolean',
              description: 'Whether this is a system role',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Username',
              example: 'admin',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Password',
              example: 'Admin@123456',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT access token',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'unhealthy'],
              description: 'Service health status',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Current server time',
            },
            service: {
              type: 'string',
              description: 'Service name',
              example: 'cga-backend',
            },
            database: {
              type: 'string',
              description: 'Database connection status',
              enum: ['connected', 'disconnected'],
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication and authorization endpoints',
      },
      {
        name: 'Roles',
        description: 'Dynamic role management (SYSTEM_ADMIN only)',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Applications',
        description: 'Vehicle registration applications',
      },
      {
        name: 'Workflows',
        description: 'Dynamic workflow management',
      },
      {
        name: 'Documents',
        description: 'Document upload and management',
      },
      {
        name: 'Health',
        description: 'System health checks',
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './server.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
