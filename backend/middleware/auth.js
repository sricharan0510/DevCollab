const JWTUtils = require('../utils/jwt');
const UserService = require('../services/userService');

// Middleware to authenticate JWT tokens
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify the token
    const decoded = JWTUtils.verifyAccessToken(token);
    
    // Get user from database
    const user = await UserService.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request object
    req.user = user;
    req.tokenPayload = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.message === 'Invalid access token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired access token'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Middleware to check if user is verified
const requireVerified = (req, res, next) => {
  if (!req.user.is_verified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required'
    });
  }
  
  next();
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = JWTUtils.verifyAccessToken(token);
      const user = await UserService.findById(decoded.userId);
      
      if (user) {
        req.user = user;
        req.tokenPayload = decoded;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Middleware to check user roles (if implementing role-based access)
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // If roles are implemented in the future
    if (roles && req.user.role && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to validate refresh token
const validateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = JWTUtils.verifyRefreshToken(refreshToken);
    
    // Get user from database
    const user = await UserService.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    req.refreshTokenPayload = decoded;
    
    next();
  } catch (error) {
    console.error('Refresh token validation error:', error);
    
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
};

module.exports = {
  authenticateToken,
  requireVerified,
  optionalAuth,
  requireRole,
  validateRefreshToken
};

