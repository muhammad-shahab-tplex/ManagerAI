import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  logout 
} from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

export default router; 