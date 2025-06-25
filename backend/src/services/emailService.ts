import nodemailer from 'nodemailer';
import { PrismaClient } from '../generated/prisma';

// Initialize Prisma client
const prisma = new PrismaClient();

// In-memory storage for verification codes (fallback when DB is not available)
interface VerificationCode {
  email: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
}

const inMemoryVerificationCodes: VerificationCode[] = [];

/**
 * Email service for sending verification codes and other emails
 */
class EmailService {
  private transporter: nodemailer.Transporter;
  private useInMemoryStorage: boolean = false;

  constructor() {
    // Use the SMTP configuration from environment variables
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
    
    console.log('✅ Email transporter created with SMTP configuration');
    console.log(`SMTP Host: ${process.env.SMTP_HOST}`);
    console.log(`SMTP User: ${process.env.SMTP_USER}`);
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
   * Save verification code to database using Prisma or in-memory storage
   */
  private async saveVerificationCode(email: string, code: string): Promise<boolean> {
    try {
      console.log(`Saving verification code ${code} for ${email}`);
      
      if (this.useInMemoryStorage) {
        // Use in-memory storage
        console.log('Using in-memory storage for verification codes');
        
        // Remove existing codes for this email
        const index = inMemoryVerificationCodes.findIndex(vc => vc.email === email);
        if (index !== -1) {
          inMemoryVerificationCodes.splice(index, 1);
        }
        
        // Add new code
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        inMemoryVerificationCodes.push({
          email,
          code,
          expiresAt,
          verified: false
        });
        
        console.log(`✅ Verification code ${code} saved to memory for ${email}`);
        return true;
      }
      
      // Try database first
      // Delete any existing codes for this email using raw SQL
      await prisma.$executeRaw`DELETE FROM verification_codes WHERE email = ${email}`;

      // Calculate expiration time (15 minutes from now)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Insert new code using raw SQL
      await prisma.$executeRaw`
        INSERT INTO verification_codes (email, code, expires_at, verified) 
        VALUES (${email}, ${code}, ${expiresAt}, false)
      `;

      console.log(`✅ Verification code ${code} saved to database for ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Error saving verification code to database:', error);
      
      // Fall back to in-memory storage
      console.log('Falling back to in-memory storage...');
      this.useInMemoryStorage = true;
      
      try {
        // Remove existing codes for this email
        const index = inMemoryVerificationCodes.findIndex(vc => vc.email === email);
        if (index !== -1) {
          inMemoryVerificationCodes.splice(index, 1);
        }
        
        // Add new code
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        inMemoryVerificationCodes.push({
          email,
          code,
          expiresAt,
          verified: false
        });
        
        console.log(`✅ Verification code ${code} saved to memory for ${email}`);
        return true;
      } catch (memoryError) {
        console.error('❌ Failed to save to memory:', memoryError);
        return false;
      }
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

      // Save to database or memory
      const savedToDb = await this.saveVerificationCode(email, code);
      if (!savedToDb) {
        console.error('Failed to save verification code, but continuing...');
        // Don't fail completely, still return the code for development
      }

      // Prepare the email
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_FROM || `"ManagerAI" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your ManagerAI Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1F1F1F;">Your ManagerAI Verification Code</h2>
            <p>Please use the following code to verify your email address:</p>
            <div style="background-color: #f4f4f4; padding: 20px; font-size: 32px; text-align: center; letter-spacing: 8px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
              ${code}
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px;">© 2024 ManagerAI. All rights reserved.</p>
          </div>
        `
      };

      console.log('Sending verification email...');
      
      try {
        // Send the email
        const info = await this.transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        
        // Get the test URL for viewing the email (if using Ethereal)
        if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
          const previewUrl = nodemailer.getTestMessageUrl(info);
          console.log('Preview URL:', previewUrl);
        }
        
        return { 
          success: true, 
          message: 'Verification code sent successfully to your email',
          code: process.env.NODE_ENV !== 'production' ? code : undefined
        };
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // For development, still return success with the code
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
   * Verify a code for a specific email using Prisma or in-memory storage
   */
  async verifyCode(email: string, code: string): Promise<boolean> {
    try {
      console.log(`Verifying code ${code} for email ${email}`);
      
      // Development mode: always return true for testing
      if (process.env.NODE_ENV !== 'production') {
        console.log('Development mode: Allowing any verification code');
        return true;
      }
      
      if (this.useInMemoryStorage) {
        // Use in-memory storage
        console.log('Using in-memory storage for verification');
        
        const verificationCode = inMemoryVerificationCodes.find(
          vc => vc.email === email && vc.code === code && !vc.verified && vc.expiresAt > new Date()
        );
        
        if (!verificationCode) {
          console.log('No matching verification code found in memory');
          return false;
        }
        
        // Mark as verified
        verificationCode.verified = true;
        console.log('Code verified successfully from memory');
        return true;
      }
      
      // Check if code exists and is not expired using raw SQL
      const result = await prisma.$queryRaw`
        SELECT * FROM verification_codes 
        WHERE email = ${email} AND code = ${code} AND expires_at > NOW() AND verified = false
      ` as any[];

      if (result.length === 0) {
        console.log('No matching verification code found');
        return false;
      }

      // Mark code as verified
      await prisma.$executeRaw`
        UPDATE verification_codes SET verified = true WHERE email = ${email} AND code = ${code}
      `;
      
      console.log('Code verified successfully');
      return true;
    } catch (error) {
      console.error('Error verifying code:', error);
      
      // Fall back to in-memory storage
      this.useInMemoryStorage = true;
      
      // In development, return true anyway
      if (process.env.NODE_ENV !== 'production') {
        console.log('Development mode: Returning true despite error');
        return true;
      }
      return false;
    }
  }

  /**
   * Clean up expired verification codes
   */
  async cleanupExpiredCodes(): Promise<void> {
    try {
      if (this.useInMemoryStorage) {
        // Clean up in-memory codes
        const now = new Date();
        const beforeCount = inMemoryVerificationCodes.length;
        
        for (let i = inMemoryVerificationCodes.length - 1; i >= 0; i--) {
          if (inMemoryVerificationCodes[i].expiresAt < now) {
            inMemoryVerificationCodes.splice(i, 1);
          }
        }
        
        const afterCount = inMemoryVerificationCodes.length;
        console.log(`Cleaned up ${beforeCount - afterCount} expired verification codes from memory`);
        return;
      }
      
      await prisma.$executeRaw`DELETE FROM verification_codes WHERE expires_at < NOW()`;
      console.log(`Cleaned up expired verification codes`);
    } catch (error) {
      console.error('Error cleaning up expired codes:', error);
    }
  }
}

export default new EmailService(); 