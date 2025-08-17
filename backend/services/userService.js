const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class UserService {
  // Create a new user
  static async createUser({ email, password, name, avatar_url = null }) {
    const hashedPassword = password ? await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12) : null;
    
    const result = await query(
      `INSERT INTO users (email, password_hash, name, avatar_url) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, name, avatar_url, is_verified, is_github_verified, email_verified, created_at`,
      [email, hashedPassword, name, avatar_url]
    );
    
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const result = await query(
      'SELECT id, email, name, avatar_url, is_verified, is_github_verified, email_verified, created_at FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }

  // Update user verification status
  static async verifyUser(userId) {
    const result = await query(
      'UPDATE users SET is_verified = true, email_verified = true WHERE id = $1 RETURNING id, email, name, avatar_url, is_verified, is_github_verified, email_verified, created_at',
      [userId]
    );
    return result.rows[0];
  }

  // Update user password
  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    
    const result = await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, email, name, avatar_url, is_verified, created_at',
      [hashedPassword, userId]
    );
    
    return result.rows[0];
  }

  // Update user profile
  static async updateProfile(userId, { name, avatar_url }) {
    const result = await query(
      'UPDATE users SET name = $1, avatar_url = $2 WHERE id = $3 RETURNING id, email, name, avatar_url, is_verified, created_at',
      [name, avatar_url, userId]
    );
    
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Delete user
  static async deleteUser(userId) {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId]
    );
    
    return result.rows[0];
  }

  // Get user with OAuth accounts
  static async getUserWithOAuth(userId) {
    const result = await query(
      `SELECT u.*, 
              COALESCE(
                json_agg(
                  json_build_object(
                    'provider', oa.provider,
                    'provider_id', oa.provider_id
                  )
                ) FILTER (WHERE oa.id IS NOT NULL), 
                '[]'
              ) as oauth_accounts
       FROM users u
       LEFT JOIN oauth_accounts oa ON u.id = oa.user_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    );
    
    return result.rows[0];
  }

  // Verify user email
  static async verifyEmail(userId) {
    const result = await query(
      'UPDATE users SET email_verified = true WHERE id = $1 RETURNING id, email, name, avatar_url, is_verified, is_github_verified, email_verified, created_at',
      [userId]
    );
    
    return result.rows[0];
  }

  // Verify user GitHub
  static async verifyGitHub(userId) {
    const result = await query(
      'UPDATE users SET is_github_verified = true WHERE id = $1 RETURNING id, email, name, avatar_url, is_verified, is_github_verified, email_verified, created_at',
      [userId]
    );
    
    return result.rows[0];
  }

  // Check if user has GitHub OAuth account
  static async hasGitHubAccount(userId) {
    const result = await query(
      'SELECT COUNT(*) as count FROM oauth_accounts WHERE user_id = $1 AND provider = $2',
      [userId, 'github']
    );
    
    return parseInt(result.rows[0].count) > 0;
  }
}

module.exports = UserService;
