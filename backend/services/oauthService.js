const { query } = require('../config/database');

class OAuthService {
  // Create or update OAuth account
  static async createOrUpdateOAuthAccount({
    userId,
    provider,
    providerId,
    accessToken,
    refreshToken,
    tokenExpiresAt
  }) {
    const result = await query(
      `INSERT INTO oauth_accounts (user_id, provider, provider_id, access_token, refresh_token, token_expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (provider, provider_id)
       DO UPDATE SET
         user_id = EXCLUDED.user_id,
         access_token = EXCLUDED.access_token,
         refresh_token = EXCLUDED.refresh_token,
         token_expires_at = EXCLUDED.token_expires_at
       RETURNING *`,
      [userId, provider, providerId, accessToken, refreshToken, tokenExpiresAt]
    );
    
    return result.rows[0];
  }

  // Find OAuth account by provider and provider ID
  static async findByProviderAndId(provider, providerId) {
    const result = await query(
      'SELECT * FROM oauth_accounts WHERE provider = $1 AND provider_id = $2',
      [provider, providerId]
    );
    
    return result.rows[0];
  }

  // Find OAuth accounts by user ID
  static async findByUserId(userId) {
    const result = await query(
      'SELECT * FROM oauth_accounts WHERE user_id = $1',
      [userId]
    );
    
    return result.rows;
  }

  // Find user by OAuth provider
  static async findUserByOAuth(provider, providerId) {
    const result = await query(
      `SELECT u.*, oa.provider, oa.provider_id
       FROM users u
       JOIN oauth_accounts oa ON u.id = oa.user_id
       WHERE oa.provider = $1 AND oa.provider_id = $2`,
      [provider, providerId]
    );
    
    return result.rows[0];
  }

  // Link OAuth account to existing user
  static async linkOAuthToUser(userId, provider, providerId, accessToken, refreshToken, tokenExpiresAt) {
    const result = await query(
      `INSERT INTO oauth_accounts (user_id, provider, provider_id, access_token, refresh_token, token_expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, provider, providerId, accessToken, refreshToken, tokenExpiresAt]
    );
    
    return result.rows[0];
  }

  // Unlink OAuth account
  static async unlinkOAuth(userId, provider) {
    const result = await query(
      'DELETE FROM oauth_accounts WHERE user_id = $1 AND provider = $2 RETURNING *',
      [userId, provider]
    );
    
    return result.rows[0];
  }

  // Update OAuth tokens
  static async updateTokens(oauthAccountId, accessToken, refreshToken, tokenExpiresAt) {
    const result = await query(
      `UPDATE oauth_accounts 
       SET access_token = $1, refresh_token = $2, token_expires_at = $3
       WHERE id = $4
       RETURNING *`,
      [accessToken, refreshToken, tokenExpiresAt, oauthAccountId]
    );
    
    return result.rows[0];
  }

  // Get all OAuth providers for a user
  static async getUserProviders(userId) {
    const result = await query(
      'SELECT provider FROM oauth_accounts WHERE user_id = $1',
      [userId]
    );
    
    return result.rows.map(row => row.provider);
  }
}

module.exports = OAuthService;

