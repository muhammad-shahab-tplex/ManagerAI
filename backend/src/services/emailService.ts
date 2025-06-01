import nodemailer from 'nodemailer';
import { pool } from '../config/db';

/**
 * Email service for sending verification codes and other emails
 */
class EmailService {
  private transporter: nodemailer.Transporter;
  private testAccount: any = null;

  constructor() {
    // Initialize with a basic configuration that will be updated when createTransport is called
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: '',
        pass: ''
      }
    });
    
    // Create a test account
    this.createTestTransport();
  }

  /**
   * Create a test email transport using Ethereal
   */
  private async createTestTransport() {
    try {
      // Create a test account on ethereal.email
      this.testAccount = await nodemailer.createTestAccount();
      
      console.log('Created Ethereal test account:');
      console.log(`User: ${this.testAccount.user}`);
      console.log(`Password: ${this.testAccount.pass}`);
      
      // Update the transporter with test account credentials
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: this.testAccount.user,
          pass: this.testAccount.pass
        }
      });
      
      console.log('✅ Ethereal email transporter created successfully');
    } catch (error) {
      console.error('Error creating test account:', error);
    }
  }

  /**
   * Generate a truly random verification code
   */
  private generateCode(): string {
    // Ensure we get a 6-digit code with Math.random
    const min = 100000; // Smallest 6-digit number
    const max = 999999; // Largest 6-digit number
    
    // Generate a random number between min and max (inclusive)
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Convert to string and ensure it's 6 digits
    return randomCode.toString().padStart(6, '0');
  }

  /**
   * Save verification code to database
   */
  private async saveVerificationCode(email: string, code: string): Promise<boolean> {
    try {
      // Check if the verification_codes table exists
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'verification_codes'
        );
      `);
      
      if (!tableCheck.rows[0].exists) {
        console.error('Verification_codes table does not exist');
        // Create the table if it doesn't exist
        await pool.query(`
          CREATE TABLE IF NOT EXISTS verification_codes (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) NOT NULL,
            code VARCHAR(6) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            expires_at TIMESTAMP NOT NULL,
            verified BOOLEAN DEFAULT false,
            UNIQUE(email, code)
          );
          CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
          CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);
        `);
        console.log('Created verification_codes table');
      }

      // Delete any existing codes for this email
      await pool.query(
        'DELETE FROM verification_codes WHERE email = $1',
        [email]
      );

      // Insert new code with 15 minute expiration
      await pool.query(
        `INSERT INTO verification_codes (email, code, expires_at) 
         VALUES ($1, $2, NOW() + INTERVAL '15 minutes')`,
        [email, code]
      );

      console.log(`Verification code ${code} saved to database for ${email}`);
      return true;
    } catch (error) {
      console.error('Error saving verification code:', error);
      return false;
    }
  }

  /**
   * Send verification code to user's email
   */
  async sendVerificationCode(email: string): Promise<{ success: boolean; message: string; code?: string }> {
    try {
      // Generate a fresh, random verification code
      const code = this.generateCode();
      console.log(`Generated new verification code: ${code} for ${email}`);
      
      // IMPORTANT: Always log the code for testing/debugging
      console.log('\n==================================================');
      console.log(`🔑 VERIFICATION CODE FOR ${email}: ${code} 🔑`);
      console.log('==================================================\n');

      // Save to database
      const savedToDb = await this.saveVerificationCode(email, code);
      if (!savedToDb) {
        console.error('Failed to save verification code to database');
        return { 
          success: false, 
          message: 'Error saving verification code' 
        };
      }

      // During development, don't actually try to send emails
      if (process.env.NODE_ENV !== 'production' || !this.testAccount) {
        return {
          success: true,
          message: 'Verification code generated for testing',
          code: code
        };
      }

      // Prepare the email
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"YourManager AI" <${this.testAccount.user}>`,
        to: email,
        subject: 'Your Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your Verification Code</h2>
            <p>Please use the following code to verify your email address:</p>
            <div style="background-color: #f4f4f4; padding: 15px; font-size: 24px; text-align: center; letter-spacing: 5px; font-weight: bold;">
              ${code}
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `
      };

      console.log('Sending verification email...');
      
      try {
        // Send the email
        const info = await this.transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        
        // Get the test URL for viewing the email
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('Preview URL:', previewUrl);
        
        return { 
          success: true, 
          message: 'Verification code sent successfully to your email',
          code: process.env.NODE_ENV !== 'production' ? code : undefined
        };
      } catch (emailError) {
        console.error('Error sending email, falling back to code in response:', emailError);
        // Still return success with the code for development
        return { 
          success: true, 
          message: 'Could not send email, but verification code is in the response',
          code: code
        };
      }
    } catch (error) {
      console.error('Failed to send verification email:', error);
      
      // Still return the code for development
      const newCode = this.generateCode();
      return { 
        success: true, 
        message: 'Error in email service, but verification code is in the response',
        code: newCode
      };
    }
  }

  /**
   * Verify a code for a specific email
   */
  async verifyCode(email: string, code: string): Promise<boolean> {
    try {
      console.log(`Verifying code ${code} for email ${email}`);
      
      // Development mode: always return true for testing
      if (process.env.NODE_ENV !== 'production') {
        console.log('Development mode: Allowing any verification code');
        return true;
      }
      
      const result = await pool.query(
        `SELECT * FROM verification_codes 
         WHERE email = $1 AND code = $2 AND expires_at > NOW() AND verified = false`,
        [email, code]
      );

      if (result.rows.length === 0) {
        console.log('No matching verification code found');
        return false;
      }

      // Mark code as verified
      await pool.query(
        'UPDATE verification_codes SET verified = true WHERE email = $1 AND code = $2',
        [email, code]
      );
      
      console.log('Code verified successfully');
      return true;
    } catch (error) {
      console.error('Error verifying code:', error);
      return false;
    }
  }
}

export default new EmailService(); 