import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  logout,
  sendVerificationCode
} from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-verification-code', sendVerificationCode);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

export default router; 