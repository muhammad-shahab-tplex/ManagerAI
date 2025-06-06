import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import bcrypt from 'bcrypt';

// Create an instance of the user service
const userService = new UserService();

/**
 * User Controller for handling user-related HTTP requests
 */
export class UserController {
  /**
   * Get user profile
   */
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }
      
      const user = await userService.findWithPreferences(userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      // Remove sensitive information
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      console.error('Error in getProfile:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
  
  /**
   * Update user profile
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }
      
      const { name, email } = req.body;
      
      // Validation
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Name and email are required'
        });
      }
      
      // Check if email is already in use (by another user)
      const existingUser = await userService.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use'
        });
      }
      
      // Update user
      const updatedUser = await userService.update(userId, {
        name,
        email
      });
      
      // Remove sensitive information
      const { password, ...userWithoutPassword } = updatedUser;
      
      return res.status(200).json({
        success: true,
        data: userWithoutPassword,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
  
  /**
   * Update user preferences
   */
  async updatePreferences(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }
      
      const { emailFrequency, autoReplyEnabled, autoReplyConfidenceThreshold } = req.body;
      
      // Update preferences
      const updatedPreferences = await userService.updatePreferences(userId, {
        emailFrequency,
        autoReplyEnabled,
        autoReplyConfidenceThreshold
      });
      
      return res.status(200).json({
        success: true,
        data: updatedPreferences,
        message: 'Preferences updated successfully'
      });
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
  
  /**
   * Change user password
   */
  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }
      
      const { currentPassword, newPassword } = req.body;
      
      // Validation
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }
      
      // Get current user with password
      const user = await userService.findById(userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update password
      await userService.update(userId, {
        password: hashedPassword
      });
      
      return res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Error in changePassword:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
} 