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

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Call the login API
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`;
      
      const response = await axios.post(apiUrl, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        // First, push any scrolled content back to top to prevent jumping
        window.scrollTo(0, 0);
        
        // Store user data and token in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // Set success messages
        setSuccessTitle(`Welcome back, ${response.data.user?.name || 'User'}!`);
        setSuccessMessage('You have successfully signed in. Redirecting to dashboard...');
        
        // If remember me is checked, we could set a longer expiry, but that's
        // typically handled on the server side with cookie expiry
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        // Show success animation before redirecting
        setShowSuccessAnimation(true);
        // Redirect happens after animation completes
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.response?.data?.message || 'An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnimationComplete = () => {
    // Prevent scroll behavior during transition
    const html = document.documentElement;
    const originalScrollPosition = window.pageYOffset;
    
    // Apply a temporary fix position to prevent jumping
    html.style.position = 'fixed';
    html.style.top = `-${originalScrollPosition}px`;
    html.style.width = '100%';
    
    // Wait a bit after animation completes for better UX
    setTimeout(() => {
      // Restore normal scroll behavior before redirecting
      html.style.position = '';
      html.style.top = '';
      html.style.width = '';
      window.scrollTo(0, originalScrollPosition);
      
      // Use a very small delay before redirect to ensure smooth transition
      requestAnimationFrame(() => {
        window.location.href = '/';
      });
    }, 300);
  };

  // OAuth sign-in options
  const oauthProviders = [
    {
      name: 'Google',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <g transform="matrix(1, 0, 0, 1, 0, 0)">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </g>
        </svg>
      )
    },
    {
      name: 'GitHub',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="#ffffff" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    }
  ];

  return (
    <>
      <Head>
        <title>Sign In | YourManager</title>
        <meta name="description" content="Sign in to your YourManager account - AI Chief-of-Staff that saves you 10+ hours per week" />
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
              <motion.div style={successAnimationStyle.glow}></motion.div>
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
        className="signin-page"
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
              <Logo size={40} />
          </motion.div>
          </Link>
        
        <motion.div 
          className="signin-content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="signin-header" variants={fadeIn}>
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue your productivity journey</p>
          </motion.div>

          {error && <div className="error-message">{error}</div>}

          <motion.form 
            onSubmit={handleSubmit} 
            className="signin-form"
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

            <motion.div className="form-group" variants={fadeIn}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </motion.div>

            <motion.div className="form-options" variants={fadeIn}>
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link href="/forgot-password">
                <span className="forgot-password">Forgot password?</span>
              </Link>
            </motion.div>

            <motion.button 
              type="submit" 
              className={`signin-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </motion.form>

          <motion.div className="divider" variants={fadeIn}>
            <span>Or continue with</span>
          </motion.div>

          <motion.div className="oauth-options" variants={fadeIn}>
            {oauthProviders.map((provider, index) => (
              <motion.button 
                key={index} 
                className="oauth-button"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(27, 38, 59, 0.9)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="oauth-icon">{provider.icon}</span>
                <span>{provider.name}</span>
              </motion.button>
            ))}
          </motion.div>

          <motion.div className="signup-option" variants={fadeIn}>
            <p>Don't have an account? <Link href="/signup"><span className="signup-link">Sign up</span></Link></p>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default SignInPage; 