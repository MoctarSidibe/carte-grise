const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

/**
 * Rate limiting configuration
 */
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs || 15 * 60 * 1000, // 15 minutes
    max: max || 100,
    message: message || 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limiter
const apiLimiter = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  'Too many requests, please try again later'
);

// Stricter rate limiter for authentication
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many login attempts, please try again later'
);

// File upload rate limiter
const uploadLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  20, // 20 uploads
  'Upload limit exceeded, please try again later'
);

/**
 * Apply all security middlewares
 */
const securityMiddlewares = [
  // Helmet - sets various HTTP headers for security
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }),

  // Data sanitization against NoSQL injection
  mongoSanitize(),

  // Data sanitization against XSS
  xss(),

  // Prevent HTTP Parameter Pollution
  hpp()
];

module.exports = {
  securityMiddlewares,
  apiLimiter,
  authLimiter,
  uploadLimiter,
  createRateLimiter
};
