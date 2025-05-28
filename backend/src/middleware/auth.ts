import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

/**
 * Protect routes - Verify JWT token and attach user to request
 */
export const protect = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  let token;

  // Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } 
  // Set token from cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_change_in_production');

    if (typeof decoded !== 'object' || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Attach user to request
    req.user = {
      id: decoded.id
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Role-based authorization
 * @param {String[]} roles - Array of authorized roles
 */
export const authorize = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
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

    // Check if user role is included in authorized roles
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

/**
 * Subscription tier authorization
 * @param {String[]} tiers - Array of authorized subscription tiers
 */
export const requireSubscription = (...tiers: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    if (!tiers.includes(req.user.subscriptionTier)) {
      return res.status(403).json({
        success: false,
        message: `Your subscription tier (${req.user.subscriptionTier}) does not allow access to this feature. Please upgrade your plan.`
      });
    }
    
    next();
  };
}; 