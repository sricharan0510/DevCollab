const { query } = require('../config/database');
const crypto = require('crypto');

class OTPService {
  // Generate a 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create OTP for userId or email (for pre-registration)
  static async createOTP(identifier, isEmail = false) {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRES_MINUTES) || 10) * 60 * 1000);

    if (isEmail) {
      // Delete any existing OTPs for this email
      await query('DELETE FROM otps WHERE email = $1', [identifier]);
      // Create new OTP
      const result = await query(
        'INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3) RETURNING *',
        [identifier, otp, expiresAt]
      );
      return result.rows[0];
    } else {
      // Delete any existing OTPs for this user
      await query('DELETE FROM otps WHERE user_id = $1', [identifier]);
      // Create new OTP
      const result = await query(
        'INSERT INTO otps (user_id, otp, expires_at) VALUES ($1, $2, $3) RETURNING *',
        [identifier, otp, expiresAt]
      );
      return result.rows[0];
    }
  }

  // Verify OTP (by userId or email)
  static async verifyOTP(identifier, otp, isEmail = false) {
    let result;
    if (isEmail) {
      result = await query(
        'SELECT * FROM otps WHERE email = $1 AND otp = $2 AND expires_at > NOW()',
        [identifier, otp]
      );
    } else {
      result = await query(
        'SELECT * FROM otps WHERE user_id = $1 AND otp = $2 AND expires_at > NOW()',
        [identifier, otp]
      );
    }
    if (result.rows.length === 0) {
      return false;
    }
    // Delete the used OTP
    await query('DELETE FROM otps WHERE id = $1', [result.rows[0].id]);
    return true;
  }

  // Find valid OTP for user
  static async findValidOTP(userId) {
    const result = await query(
      'SELECT * FROM otps WHERE user_id = $1 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    return result.rows[0];
  }

  // Delete expired OTPs (cleanup function)
  static async deleteExpiredOTPs() {
    const result = await query(
      'DELETE FROM otps WHERE expires_at <= NOW() RETURNING id',
      []
    );

    return result.rows.length;
  }

  // Delete all OTPs for user
  static async deleteUserOTPs(userId) {
    const result = await query(
      'DELETE FROM otps WHERE user_id = $1 RETURNING id',
      [userId]
    );

    return result.rows.length;
  }

  // Check if user/email has recent OTP (rate limiting)
  static async hasRecentOTP(identifier, minutesAgo = 1, isEmail = false) {
    const timeThreshold = new Date(Date.now() - minutesAgo * 60 * 1000);
    let result;
    if (isEmail) {
      result = await query(
        'SELECT id FROM otps WHERE email = $1 AND created_at > $2',
        [identifier, timeThreshold]
      );
    } else {
      result = await query(
        'SELECT id FROM otps WHERE user_id = $1 AND created_at > $2',
        [identifier, timeThreshold]
      );
    }
    return result.rows.length > 0;
  }

  // Get OTP statistics for user
  static async getOTPStats(userId) {
    const result = await query(
      `SELECT 
         COUNT(*) as total_otps,
         COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active_otps,
         MAX(created_at) as last_otp_created
       FROM otps 
       WHERE user_id = $1`,
      [userId]
    );

    return result.rows[0];
  }
}

module.exports = OTPService;

