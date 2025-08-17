const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  async sendVerificationEmail(email, name, otp) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .otp-code { font-size: 24px; font-weight: bold; color: #007bff; text-align: center; padding: 20px; background-color: white; border: 2px dashed #007bff; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'User'}!</h2>
              <p>Thank you for registering with our service. To complete your registration, please verify your email address using the verification code below:</p>
              
              <div class="otp-code">
                ${otp}
              </div>
              
              <p>This verification code will expire in ${process.env.OTP_EXPIRES_MINUTES || 10} minutes.</p>
              
              <p>If you didn't create an account with us, please ignore this email.</p>
              
              <p>Best regards,<br>The Security Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email, name, otp) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .otp-code { font-size: 24px; font-weight: bold; color: #dc3545; text-align: center; padding: 20px; background-color: white; border: 2px dashed #dc3545; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'User'}!</h2>
              <p>We received a request to reset your password. Use the verification code below to reset your password:</p>
              
              <div class="otp-code">
                ${otp}
              </div>
              
              <p>This verification code will expire in ${process.env.OTP_EXPIRES_MINUTES || 10} minutes.</p>
              
              <div class="warning">
                <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email and consider changing your password as a precaution.
              </div>
              
              <p>Best regards,<br>The Security Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Our Platform!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Our Platform!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'User'}!</h2>
              <p>Welcome to our platform! Your email has been successfully verified and your account is now active.</p>
              
              <p>You can now enjoy all the features of our platform. If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              
              <p>Thank you for joining us!</p>
              
              <p>Best regards,<br>The Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  // Send security alert email
  async sendSecurityAlert(email, name, action, details = {}) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Security Alert - Account Activity',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Security Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ffc107; color: #212529; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .alert { background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 4px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Security Alert</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'User'}!</h2>
              <p>We're writing to inform you about recent activity on your account:</p>
              
              <div class="alert">
                <strong>Action:</strong> ${action}<br>
                <strong>Time:</strong> ${new Date().toLocaleString()}<br>
                ${details.ip ? `<strong>IP Address:</strong> ${details.ip}<br>` : ''}
                ${details.userAgent ? `<strong>Device:</strong> ${details.userAgent}<br>` : ''}
              </div>
              
              <p>If this was you, no further action is required. If you don't recognize this activity, please:</p>
              <ul>
                <li>Change your password immediately</li>
                <li>Review your account settings</li>
                <li>Contact our support team</li>
              </ul>
              
              <p>Best regards,<br>The Security Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Security alert email sent:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending security alert email:', error);
      return false;
    }
  }
}

const emailService = new EmailService();

module.exports = emailService;

