import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Logo from '../components/Logo';
import { motion } from 'framer-motion';
import axios from 'axios';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.6
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError('You must agree to the Terms and Privacy Policy to continue.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // In a real app, you would call your registration API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just redirect to a dashboard page
      window.location.href = '/dashboard';
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    // Validate email
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSuccess('');
    setIsSendingCode(true);

    try {
      console.log('Sending verification code to:', email);
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/send-verification-code`;
      console.log('API URL:', apiUrl);
      
      // First test if the API is reachable
      try {
        const testResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/test`);
        console.log('Test API response:', testResponse.data);
      } catch (testErr) {
        console.error('Error connecting to test API:', testErr);
      }
      
      const response = await axios.post(apiUrl, { email }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      console.log('Response:', response.data);
      
      if (response.data.success) {
        let successMessage = 'Verification code sent! Please check your email.';
        
        // If there's a note about checking server logs, include it
        if (response.data.note) {
          successMessage += ' Note: ' + response.data.note;
        }
        
        setSuccess(successMessage);
      } else {
        setError(response.data.message || 'Failed to send verification code.');
      }
    } catch (err: any) {
      console.error('Error sending verification code:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Network error: Cannot connect to server. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'Failed to send verification code. Please try again.');
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | YourManager</title>
        <meta name="description" content="Create your YourManager account - AI Chief-of-Staff that saves you 10+ hours per week" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

      <motion.div 
        className="signup-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/" className="logo-link">
          <motion.div 
            className="logo-wrapper" 
            style={{ position: 'fixed', top: '5px', left: '5px', zIndex: 1000 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
              <Logo size={32} />
          </motion.div>
          </Link>
        
        <motion.div 
          className="signup-content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="signup-header" variants={fadeIn}>
            <h1>Get Started</h1>
            <p>Create your account and start your productivity journey</p>
          </motion.div>

          {error && <motion.div className="error-message" variants={fadeIn}>{error}</motion.div>}
          {success && <motion.div className="success-message" variants={fadeIn}>{success}</motion.div>}

          <motion.form 
            onSubmit={handleSubmit} 
            className="signup-form"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="form-group" variants={fadeIn}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </motion.div>

            <motion.div className="form-group verification-code-group" variants={fadeIn}>
              <label htmlFor="verificationCode">Verification Code</label>
              <div className="verification-code-container">
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                required
              />
                <button 
                  type="button" 
                  className="send-code-button"
                  onClick={handleSendCode}
                  disabled={isSendingCode}
                >
                  {isSendingCode ? 'Sending...' : 'Send Code'}
                </button>
            </div>
            </motion.div>

            <motion.div className="form-group" variants={fadeIn}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </motion.div>

            <motion.div className="terms-agreement" variants={fadeIn}>
              <div className="terms-checkbox-container">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="terms-checkbox"
                />
                <label htmlFor="agreeToTerms">
                  I agree to the <Link href="/terms"><span className="terms-link">Terms</span></Link> and <Link href="/privacy"><span className="terms-link">Privacy Policy</span></Link> of ScamLock's
                </label>
            </div>
            </motion.div>

            <motion.button 
              type="submit" 
              className={`signup-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </motion.form>

          <motion.div className="or-continue" variants={fadeIn}>
            Or continue with
          </motion.div>

          <motion.div className="oauth-options" variants={fadeIn}>
            <motion.button 
              className="oauth-button"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(27, 38, 59, 0.9)' }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285f4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34a853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fbbc05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ea4335"/>
              </svg>
              <span>Google</span>
            </motion.button>
          </motion.div>

          <motion.div className="signin-option" variants={fadeIn}>
            <p>Already have an account? <Link href="/signin"><span className="signin-link">Sign in</span></Link></p>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default SignUpPage; 