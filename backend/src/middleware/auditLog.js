const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

/**
 * Audit middleware to log all significant actions
 */
const auditLog = async (req, res, next) => {
  const originalJson = res.json;
  const startTime = Date.now();

  // Capture response
  res.json = function (data) {
    const duration = Date.now() - startTime;

    // Log audit trail
    const auditData = {
      user_id: req.user?.id || null,
      action: `${req.method} ${req.originalUrl}`,
      resource_type: req.baseUrl.split('/').pop() || 'unknown',
      resource_id: req.params.id || null,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent'),
      status: res.statusCode >= 400 ? 'FAILURE' : 'SUCCESS',
      duration_ms: duration,
      request_body: sanitizeData(req.body),
      response_status: res.statusCode
    };

    // Log to audit logger
    logger.info('AUDIT', auditData);

    // TODO: Save to database audit_logs table
    // This should be done asynchronously to not block response

    return originalJson.call(this, data);
  };

  next();
};

/**
 * Sanitize sensitive data from logs
 */
const sanitizeData = (data) => {
  if (!data) return null;

  const sanitized = { ...data };
  const sensitiveFields = ['password', 'password_hash', 'token', 'secret', 'api_key'];

  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
};

/**
 * Create audit log entry in database
 */
const createAuditLog = async (auditData) => {
  try {
    // TODO: Implement database insertion
    // const AuditLog = require('../models/AuditLog');
    // await AuditLog.create(auditData);
    return true;
  } catch (error) {
    logger.error('Failed to create audit log:', error);
    return false;
  }
};

module.exports = { auditLog, createAuditLog };
