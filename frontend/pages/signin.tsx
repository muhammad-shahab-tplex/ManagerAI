import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Logo from '../components/Logo';
import { IoEye, IoEyeOff } from 'react-icons/io5';

// Count Up Animation Component
const CountUpAnimation = ({ end, duration = 2000, suffix = '', prefix = '' }: {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smoother easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = easeOutQuart * end;
            
            // Use decimal precision for ultra-smooth animation
            setCount(Math.round(currentCount * 100) / 100);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <div ref={elementRef} className="auth-stat-value">
      {prefix}{Math.round(count)}{suffix}
    </div>
  );
};

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = formData.email && formData.password;

  // Add signin-page class to body for CSS targeting
  useEffect(() => {
    document.body.classList.add('signin-page');
    return () => document.body.classList.remove('signin-page');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Call the login API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      console.log('Login successful:', result);

      // Store both token and user data
      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      // Redirect to homepage
      window.location.href = '/';
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - ManagerAI</title>
        <meta name="description" content="Sign in to your ManagerAI account" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div className="auth-container">
        {/* Left Panel - Form */}
        <div className="auth-left">
          {/* Logo positioned at top left */}
          <Logo className="auth-logo" size={100} showText={true} />

          {/* Centered Form Content */}
          <div className="form-content">
            <div className="form-header">
              <h1>Welcome back!</h1>
              <p>Enter your credentials to log in</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="signin-form">
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  aria-describedby="email-error"
                  autoComplete="email"
                />
              </div>

              <div className="form-field">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    aria-describedby="password-error"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
{showPassword ? (
                      <IoEyeOff size={20} color="#000000" />
                    ) : (
                      <IoEye size={20} color="#000000" />
                    )}
                  </button>
                </div>
              </div>

              <div className="form-row">
                <label className="checkbox-wrapper">
                  <input
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  Keep me logged in
                </label>
                <Link href="/forgot-password" className="forgot-link">
                  Forgot your password?
                </Link>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isFormValid ? 'active' : ''}`}
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <button className="google-btn" type="button" aria-label="Sign in with Google">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="auth-footer">
              <p>Don't have an account? <Link href="/signup" className="signup-link">Sign up</Link></p>
              
              <p className="terms-notice">
                By continuing, you agree to YourManager's{' '}
                <Link href="/privacy" className="terms-link">Privacy</Link> and{' '}
                <Link href="/terms" className="terms-link">Terms</Link>.
              </p>
              
              <div className="copyright">
                © 2024 ManagerAI. All rights reserved.
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Visual Content */}
        <div className="auth-right">
          <div className="visual-card">
            <h2>Manage Smarter, Not Harder</h2>
            <p className="tagline">Your AI-powered Chief-of-Staff for productivity, clarity, and control.</p>
            
            <div className="auth-stats-grid">
              <div className="auth-stat-box">
                <CountUpAnimation end={10} suffix="K+" duration={2500} />
                <div className="auth-stat-label">Hours Saved</div>
              </div>
              <div className="auth-stat-box">
                <CountUpAnimation end={97} suffix="%" duration={2200} />
                <div className="auth-stat-label">Executive Satisfaction</div>
              </div>
              <div className="auth-stat-box">
                <CountUpAnimation end={24} suffix="/7" duration={2000} />
                <div className="auth-stat-label">AI Availability</div>
              </div>
              <div className="auth-stat-box">
                <div className="auth-stat-value">Instant</div>
                <div className="auth-stat-label">Calendar & Email Sync</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage; 