const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const axios = require('axios');

const UserService = require('../services/userService');
const OAuthService = require('../services/oauthService');

// JWT Strategy for API authentication
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: 'secure-auth-system',
  audience: 'secure-auth-client'
}, async (payload, done) => {
  try {
    const user = await UserService.findById(payload.userId);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google account
    let user = await OAuthService.findUserByOAuth('google', profile.id);

    if (user) {
      // Update OAuth tokens
      await OAuthService.createOrUpdateOAuthAccount({
        userId: user.id,
        provider: 'google',
        providerId: profile.id,
        accessToken,
        refreshToken,
        tokenExpiresAt: null // Google doesn't provide expiration in this format
      });

      return done(null, user);
    }

    // Check if user exists with the same email
    const existingUser = await UserService.findByEmail(profile.emails[0].value);

    if (existingUser) {
      // Link Google account to existing user
      await OAuthService.linkOAuthToUser(
        existingUser.id,
        'google',
        profile.id,
        accessToken,
        refreshToken,
        null
      );

      return done(null, existingUser);
    }

    // Create new user
    const newUser = await UserService.createUser({
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar_url: profile.photos[0]?.value,
      password: null // OAuth users don't have passwords initially
    });

    // Create OAuth account
    await OAuthService.createOrUpdateOAuthAccount({
      userId: newUser.id,
      provider: 'google',
      providerId: profile.id,
      accessToken,
      refreshToken,
      tokenExpiresAt: null
    });

    // Mark user as verified since they authenticated with Google
    // But they still need to verify GitHub later
    await UserService.verifyUser(newUser.id);

    return done(null, newUser);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  scope: ['user:email']  
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Try to get email from profile first
    let primaryEmail = profile.emails?.find(e => e.primary && e.verified)?.value
      || profile.emails?.[0]?.value;

    // If no email returned, fetch via GitHub API
    if (!primaryEmail) {
      const emailResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${accessToken}` }
      });

      const emails = emailResponse.data;
      const primary = emails.find(e => e.primary && e.verified);
      primaryEmail = primary ? primary.email : emails[0]?.email;
    }

    if (!primaryEmail) {
      return done(new Error('No email found in GitHub profile'), null);
    }

    // Check if user already exists with this GitHub account
    let user = await OAuthService.findUserByOAuth('github', profile.id);

    if (user) {
      await OAuthService.createOrUpdateOAuthAccount({
        userId: user.id,
        provider: 'github',
        providerId: profile.id,
        accessToken,
        refreshToken,
        tokenExpiresAt: null
      });
      await UserService.verifyGitHub(user.id);
      return done(null, user);
    }

    // Check if user exists with the same email
    const existingUser = await UserService.findByEmail(primaryEmail);
    if (existingUser) {
      await OAuthService.linkOAuthToUser(
        existingUser.id,
        'github',
        profile.id,
        accessToken,
        refreshToken,
        null
      );
      await UserService.verifyGitHub(existingUser.id);
      return done(null, existingUser);
    }

    // Create new user
    const newUser = await UserService.createUser({
      email: primaryEmail,
      name: profile.displayName || profile.username,
      avatar_url: profile.photos[0]?.value,
      password: null
    });

    await OAuthService.createOrUpdateOAuthAccount({
      userId: newUser.id,
      provider: 'github',
      providerId: profile.id,
      accessToken,
      refreshToken,
      tokenExpiresAt: null
    });

    await UserService.verifyUser(newUser.id);
    await UserService.verifyGitHub(newUser.id);

    return done(null, newUser);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return done(error, null);
  }
}));


// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserService.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

