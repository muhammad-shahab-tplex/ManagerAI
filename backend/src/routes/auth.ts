import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  logout,
  sendVerificationCode,
  verifyCode
} from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-verification-code', sendVerificationCode);
router.post('/verify-code', verifyCode);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

// Error handling middleware
router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Auth route error:', err);
  res.status(500).json({
    success: false,
    message: 'Server error in auth route'
  });
});

export default router; 