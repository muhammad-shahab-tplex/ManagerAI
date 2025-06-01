import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import emailService from '../services/emailService';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  verificationCode?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  subscription_tier: string;
}

interface CookieOptions {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
}

// Extend the Request interface to include user property
interface AuthRequest extends Request {
  user?: {
    id: number;
  };
}

/**
 * @desc    Register a user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response) => {
  try {
    console.log('Registration request body:', req.body);
    const { name, email, password, verificationCode }: RegisterRequestBody = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate verification code if provided
    if (verificationCode) {
      console.log(`Validating code ${verificationCode} for ${email}`);
      const isCodeValid = await emailService.verifyCode(email, verificationCode);
      if (!isCodeValid) {
        console.log('Verification code validation failed');
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
      }
      console.log('Verification code is valid');
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'Error creating user'
      });
    }

    console.log('User created successfully:', user.id);
    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequestBody = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await User.matchPassword(password, user.password || '');

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Log user out / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
export const logout = (req: AuthRequest, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

/**
 * @desc    Send verification code to email
 * @route   POST /api/auth/send-verification-code
 * @access  Public
 */
export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    console.log('=== VERIFICATION CODE REQUEST ===');
    console.log('Request body:', req.body);
    
    const { email } = req.body;

    if (!email) {
      console.log('No email provided');
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Send verification code
    console.log('Sending verification code to:', email);
    const result = await emailService.sendVerificationCode(email);

    console.log('Email service result:', result);

    // Return whatever the email service returned - success or error
    if (result.success) {
      // For development: Include the code in the response
      const isDevelopment = process.env.NODE_ENV !== 'production';
      
      return res.status(200).json({
        success: true,
        message: result.message,
        // Only include the code in development mode
        ...(isDevelopment && result.code ? { code: result.code } : {})
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message
      });
    }
  } catch (err) {
    console.error('Error in sendVerificationCode controller:', err);
    res.status(500).json({
      success: false,
      message: 'Server error sending verification code'
    });
  }
};

/**
 * @desc    Verify a code without registering
 * @route   POST /api/auth/verify-code
 * @access  Public
 */
export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and verification code'
      });
    }

    // Verify the code
    const isValid = await emailService.verifyCode(email, code);

    return res.status(200).json({
      success: isValid,
      message: isValid 
        ? 'Verification code is valid' 
        : 'Invalid verification code'
    });
  } catch (err) {
    console.error('Error verifying code:', err);
    res.status(500).json({
      success: false,
      message: 'Server error verifying code'
    });
  }
};

/**
 * Get token from model, create cookie and send response
 */
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  // Create token
  const token = User.getSignedJwtToken(user.id);

  const options: CookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // Enable secure cookies in production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  const userResponse: UserResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    subscription_tier: user.subscription_tier
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userResponse
    });
}; 