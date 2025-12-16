const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../../config/database');
const logger = require('../utils/logger');

/**
 * Login controller
 * Authenticates user and returns JWT token
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Query user from database
    const users = await sequelize.query(
      `SELECT u.id, u.username, u.email, u.password_hash, u.first_name, u.last_name, 
              u.is_active, u.locked_until, u.failed_login_attempts,
              ARRAY_AGG(r.name) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.username = :username OR u.email = :username
       GROUP BY u.id, u.username, u.email, u.password_hash, u.first_name, u.last_name, 
                u.is_active, u.locked_until, u.failed_login_attempts`,
      {
        replacements: { username },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!users || users.length === 0) {
      logger.warn(`Login attempt with invalid username: ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      // Increment failed login attempts
      const failedAttempts = (user.failed_login_attempts || 0) + 1;
      const maxAttempts = 5;
      
      if (failedAttempts >= maxAttempts) {
        // Lock account for 30 minutes
        const lockUntil = new Date(Date.now() + 30 * 60 * 1000);
        await sequelize.query(
          `UPDATE users 
           SET failed_login_attempts = :failedAttempts, 
               locked_until = :lockUntil 
           WHERE id = :userId`,
          {
            replacements: { failedAttempts, lockUntil, userId: user.id },
            type: sequelize.QueryTypes.UPDATE
          }
        );
        
        return res.status(403).json({
          success: false,
          message: 'Too many failed login attempts. Account locked for 30 minutes.'
        });
      } else {
        await sequelize.query(
          `UPDATE users SET failed_login_attempts = :failedAttempts WHERE id = :userId`,
          {
            replacements: { failedAttempts, userId: user.id },
            type: sequelize.QueryTypes.UPDATE
          }
        );
      }

      logger.warn(`Failed login attempt for user: ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Reset failed login attempts on successful login
    await sequelize.query(
      `UPDATE users 
       SET failed_login_attempts = 0, 
           locked_until = NULL, 
           last_login = CURRENT_TIMESTAMP 
       WHERE id = :userId`,
      {
        replacements: { userId: user.id },
        type: sequelize.QueryTypes.UPDATE
      }
    );

    // Filter out null roles
    const roles = user.roles ? user.roles.filter(role => role !== null) : [];

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: roles
      },
      process.env.JWT_SECRET || 'change-this-secret-in-production',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
      }
    );

    logger.info(`Successful login for user: ${username}`);

    // Return user data (without password)
    res.json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        roles: roles
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
};

/**
 * Refresh token controller
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret'
    );

    // Get user from database
    const users = await sequelize.query(
      `SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.is_active,
              ARRAY_AGG(r.name) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = :userId
       GROUP BY u.id, u.username, u.email, u.first_name, u.last_name, u.is_active`,
      {
        replacements: { userId: decoded.id },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!users || users.length === 0 || !users[0].is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const user = users[0];
    const roles = user.roles ? user.roles.filter(role => role !== null) : [];

    // Generate new access token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: roles
      },
      process.env.JWT_SECRET || 'change-this-secret-in-production',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    logger.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while refreshing token'
    });
  }
};

/**
 * Logout controller (client-side token removal)
 */
const logout = async (req, res) => {
  // Since we're using stateless JWT, logout is handled client-side
  // But we can log the action for audit purposes
  logger.info(`User logout: ${req.user?.username || 'unknown'}`);
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

module.exports = {
  login,
  refreshToken,
  logout
};

