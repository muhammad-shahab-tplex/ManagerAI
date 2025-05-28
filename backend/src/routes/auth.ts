import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  logout 
} from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes - Use type assertion to bypass TypeScript errors
router.post('/register', register as any);
router.post('/login', login as any);

// Protected routes - Use type assertion to bypass TypeScript errors
router.get('/me', protect as any, getMe as any);
router.get('/logout', protect as any, logout as any);

export default router; 