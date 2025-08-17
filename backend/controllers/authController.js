const UserService = require('../services/userService');
const OAuthService = require('../services/oauthService');
const JWTUtils = require('../utils/jwt');
const { asyncHandler, ValidationError, UnauthorizedError } = require('../middleware/errorHandler');

const OTPService = require('../services/otpService');
const emailService = require('../services/emailService');
const {
  setPendingRegistration,
  getPendingRegistration,
  deletePendingRegistration,
} = require('../services/pendingRegistrationService');

class AuthController {
  // Pre-register: send OTP and store signup data temporarily
  static preRegister = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Check for recent OTP
    // Use a short window (e.g., 1 min) to prevent spam
    const hasRecentOTP = await OTPService.hasRecentOTP(email, 1, true); // true: by email, not userId
    if (hasRecentOTP) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before requesting another verification code',
      });
    }

    // Generate OTP (no userId yet, so use email)
    const otpRecord = await OTPService.createOTP(email, true); // true: by email

    // Send verification email
    await emailService.sendVerificationEmail(email, name, otpRecord.otp);

    // Store pending registration
    setPendingRegistration(email, { name, email, password, otp: otpRecord.otp });

    res.json({
      success: true,
      message: 'Verification code sent to your email',
    });
  });

  // Verify registration: check OTP, then create user
  static verifyRegistration = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    // Check pending registration
    const pending = getPendingRegistration(email);
    if (!pending) {
      throw new ValidationError('No pending registration found. Please sign up again.');
    }

    // Verify OTP (by email)
    const isValidOTP = await OTPService.verifyOTP(email, otp, true); // true: by email
    if (!isValidOTP) {
      throw new ValidationError('Invalid or expired verification code');
    }

    // Create user
    const user = await UserService.createUser({
      email: pending.email,
      password: pending.password,
      name: pending.name,
    });

    // Mark as verified
    await UserService.verifyUser(user.id);

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name);

    // Clean up
    deletePendingRegistration(email);

    // Generate tokens
    const tokens = JWTUtils.generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'Registration complete',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isVerified: true,
        },
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
      },
    });
  });
  // Register new user
  // static register is now replaced by preRegister + verifyRegistration

  // Login user
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user has a password (might be OAuth-only user)
    if (!user.password_hash) {
      throw new UnauthorizedError('Please login with your social account');
    }

    // Verify password
    const isValidPassword = await UserService.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const tokens = JWTUtils.generateTokenPair({
      userId: user.id,
      email: user.email
    });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isVerified: user.is_verified,
          isGithubVerified: user.is_github_verified,
          emailVerified: user.email_verified,
          avatarUrl: user.avatar_url
        },
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn
      }
    });
  });

  // Refresh access token
  static refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    // Verify refresh token
    const decoded = JWTUtils.verifyRefreshToken(refreshToken);
    
    // Get user from database
    const user = await UserService.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Generate new tokens
    const tokens = JWTUtils.generateTokenPair({
      userId: user.id,
      email: user.email
    });

    // Set new refresh token as HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn
      }
    });
  });

  // Logout user
  static logout = asyncHandler(async (req, res) => {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logout successful'
    });
  });

  // Get current user profile
  static getProfile = asyncHandler(async (req, res) => {
    const user = await UserService.getUserWithOAuth(req.user.id);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatar_url,
          isVerified: user.is_verified,
          createdAt: user.created_at,
          oauthAccounts: user.oauth_accounts
        }
      }
    });
  });

  // Update user profile
  static updateProfile = asyncHandler(async (req, res) => {
    const { name, avatar_url } = req.body;
    const userId = req.user.id;

    const updatedUser = await UserService.updateProfile(userId, {
      name,
      avatar_url
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          avatarUrl: updatedUser.avatar_url,
          isVerified: updatedUser.is_verified
        }
      }
    });
  });

  // Change password
  static changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get user with password hash
    const user = await UserService.findByEmail(req.user.email);
    
    if (!user.password_hash) {
      throw new ValidationError('Cannot change password for OAuth-only accounts');
    }

    // Verify current password
    const isValidPassword = await UserService.verifyPassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Update password
    await UserService.updatePassword(userId, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  });

  // Delete account
  static deleteAccount = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;

    // Get user with password hash
    const user = await UserService.findByEmail(req.user.email);
    
    // If user has password, verify it
    if (user.password_hash) {
      const isValidPassword = await UserService.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        throw new UnauthorizedError('Password is incorrect');
      }
    }

    // Delete user account
    await UserService.deleteUser(userId);

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  });
}

module.exports = AuthController;

