const UserService = require('../services/userService');
const OTPService = require('../services/otpService');
const emailService = require('../services/emailService');
const { asyncHandler, ValidationError, UnauthorizedError, NotFoundError } = require('../middleware/errorHandler');

class EmailController {
  // Send email verification
  static sendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Find user by email
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user is already verified
    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Check rate limiting
    const hasRecentOTP = await OTPService.hasRecentOTP(user.id, 1);
    if (hasRecentOTP) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before requesting another verification code'
      });
    }

    // Generate OTP
    const otpRecord = await OTPService.createOTP(user.id);

    // Send verification email
    await emailService.sendVerificationEmail(user.email, user.name, otpRecord.otp);

    res.json({
      success: true,
      message: 'Verification code sent to your email'
    });
  });

  // Verify email with OTP
  static verifyEmail = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    // Find user by email
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user is already verified
    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Verify OTP
    const isValidOTP = await OTPService.verifyOTP(user.id, otp);
    if (!isValidOTP) {
      throw new ValidationError('Invalid or expired verification code');
    }

    // Mark user as verified
    const verifiedUser = await UserService.verifyUser(user.id);

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name);

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: verifiedUser.id,
          email: verifiedUser.email,
          name: verifiedUser.name,
          isVerified: verifiedUser.is_verified
        }
      }
    });
  });

  // Send password reset email
  static sendPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Find user by email
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.json({
        success: true,
        message: 'If the email exists, a password reset code has been sent'
      });
    }

    // Check if user has a password (OAuth-only users)
    if (!user.password_hash) {
      return res.json({
        success: true,
        message: 'If the email exists, a password reset code has been sent'
      });
    }

    // Check rate limiting (reduced for testing)
    const hasRecentOTP = await OTPService.hasRecentOTP(user.id, 0.1); 
    if (hasRecentOTP) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before requesting another password reset code'
      });
    }

    // Generate OTP
    const otpRecord = await OTPService.createOTP(user.id);

    // Send password reset email
    await emailService.sendPasswordResetEmail(user.email, user.name, otpRecord.otp);

    res.json({
      success: true,
      message: 'If the email exists, a password reset code has been sent'
    });
  });

  // Reset password with OTP
  static resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Find user by email
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify OTP
    const isValidOTP = await OTPService.verifyOTP(user.id, otp);
    if (!isValidOTP) {
      throw new ValidationError('Invalid or expired reset code');
    }

    // Update password
    await UserService.updatePassword(user.id, newPassword);

    // Send security alert
    await emailService.sendSecurityAlert(
      user.email, 
      user.name, 
      'Password Reset',
      { ip: req.ip, userAgent: req.get('User-Agent') }
    );

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  });

  // Resend verification (for authenticated users)
  static resendVerification = asyncHandler(async (req, res) => {
    const user = req.user;

    // Check if user is already verified
    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Check rate limiting
    const hasRecentOTP = await OTPService.hasRecentOTP(user.id, 1);
    if (hasRecentOTP) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before requesting another verification code'
      });
    }

    // Generate OTP
    const otpRecord = await OTPService.createOTP(user.id);

    // Send verification email
    await emailService.sendVerificationEmail(user.email, user.name, otpRecord.otp);

    res.json({
      success: true,
      message: 'Verification code sent to your email'
    });
  });

  // Verify email for authenticated users
  static verifyEmailAuthenticated = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    const user = req.user;

    // Check if user is already verified
    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Verify OTP
    const isValidOTP = await OTPService.verifyOTP(user.id, otp);
    if (!isValidOTP) {
      throw new ValidationError('Invalid or expired verification code');
    }

    // Mark user as verified
    const verifiedUser = await UserService.verifyUser(user.id);

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name);

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: verifiedUser.id,
          email: verifiedUser.email,
          name: verifiedUser.name,
          isVerified: verifiedUser.is_verified
        }
      }
    });
  });
}

module.exports = EmailController;

