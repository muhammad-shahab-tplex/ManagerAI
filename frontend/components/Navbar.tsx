import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { motion } from 'framer-motion';
import AccountModal from './AccountModal';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  subscription_tier: string;
}

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
      duration: 0.5,
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
      delay: 0.3,
      duration: 0.5,
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
      duration: 0.4,
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
      duration: 0.4,
      delay: 0.3,
      ease: "easeOut"
    }
  }
};

// Animation styles with card design
const logoutAnimationStyle = {
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)'
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

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutAnimation, setShowLogoutAnimation] = useState(false);
  const [logoutTitle, setLogoutTitle] = useState('');
  const [logoutMessage, setLogoutMessage] = useState('');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Set user name before clearing localStorage
    const userName = user?.name || 'User';
    
    // Set success messages
    setLogoutTitle(`Goodbye, ${userName}!`);
    setLogoutMessage('You have successfully signed out. See you soon!');
    
    // Show logout animation
    setShowLogoutAnimation(true);
    
    // Actual logout happens after animation completes
  };
  
  const handleAnimationComplete = () => {
    // Wait a bit longer after animation completes for better UX
    setTimeout(() => {
      // Perform the actual logout actions
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
      setDropdownOpen(false);
      window.location.href = '/';
    }, 500);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openAccountModal = () => {
    setIsAccountModalOpen(true);
    setDropdownOpen(false);
  };

  return (
    <>
      {showLogoutAnimation && (
        <div style={logoutAnimationStyle.overlay}>
          <motion.div
            style={logoutAnimationStyle.card}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <motion.div style={logoutAnimationStyle.svgContainer} variants={textVariants}>
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
              <motion.div style={logoutAnimationStyle.glow}></motion.div>
            </motion.div>
            <motion.div style={logoutAnimationStyle.title} variants={textVariants}>
              {logoutTitle}
            </motion.div>
            <motion.div style={logoutAnimationStyle.message} variants={textVariants}>
              {logoutMessage}
            </motion.div>
          </motion.div>
        </div>
      )}
    
      <nav className="navbar">
        <div className="navbar-container">
          <Link href="/" className="navbar-left">
            <div className="navbar-brand">
              <Logo size={34} />
              <div className="navbar-logo">YOUR MANAGER</div>
            </div>
          </Link>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link href="/" className="nav-links">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/features" className="nav-links">
                Features
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/how-it-works" className="nav-links">
                How It Works
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/pricing" className="nav-links">
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/testimonials" className="nav-links">
                Testimonials
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/faq" className="nav-links">
                FAQ
              </Link>
            </li>
          </ul>
          
          {isLoggedIn ? (
            <div className="nav-user">
              <Link href="/dashboard">
                <button className="btn-dashboard">Dashboard</button>
              </Link>
              <div className="user-dropdown-container">
                <button 
                  className="btn-user-menu"
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                >
                  <div className="hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </button>
                
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-user-info">
                      <p className="user-name">{user?.name}</p>
                      <p className="user-email">{user?.email}</p>
                    </div>
                    <ul className="dropdown-menu">
                      <li>
                        <button onClick={openAccountModal} className="dropdown-item">
                          Account
                        </button>
                      </li>
                      <li>
                        <button 
                          className="dropdown-item logout-button"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="nav-auth">
              <Link href="/signin">
                <button className="btn-login">Sign in</button>
              </Link>
              <Link href="/signup">
                <button className="btn-signup">Get Started</button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
    </>
  );
};

export default Navbar;