const logger = require('../utils/logger');

/**
 * Role-Based Access Control middleware
 * Checks if user has required role(s)
 *
 * @param {...string} allowedRoles - Role names (dynamic, no hardcoded values)
 * Examples: requireRole('Patrimoine'), requireRole('DCRTCT', 'Validateur')
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // User roles should be loaded from database and attached to req.user
    const userRoles = req.user.roles || [];

    // Check if user has any of the required roles
    const hasRole = allowedRoles.some(requiredRole =>
      userRoles.some(userRole => userRole.name === requiredRole || userRole === requiredRole)
    );

    if (!hasRole) {
      logger.warn(`Access denied for user ${req.user.id} to ${req.originalUrl}. Required roles: ${allowedRoles.join(', ')}`);
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredRoles: allowedRoles
      });
    }

    next();
  };
};

/**
 * Permission-Based Access Control middleware
 * Checks if user has required permission(s)
 */
const requirePermission = (...requiredPermissions) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    try {
      // TODO: Load user permissions from database
      // This should be cached for performance
      // const userPermissions = await getUserPermissions(req.user.id);

      // Mock permissions check for now
      const userPermissions = req.user.permissions || [];

      const hasPermission = requiredPermissions.some(permission =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        logger.warn(`Access denied for user ${req.user.id} to ${req.originalUrl}. Required permissions: ${requiredPermissions}`);
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      next();
    } catch (error) {
      logger.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

/**
 * Check if user owns the resource or has SYSTEM_ADMIN role
 * SYSTEM_ADMIN is the only hardcoded role as it's the system administrator
 */
const requireOwnershipOrAdmin = (resourceIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const resourceOwnerId = req.params[resourceIdParam];
    const isOwner = req.user.id === resourceOwnerId;

    // Check if user has SYSTEM_ADMIN role (the only hardcoded role)
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.some(role =>
      (typeof role === 'string' && role === 'SYSTEM_ADMIN') ||
      (role.name === 'SYSTEM_ADMIN')
    );

    if (!isOwner && !isAdmin) {
      logger.warn(`Access denied for user ${req.user.id} to resource ${resourceOwnerId}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    next();
  };
};

/**
 * Load user permissions from database (with caching)
 */
const getUserPermissions = async (userId) => {
  // TODO: Implement with caching
  // 1. Check cache first
  // 2. If not in cache, query database
  // 3. Cache result for 5-10 minutes
  // 4. Return permissions array

  return [];
};

module.exports = {
  requireRole,
  requirePermission,
  requireOwnershipOrAdmin
};
