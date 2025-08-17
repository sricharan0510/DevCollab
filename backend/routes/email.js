const express = require('express');
const { body } = require('express-validator');
const EmailController = require('../controllers/emailController');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/errorHandler');
const { emailVerificationLimiter, passwordResetLimiter } = require('../middleware/security');

const router = express.Router();

// Validation rules
const emailValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

const verifyEmailValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number')
];

const resetPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const otpValidation = [
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number')
];

// Public routes
router.post('/send-verification', 
  emailVerificationLimiter, 
  emailValidation, 
  handleValidationErrors, 
  EmailController.sendVerification
);

router.post('/verify', 
  emailVerificationLimiter, 
  verifyEmailValidation, 
  handleValidationErrors, 
  EmailController.verifyEmail
);

router.post('/send-password-reset', 
  passwordResetLimiter, 
  emailValidation, 
  handleValidationErrors, 
  EmailController.sendPasswordReset
);

router.post('/reset-password', 
  passwordResetLimiter, 
  resetPasswordValidation, 
  handleValidationErrors, 
  EmailController.resetPassword
);

// Protected routes (for authenticated users)
router.post('/resend-verification', 
  authenticateToken,
  emailVerificationLimiter, 
  EmailController.resendVerification
);

router.post('/verify-authenticated', 
  authenticateToken,
  emailVerificationLimiter, 
  otpValidation, 
  handleValidationErrors, 
  EmailController.verifyEmailAuthenticated
);

module.exports = router;

