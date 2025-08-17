require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const { pool, initializeDatabase } = require('./config/database');
const emailService = require('./services/emailService');

const { 
  securityHeaders, 
  corsOptions, 
  sanitizeInput, 
  requestLogger,
  generalLimiter 
} = require('./middleware/security');
const { 
  globalErrorHandler, 
  notFoundHandler 
} = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const oauthRoutes = require('./routes/oauth');
const emailRoutes = require('./routes/email');

const passport = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

// Security middleware
app.use(helmet(securityHeaders));
app.use(cors(corsOptions));
app.use(generalLimiter);
app.use(sanitizeInput);

app.use(requestLogger);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/email', emailRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Secure Authentication API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      oauth: '/api/auth/google, /api/auth/github',
      email: '/api/email'
    }
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'API Documentation',
    version: '1.0.0',
    endpoints: {
      authentication: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/refresh-token': 'Refresh access token',
        'POST /api/auth/logout': 'Logout user',
        'GET /api/auth/profile': 'Get user profile (protected)',
        'PUT /api/auth/profile': 'Update user profile (protected)',
        'PUT /api/auth/change-password': 'Change password (protected)',
        'DELETE /api/auth/account': 'Delete account (protected)'
      },
      oauth: {
        'GET /api/auth/google': 'Google OAuth login',
        'GET /api/auth/github': 'GitHub OAuth login',
        'POST /api/auth/link/:provider': 'Link OAuth account (protected)',
        'DELETE /api/auth/unlink/:provider': 'Unlink OAuth account (protected)',
        'GET /api/auth/accounts': 'Get OAuth accounts (protected)'
      },
      email: {
        'POST /api/email/send-verification': 'Send email verification',
        'POST /api/email/verify': 'Verify email with OTP',
        'POST /api/email/send-password-reset': 'Send password reset email',
        'POST /api/email/reset-password': 'Reset password with OTP',
        'POST /api/email/resend-verification': 'Resend verification (protected)',
        'POST /api/email/verify-authenticated': 'Verify email for authenticated user (protected)'
      }
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      note: 'Include JWT access token in Authorization header for protected routes'
    }
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    pool.end();
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    pool.end();
  });
});

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    await emailService.verifyConnection();

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;

