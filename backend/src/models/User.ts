import { pool } from '../config/db';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  subscription_tier: string;
  google_id?: string;
  microsoft_id?: string;
  reset_password_token?: string;
  reset_password_expire?: Date;
  created_at: Date;
}

export interface IUserPreferences {
  id: number;
  user_id: number;
  email_frequency: string;
  auto_reply_enabled: boolean;
  auto_reply_confidence_threshold: number;
  working_hours_start: string;
  working_hours_end: string;
  timezone: string;
  created_at: Date;
  updated_at: Date;
}

export interface IIntegrationToken {
  id: number;
  user_id: number;
  provider: string;
  connected: boolean;
  access_token?: string;
  refresh_token?: string;
  expiry_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IToneProfile {
  id: number;
  user_id: number;
  profile_data: any[];
  created_at: Date;
  updated_at: Date;
}

export interface IUserComplete extends IUser {
  preferences?: IUserPreferences;
  integrations?: {
    google?: IIntegrationToken;
    microsoft?: IIntegrationToken;
  };
  tone_profile?: IToneProfile;
}

class User {
  /**
   * Find a user by ID
   */
  static async findById(id: number): Promise<IUserComplete | null> {
    try {
      // Get user
      const userResult = await pool.query(
        'SELECT * FROM users WHERE id = $1', 
        [id]
      );
      
      if (userResult.rows.length === 0) {
        return null;
      }
      
      const user = userResult.rows[0];
      
      // Get user preferences
      const preferencesResult = await pool.query(
        'SELECT * FROM user_preferences WHERE user_id = $1',
        [id]
      );
      
      // Get integrations
      const integrationsResult = await pool.query(
        'SELECT * FROM integration_tokens WHERE user_id = $1',
        [id]
      );
      
      // Get tone profile
      const toneProfileResult = await pool.query(
        'SELECT * FROM tone_profiles WHERE user_id = $1',
        [id]
      );
      
      // Build complete user object
      const userComplete: IUserComplete = {
        ...user,
        preferences: preferencesResult.rows[0] || undefined,
        integrations: {
          google: integrationsResult.rows.find(i => i.provider === 'google'),
          microsoft: integrationsResult.rows.find(i => i.provider === 'microsoft')
        },
        tone_profile: toneProfileResult.rows[0] || undefined
      };
      
      return userComplete;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }
  
  /**
   * Find a user by email
   */
  static async findByEmail(email: string): Promise<IUserComplete | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1', 
        [email]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      // Get user ID
      const userId = result.rows[0].id;
      
      // Use findById to get complete user data
      return await this.findById(userId);
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }
  
  /**
   * Create a new user
   */
  static async create(userData: { 
    name: string; 
    email: string; 
    password: string;
    role?: string;
    subscription_tier?: string;
  }): Promise<IUserComplete | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (
          name, email, password, role, subscription_tier
        ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          userData.name,
          userData.email,
          hashedPassword,
          userData.role || 'user',
          userData.subscription_tier || 'free'
        ]
      );
      
      // The triggers will automatically create related records
      
      await client.query('COMMIT');
      
      // Get the complete user
      return await this.findById(userResult.rows[0].id);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating user:', error);
      return null;
    } finally {
      client.release();
    }
  }
  
  /**
   * Generate a signed JWT token
   */
  static getSignedJwtToken(userId: number): string {
    const secretKey = process.env.JWT_SECRET || 'your_jwt_secret_change_in_production';
    const signOptions: SignOptions = { expiresIn: process.env.JWT_EXPIRE || '30d' };
    
    // Use Buffer to handle the secret
    const secretBuffer = Buffer.from(secretKey, 'utf8');
    
    return jwt.sign(
      { id: userId },
      secretBuffer,
      signOptions
    );
  }
  
  /**
   * Match user entered password to hashed password in database
   */
  static async matchPassword(enteredPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
}

export default User; 