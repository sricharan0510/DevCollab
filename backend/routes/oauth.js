const express = require('express');
const passport = require('../config/passport');
const JWTUtils = require('../utils/jwt');
const OAuthService = require('../services/oauthService');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  asyncHandler(async (req, res) => {
    const user = req.user;
    
    // Generate JWT tokens
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

    // Redirect to frontend with access token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${tokens.accessToken}&success=true`);
  })
);

// GitHub OAuth routes
router.get('/github',
  passport.authenticate('github', { 
    scope: ['user:email'] 
  })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  asyncHandler(async (req, res) => {
    const user = req.user;
    
    // Generate JWT tokens
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

    // Redirect to frontend with access token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${tokens.accessToken}&success=true`);
  })
);

// Link OAuth account to existing user
router.post('/link/:provider', authenticateToken, asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const userId = req.user.id;

  if (!['google', 'github'].includes(provider)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OAuth provider'
    });
  }

  // Store user ID in session for linking
  req.session.linkUserId = userId;

  // Redirect to OAuth provider
  res.json({
    success: true,
    message: `Redirect to ${provider} for account linking`,
    redirectUrl: `/api/auth/${provider}?link=true`
  });
}));

// Unlink OAuth account
router.delete('/unlink/:provider', authenticateToken, asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const userId = req.user.id;

  if (!['google', 'github'].includes(provider)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OAuth provider'
    });
  }

  // Check if user has a password or other OAuth accounts
  const userProviders = await OAuthService.getUserProviders(userId);
  const user = await UserService.findById(userId);

  if (!user.password_hash && userProviders.length === 1) {
    return res.status(400).json({
      success: false,
      message: 'Cannot unlink the only authentication method. Please set a password first.'
    });
  }

  // Unlink the OAuth account
  const unlinkedAccount = await OAuthService.unlinkOAuth(userId, provider);

  if (!unlinkedAccount) {
    return res.status(404).json({
      success: false,
      message: `${provider} account not found`
    });
  }

  res.json({
    success: true,
    message: `${provider} account unlinked successfully`
  });
}));

// Get user's OAuth accounts
router.get('/accounts', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const oauthAccounts = await OAuthService.findByUserId(userId);

  const accounts = oauthAccounts.map(account => ({
    provider: account.provider,
    providerId: account.provider_id,
    linkedAt: account.created_at
  }));

  res.json({
    success: true,
    data: {
      accounts
    }
  });
}));

// OAuth error handler
router.get('/error', (req, res) => {
  res.status(400).json({
    success: false,
    message: 'OAuth authentication failed',
    error: req.query.error || 'Unknown error'
  });
});

module.exports = router;


// GitHub verification for existing users
router.post('/verify-github', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  // Check if user already has GitHub verified
  const user = await UserService.findById(userId);
  if (user.is_github_verified) {
    return res.json({
      success: true,
      message: 'GitHub already verified'
    });
  }

  // Check if user has GitHub OAuth account
  const hasGitHub = await UserService.hasGitHubAccount(userId);
  if (!hasGitHub) {
    return res.status(400).json({
      success: false,
      message: 'No GitHub account linked. Please link your GitHub account first.'
    });
  }

  // Mark GitHub as verified
  const updatedUser = await UserService.verifyGitHub(userId);

  res.json({
    success: true,
    message: 'GitHub verification completed',
    data: {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isVerified: updatedUser.is_verified,
        isGithubVerified: updatedUser.is_github_verified,
        emailVerified: updatedUser.email_verified
      }
    }
  });
}));

