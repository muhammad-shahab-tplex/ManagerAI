import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Logo from '../components/Logo';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.password && formData.confirmPassword && formData.agreeToTerms;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Signup attempt:', formData);
      // Redirect to dashboard or verification page
      window.location.href = '/';
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - ManagerAI</title>
        <meta name="description" content="Create your ManagerAI account" />
      </Head>

      <div className="auth-container">
        {/* Left Panel - Form */}
        <div className="auth-left">
          {/* Logo positioned at top left */}
          <Logo className="auth-logo" size={100} />

          {/* Centered Form Content */}
          <div className="form-content">
            <div className="form-header">
              <h1>Create your account</h1>
              <p>Get started with your AI Chief-of-Staff today.</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="signin-form">
              <div className="form-row-group">
                <div className="form-field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPassword ? (
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      ) : (
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      )}
                      {!showPassword && <circle cx="12" cy="12" r="3"/>}
                      {showPassword && <path d="m1 1 22 22"/>}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-wrapper">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showConfirmPassword ? (
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      ) : (
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      )}
                      {!showConfirmPassword && <circle cx="12" cy="12" r="3"/>}
                      {showConfirmPassword && <path d="m1 1 22 22"/>}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="terms-row">
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

            <div className="auth-footer">
              <p>Already have an account? <Link href="/signin" className="signup-link">Sign in</Link></p>
              <div className="copyright">
                © 2024 ManagerAI. All rights reserved.
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Visual Content */}
        <div className="auth-right">
          <div className="visual-card">
            <h2>Join thousands of professionals using AI to work smarter</h2>
            <p>Experience the power of having an AI Chief-of-Staff that understands your business, manages your tasks, and helps you make better decisions every day.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage; 