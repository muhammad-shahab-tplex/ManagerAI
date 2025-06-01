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

// Animation variants for the checkmark
const circleVariants = {
  hidden: { 
    scale: 0,
    opacity: 0
  },
  visible: { 
    scale: 1,
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: "easeOut" 
    }
  }
};

const checkVariants = {
  hidden: { 
    pathLength: 0,
    opacity: 0
  },
  visible: { 
    pathLength: 1,
    opacity: 1,
    transition: { 
      delay: 0.2,
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

// Card variants for the success animation
const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Text variants for smooth fade-in
const textVariants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: 0.2,
      ease: "easeOut"
    }
  }
};

// Animation styles with card design
const successAnimationStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)'
  } as React.CSSProperties,
  card: {
    backgroundColor: 'rgba(26, 36, 56, 0.7)',
    borderRadius: '20px',
    padding: '25px 30px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), 0 0 10px rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '300px',
    position: 'relative',
    border: 'none',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)'
  } as React.CSSProperties,
  svgContainer: {
    margin: '15px 0',
    position: 'relative'
  } as React.CSSProperties,
  title: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    textAlign: 'center',
    textShadow: '0 1px 3px rgba(0,0,0,0.3)'
  } as React.CSSProperties,
  message: {
    color: 'rgba(240, 240, 240, 0.9)',
    fontSize: '16px',
    textAlign: 'center',
    marginTop: '15px'
  } as React.CSSProperties,
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
    top: 0,
    left: 0,
    zIndex: -1
  } as React.CSSProperties
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
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successTitle, setSuccessTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError('You must agree to the Terms and Privacy Policy to continue.');
      return;
    }
    
    if (!email || !password || !verificationCode) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Then, call the registration API directly
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`;
      
      const response = await axios.post(apiUrl, {
        name: email.split('@')[0], // Using part of email as name
        email,
        password,
        verificationCode
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        // Store user data and token in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // Set success messages
        setSuccessTitle(`Welcome, ${response.data.user?.name || 'User'}!`);
        setSuccessMessage('Your account has been created successfully. Redirecting to dashboard...');
        
        // Show success animation before redirecting
        setShowSuccessAnimation(true);
        // Redirect happens after animation completes via handleAnimationComplete
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    // Wait a bit after animation completes for better UX
    setTimeout(() => {
      window.location.href = '/';
    }, 300);
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
        
        // If there's a code in the response (development mode), use it
        if (response.data.code) {
          setVerificationCode(response.data.code);
          successMessage = 'Verification code auto-filled for development.';
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
        {/* Adding the keyframes animation for the success message */}
        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </Head>

      {showSuccessAnimation && (
        <div style={successAnimationStyle.overlay}>
          <motion.div
            style={successAnimationStyle.card}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <motion.div style={successAnimationStyle.svgContainer} variants={textVariants}>
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="150"
                height="150"
                viewBox="0 0 150 150"
                initial="hidden"
                animate="visible"
                onAnimationComplete={handleAnimationComplete}
              >
                <motion.circle
                  cx="75"
                  cy="75"
                  r="70"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="5"
                  variants={circleVariants}
                />
                <motion.path
                  d="M 40 75 L 65 100 L 110 50"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={checkVariants}
                />
              </motion.svg>
            </motion.div>
            <motion.div style={successAnimationStyle.title} variants={textVariants}>
              {successTitle}
            </motion.div>
            <motion.div style={successAnimationStyle.message} variants={textVariants}>
              {successMessage}
            </motion.div>
          </motion.div>
        </div>
      )}

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