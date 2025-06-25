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
    <div ref={elementRef} className="stat-value">
      {prefix}{Math.round(count)}{suffix}
    </div>
  );
};

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  // Add signup-page class to body for CSS targeting
  useEffect(() => {
    document.body.classList.add('signup-page');
    return () => {
      document.body.classList.remove('signup-page');
    };
  }, []);

  // Add showing-verification class when verification form is displayed
  useEffect(() => {
    if (showVerification) {
      document.body.classList.add('showing-verification');
    } else {
      document.body.classList.remove('showing-verification');
    }
    return () => {
      document.body.classList.remove('showing-verification');
    };
  }, [showVerification]);

  const isFormValid = formData.username && formData.email && formData.password && formData.agreeToTerms;
  const isVerificationComplete = verificationCode.every(digit => digit !== '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVerificationChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`verification-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const startResendTimer = () => {
    setResendTimer(57);
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // API call to send verification code
  const sendVerificationCode = async (email: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      console.log('Verification code sent:', data);
      
      // In development, log the code for testing
      if (data.code) {
        console.log('🔑 Verification Code:', data.code);
      }
      
      return data;
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  };

  // API call to verify code
  const verifyVerificationCode = async (email: string, code: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify code');
      }

      return data.success;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  };

  // API call to register user
  const registerUser = async (userData: any, verificationCode: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.username,
          email: userData.email,
          password: userData.password,
          verificationCode: verificationCode
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showVerification) {
      // Handle verification code submission
      if (!isVerificationComplete) {
        setError('Please enter the complete verification code');
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      try {
        const codeString = verificationCode.join('');
        console.log('Verifying code:', codeString);
        
        // First verify the code
        const isCodeValid = await verifyVerificationCode(formData.email, codeString);
        
        if (!isCodeValid) {
          setError('Invalid verification code. Please try again.');
          return;
        }
        
        // If code is valid, register the user
        const registerResult = await registerUser(formData, codeString);
        
        console.log('Registration successful:', registerResult);
        
        // Store the token if provided
        if (registerResult.token) {
          localStorage.setItem('token', registerResult.token);
        }
        
        // Redirect to dashboard or success page
        window.location.href = '/';
        
      } catch (err: any) {
        console.error('Verification/Registration error:', err);
        setError(err.message || 'Invalid verification code. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle initial signup
      if (!formData.username || !formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }
      
      if (!formData.agreeToTerms) {
        setError('Please agree to the Terms of Service');
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      try {
        console.log('Sending verification code to:', formData.email);
        
        // Send verification code
        await sendVerificationCode(formData.email);
        
        // Show verification form
        setShowVerification(true);
        startResendTimer();
        
      } catch (err: any) {
        console.error('Signup error:', err);
        setError(err.message || 'Failed to send verification code. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    
    try {
      console.log('Resending verification code to:', formData.email);
      await sendVerificationCode(formData.email);
      startResendTimer();
    } catch (err: any) {
      console.error('Resend error:', err);
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - ManagerAI</title>
        <meta name="description" content="Create your ManagerAI account" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div className="auth-container">
        {/* Left Panel - Form */}
        <div className="auth-left">
          {/* Logo positioned at top left */}
          <Logo className="auth-logo" size={100} />

          {/* Centered Form Content */}
          <div className="form-content">
{showVerification ? (
              <>
                <div className="form-header">
                  <h1>Verify your email</h1>
                  <p>We've sent a 6-digit verification code to<br/><strong>{formData.email}</strong></p>
                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="form-header">
                  <h1>Create your account</h1>
                  <p>Get started with your AI Chief-of-Staff today.</p>
                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
              </>
            )}

            {showVerification ? (
              <form onSubmit={handleSubmit} className="signin-form">
                <div className="form-field">
                  <label htmlFor="verification-code">Enter verification code</label>
                  <div className="verification-inputs">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`verification-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleVerificationChange(index, e.target.value)}
                        className="verification-input"
                        autoComplete="off"
                      />
                    ))}
                  </div>
                </div>

                <div className="resend-section">
                  <p>
                    Didn't receive a code?{' '}
                    {resendTimer > 0 ? (
                      <span className="resend-timer">Resend code in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="resend-link"
                      >
                        Resend code
                      </button>
                    )}
                  </p>
                </div>

                <button 
                  type="submit" 
                  className={`submit-btn ${isVerificationComplete ? 'active' : ''}`}
                  disabled={isLoading || !isVerificationComplete}
                >
                  {isLoading ? 'Verifying...' : 'Verify and Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="signin-form">
                <div className="form-field">
                <label htmlFor="username">Username</label>
                  <input
                  id="username"
                  name="username"
                    type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                    onChange={handleInputChange}
                    required
                  aria-describedby="username-error"
                  autoComplete="username"
                />
              </div>

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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    aria-describedby="password-error"
                    autoComplete="new-password"
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
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                  />
                  I agree to the <Link href="/terms" className="terms-link">Terms of Service</Link> and <Link href="/privacy" className="terms-link">Privacy Policy</Link>
                </label>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isFormValid ? 'active' : ''}`}
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            )}

{!showVerification && (
              <>
                <div className="divider">
                  <span>or</span>
                </div>

                <button className="google-btn" type="button">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

<div className="auth-footer">
              {showVerification ? (
                <>
                  <p className="terms-notice">
                    By continuing, you agree to ManagerAI's{' '}
                    <Link href="/terms" className="terms-link">Terms of Service</Link> &{' '}
                    <Link href="/privacy" className="terms-link">Privacy Policy</Link>.
                  </p>
                  <div className="copyright">
                    © 2024 ManagerAI. All rights reserved.
                  </div>
                </>
              ) : (
                <>
                  <p>Already have an account? <Link href="/signin" className="signup-link">Sign in</Link></p>
                  <div className="copyright">
                    © 2024 ManagerAI. All rights reserved.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Visual Content */}
        <div className="auth-right">
          <div className="visual-card">
            <h2>Manage Smarter, Not Harder</h2>
            <p className="tagline">Your AI-powered Chief-of-Staff for productivity, clarity, and control.</p>
            
            <div className="stats-grid">
              <div className="stat-box">
                <CountUpAnimation end={10} suffix="K+" duration={2500} />
                <div className="stat-label">Hours Saved</div>
              </div>
              <div className="stat-box">
                <CountUpAnimation end={97} suffix="%" duration={2200} />
                <div className="stat-label">Executive Satisfaction</div>
              </div>
              <div className="stat-box">
                <CountUpAnimation end={24} suffix="/7" duration={2000} />
                <div className="stat-label">AI Availability</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">Instant</div>
                <div className="stat-label">Calendar & Email Sync</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage; 