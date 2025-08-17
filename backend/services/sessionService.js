const { query } = require('../config/database');
const crypto = require('crypto');

class SessionService {
  // Create a new session
  static async createSession(userId, expiresInDays = 7) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    const result = await query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
      [userId, token, expiresAt]
    );

    return result.rows[0];
  }

  // Find session by token
  static async findByToken(token) {
    const result = await query(
      'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
      [token]
    );

    return result.rows[0];
  }

  // Find user by session token
  static async findUserByToken(token) {
    const result = await query(
      `SELECT u.*, s.token, s.expires_at as session_expires_at
       FROM users u
       JOIN sessions s ON u.id = s.user_id
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    );

    return result.rows[0];
  }

  // Update session expiration
  static async extendSession(sessionId, expiresInDays = 7) {
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    const result = await query(
      'UPDATE sessions SET expires_at = $1 WHERE id = $2 RETURNING *',
      [expiresAt, sessionId]
    );

    return result.rows[0];
  }

  // Delete session
  static async deleteSession(sessionId) {
    const result = await query(
      'DELETE FROM sessions WHERE id = $1 RETURNING *',
      [sessionId]
    );

    return result.rows[0];
  }

  // Delete session by token
  static async deleteSessionByToken(token) {
    const result = await query(
      'DELETE FROM sessions WHERE token = $1 RETURNING *',
      [token]
    );

    return result.rows[0];
  }

  // Delete all sessions for user
  static async deleteUserSessions(userId) {
    const result = await query(
      'DELETE FROM sessions WHERE user_id = $1 RETURNING id',
      [userId]
    );

    return result.rows.length;
  }

  // Delete expired sessions (cleanup function)
  static async deleteExpiredSessions() {
    const result = await query(
      'DELETE FROM sessions WHERE expires_at <= NOW() RETURNING id',
      []
    );

    return result.rows.length;
  }

  // Get all active sessions for user
  static async getUserSessions(userId) {
    const result = await query(
      'SELECT id, token, expires_at, created_at FROM sessions WHERE user_id = $1 AND expires_at > NOW() ORDER BY created_at DESC',
      [userId]
    );

    return result.rows;
  }

  // Get session statistics for user
  static async getSessionStats(userId) {
    const result = await query(
      `SELECT 
         COUNT(*) as total_sessions,
         COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active_sessions,
         MAX(created_at) as last_session_created
       FROM sessions 
       WHERE user_id = $1`,
      [userId]
    );

    return result.rows[0];
  }

  // Validate and refresh session
  static async validateAndRefreshSession(token) {
    const session = await this.findByToken(token);
    
    if (!session) {
      return null;
    }

    // If session expires within 24 hours, extend it
    const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    if (session.expires_at < oneDayFromNow) {
      await this.extendSession(session.id);
    }

    return session;
  }

  // Clean up old sessions (should be run periodically)
  static async cleanupSessions() {
    const expiredCount = await this.deleteExpiredSessions();
    
    // Also delete very old sessions (older than 30 days) even if not expired
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oldSessionsResult = await query(
      'DELETE FROM sessions WHERE created_at < $1 RETURNING id',
      [thirtyDaysAgo]
    );

    return {
      expiredSessions: expiredCount,
      oldSessions: oldSessionsResult.rows.length
    };
  }
}

module.exports = SessionService;

