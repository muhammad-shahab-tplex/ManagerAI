import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Success checkmark component
const SuccessCheckmark = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <motion.div 
      className="success-checkmark"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </motion.div>
  );
};

// Toast notification component
const ToastNotification = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <motion.div 
      className={`toast-notification ${type}`}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
    >
      {type === 'success' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      )}
      <p>{message}</p>
      <button className="close-btn" onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </motion.div>
  );
};

// Section animations
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Stagger animation for sections
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Modal animation
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Backdrop animation
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const [showSuccessCheckmark, setShowSuccessCheckmark] = useState(false);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);
  
  // Profile section state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  
  // Billing section state
  const [currentPlan, setCurrentPlan] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  
  // AI Preferences section state
  const [assistantTone, setAssistantTone] = useState('auto');
  const [assistantName, setAssistantName] = useState('');
  const [dailyBriefTime, setDailyBriefTime] = useState('08:00');
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  
  // Security section state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Helper for showing toast notifications
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };
  
  // Helper for clearing notifications
  const clearNotifications = () => {
    setError('');
    setSuccess('');
  };
  
  // Close modal with escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);
  
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!storedUser || !token) {
        onClose();
        return;
      }
      
      setUser(JSON.parse(storedUser));
      
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`;
        
        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
        
        if (response.data.success) {
          const userData = response.data.data;
          
          // Update profile data
          setName(userData.name || '');
          setEmail(userData.email || '');
          setProfilePictureUrl(userData.profile_picture || '');
          
          // Check if OAuth user
          setIsOAuthUser(userData.auth_provider !== 'local');
          
          // Update billing data if available
          if (userData.subscription) {
            setCurrentPlan(userData.subscription.plan_name || 'Free');
            setRenewalDate(userData.subscription.renewal_date || '');
            setPaymentHistory(userData.payment_history || []);
          }
          
          // Update AI preferences if available
          if (userData.ai_preferences) {
            setAssistantTone(userData.ai_preferences.tone || 'auto');
            setAssistantName(userData.ai_preferences.assistant_name || '');
            setDailyBriefTime(userData.ai_preferences.daily_brief_time || '08:00');
          }
          
          // Update notification settings if available
          if (userData.notification_settings) {
            setEmailNotifications(userData.notification_settings.email || true);
            setWhatsappNotifications(userData.notification_settings.whatsapp || false);
            setInAppNotifications(userData.notification_settings.in_app || true);
          }
          
          // Update security settings if available
          if (userData.security) {
            setTwoFactorEnabled(userData.security.two_factor_enabled || false);
          }
        }
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError('Failed to load account data. Please try again later.');
      }
    };
    
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen, onClose]);
  
  // Update profile handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    clearNotifications();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/profile`;
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      
      if (!isOAuthUser && currentPassword && newPassword) {
        formData.append('current_password', currentPassword);
        formData.append('new_password', newPassword);
      }
      
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
      
      const response = await axios.put(apiUrl, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        // Show success animation
        setShowSuccessCheckmark(true);
        
        // Update local storage with new user data
        const updatedUser = {
          ...user,
          name,
          email,
          profile_picture: response.data.data.profile_picture || profilePictureUrl
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setProfilePictureUrl(response.data.data.profile_picture || profilePictureUrl);
        
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Show toast notification
        setTimeout(() => {
          showToast('Profile updated successfully', 'success');
        }, 1500);
      } else {
        showToast(response.data.message || 'Failed to update profile', 'error');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      showToast(err.response?.data?.message || 'An error occurred while updating your profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update AI preferences handler
  const handleUpdateAIPreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    clearNotifications();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/ai-preferences`;
      
      const response = await axios.put(apiUrl, {
        tone: assistantTone,
        assistant_name: assistantName,
        daily_brief_time: dailyBriefTime
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setShowSuccessCheckmark(true);
        setTimeout(() => {
          showToast('AI preferences updated successfully', 'success');
        }, 1500);
      } else {
        showToast(response.data.message || 'Failed to update AI preferences', 'error');
      }
    } catch (err: any) {
      console.error('Error updating AI preferences:', err);
      showToast(err.response?.data?.message || 'An error occurred while updating your AI preferences', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update notification settings handler
  const handleUpdateNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    clearNotifications();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/notifications`;
      
      const response = await axios.put(apiUrl, {
        email: emailNotifications,
        whatsapp: whatsappNotifications,
        in_app: inAppNotifications
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setShowSuccessCheckmark(true);
        setTimeout(() => {
          showToast('Notification settings updated successfully', 'success');
        }, 1500);
      } else {
        showToast(response.data.message || 'Failed to update notification settings', 'error');
      }
    } catch (err: any) {
      console.error('Error updating notification settings:', err);
      showToast(err.response?.data?.message || 'An error occurred while updating your notification settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout from all devices handler
  const handleLogoutAllDevices = async () => {
    if (window.confirm('Are you sure you want to log out from all devices?')) {
      setIsLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/logout-all`;
        
        const response = await axios.post(apiUrl, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        
        if (response.data.success) {
          // Clear local storage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          onClose();
          // Force page reload to reflect logged out state
          window.location.reload();
        } else {
          showToast(response.data.message || 'Failed to log out from all devices', 'error');
        }
      } catch (err: any) {
        console.error('Error logging out from all devices:', err);
        showToast(err.response?.data?.message || 'An error occurred', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Toggle two-factor authentication handler
  const handleToggleTwoFactor = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/security/two-factor`;
      
      const response = await axios.put(apiUrl, {
        enabled: !twoFactorEnabled
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setTwoFactorEnabled(!twoFactorEnabled);
        showToast(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully`, 'success');
      } else {
        showToast(response.data.message || 'Failed to update two-factor authentication', 'error');
      }
    } catch (err: any) {
      console.error('Error updating two-factor authentication:', err);
      showToast(err.response?.data?.message || 'An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete account handler
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.prompt('Please type "DELETE" to confirm account deletion') === 'DELETE') {
        setIsLoading(true);
        
        try {
          const token = localStorage.getItem('token');
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users`;
          
          const response = await axios.delete(apiUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          });
          
          if (response.data.success) {
            // Clear local storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            onClose();
            // Force page reload to reflect deleted account
            window.location.href = '/';
          } else {
            showToast(response.data.message || 'Failed to delete account', 'error');
          }
        } catch (err: any) {
          console.error('Error deleting account:', err);
          showToast(err.response?.data?.message || 'An error occurred', 'error');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };
  
  // Reset AI preferences handler
  const handleResetAIPreferences = async () => {
    if (window.confirm('Are you sure you want to reset all AI preferences to default?')) {
      setIsLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/ai-preferences/reset`;
        
        const response = await axios.post(apiUrl, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        
        if (response.data.success) {
          // Reset AI preferences state
          setAssistantTone('auto');
          setAssistantName('');
          setDailyBriefTime('08:00');
          showToast('AI preferences reset to default', 'success');
        } else {
          showToast(response.data.message || 'Failed to reset AI preferences', 'error');
        }
      } catch (err: any) {
        console.error('Error resetting AI preferences:', err);
        showToast(err.response?.data?.message || 'An error occurred', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePictureUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  // Stop propagation on modal click to prevent closing
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-container">
          <motion.div 
            className="modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          >
            <motion.div 
              className="account-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleModalClick}
            >
              <button className="modal-close-btn" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="account-modal-content">
                <div className="account-sidebar">
                  <ul className="account-nav">
                    <li className="user-profile">
                      {profilePictureUrl ? (
                        <img src={profilePictureUrl} alt={name} />
                      ) : (
                        <div className="profile-initials">
                          {name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                      <span>{name || user?.email || 'User'}</span>
                    </li>
                    
                    <div className="account-nav-section">Account</div>
                    <li 
                      className={activeSection === 'profile' ? 'active' : ''}
                      onClick={() => setActiveSection('profile')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Profile
                    </li>
                    <li 
                      className={activeSection === 'billing' ? 'active' : ''}
                      onClick={() => setActiveSection('billing')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                      Plan & Billing
                    </li>
                    <li 
                      className={activeSection === 'ai-preferences' ? 'active' : ''}
                      onClick={() => setActiveSection('ai-preferences')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2m0 10v-1"></path>
                        <circle cx="12" cy="12" r="1"></circle>
                      </svg>
                      AI Preferences
                    </li>
                    <li 
                      className={activeSection === 'notifications' ? 'active' : ''}
                      onClick={() => setActiveSection('notifications')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      Notifications
                    </li>
                    <li 
                      className={activeSection === 'security' ? 'active' : ''}
                      onClick={() => setActiveSection('security')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Security
                    </li>
                    <li 
                      className={activeSection === 'danger-zone' ? 'active danger' : 'danger'}
                      onClick={() => setActiveSection('danger-zone')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      Danger Zone
                    </li>
                  </ul>
                </div>
                
                <div className="account-main">
                  {activeSection === 'profile' && (
                    <div className="account-section">
                      <h2>Profile Settings</h2>
                      
                      <div className="settings-group">
                        <div className="section-header">Personal Information</div>
                        <div className="profile-container">
                          <div className="profile-picture-container">
                            <label className="profile-picture" htmlFor="profile-picture-input">
                              {profilePictureUrl ? (
                                <img src={profilePictureUrl} alt={name} />
                              ) : (
                                <div className="profile-initials">
                                  {name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'}
                                </div>
                              )}
                            </label>
                            <label className="profile-picture-upload" htmlFor="profile-picture-input">
                              Change Picture
                              <input 
                                id="profile-picture-input"
                                type="file" 
                                accept="image/*" 
                                onChange={handleProfilePictureChange}
                                hidden
                              />
                            </label>
                          </div>
                          
                          <form className="profile-form" onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                              <label htmlFor="name">Full Name</label>
                              <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Your full name"
                              />
                            </div>
                            
                            <div className="form-group">
                              <label htmlFor="email">Email Address</label>
                              <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Your email address"
                              />
                            </div>
                            
                            <button 
                              type="submit" 
                              className="btn-save"
                              disabled={isLoading}
                            >
                              {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                          </form>
                        </div>
                      </div>
                      
                      {!isOAuthUser ? (
                        <div className="settings-group">
                          <div className="section-header">Change Password</div>
                          <form className="profile-form" onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                              <label htmlFor="current-password">Current Password</label>
                              <input
                                type="password"
                                id="current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                placeholder="Your current password"
                              />
                            </div>
                            
                            <div className="form-group">
                              <label htmlFor="new-password">New Password</label>
                              <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="New password"
                              />
                            </div>
                            
                            <div className="form-group">
                              <label htmlFor="confirm-password">Confirm New Password</label>
                              <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm new password"
                              />
                            </div>
                            
                            <button 
                              type="submit" 
                              className="btn-save"
                              disabled={isLoading}
                            >
                              {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="settings-group">
                          <div className="section-header">Login Method</div>
                          <div className="login-method">
                            <p>You're signed in using <strong>{user?.auth_provider || 'OAuth'}</strong>. Password management is not available.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeSection === 'billing' && (
                    <div className="account-section">
                      <h2>Plan & Billing</h2>
                      
                      <div className="settings-group">
                        <div className="section-header">Current Plan</div>
                        <div className="current-plan">
                          <div className="plan-info">
                            <div className="plan-name">
                              {currentPlan || 'Free Plan'}
                              {currentPlan === 'Pro' && <span className="plan-badge">Current</span>}
                            </div>
                            <div className="plan-features">
                              {currentPlan === 'Free' && (
                                <ul>
                                  <li>Basic AI features</li>
                                  <li>Limited requests per day</li>
                                  <li>Standard support</li>
                                </ul>
                              )}
                              {currentPlan === 'Pro' && (
                                <ul>
                                  <li>Advanced AI features</li>
                                  <li>Unlimited requests</li>
                                  <li>Priority support</li>
                                  <li>Custom AI preferences</li>
                                </ul>
                              )}
                              {currentPlan === 'Elite' && (
                                <ul>
                                  <li>All Pro features</li>
                                  <li>Dedicated account manager</li>
                                  <li>Custom API access</li>
                                  <li>Enterprise-grade security</li>
                                </ul>
                              )}
                            </div>
                            
                            {renewalDate && (
                              <div className="renewal-info">
                                <p>Your plan will renew on <strong>{renewalDate}</strong></p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="plan-actions">
                          {currentPlan !== 'Elite' && (
                            <button className="btn-primary" onClick={() => window.open('/pricing', '_blank')}>
                              Upgrade Plan
                            </button>
                          )}
                          {currentPlan !== 'Free' && (
                            <button className="btn-secondary" onClick={() => showToast('Downgrade functionality coming soon!', 'success')}>
                              Downgrade Plan
                            </button>
                          )}
                          {currentPlan !== 'Free' && (
                            <button className="btn-danger" onClick={() => {
                              if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
                                showToast('Subscription cancellation in progress...', 'success');
                              }
                            }}>
                              Cancel Subscription
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {paymentHistory.length > 0 && (
                        <div className="settings-group">
                          <div className="section-header">Payment History</div>
                          <div className="payment-history">
                            <table className="payment-table">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Description</th>
                                  <th>Amount</th>
                                  <th>Status</th>
                                  <th>Receipt</th>
                                </tr>
                              </thead>
                              <tbody>
                                {paymentHistory.map((payment, index) => (
                                  <tr key={index}>
                                    <td>{payment.date || 'N/A'}</td>
                                    <td>{payment.description || 'Subscription Payment'}</td>
                                    <td>${payment.amount || '0.00'}</td>
                                    <td>
                                      <span className={`payment-status ${payment.status?.toLowerCase() || 'completed'}`}>
                                        {payment.status || 'Completed'}
                                      </span>
                                    </td>
                                    <td>
                                      <button className="btn-link" onClick={() => window.open(payment.receipt_url || '#', '_blank')}>
                                        View
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      
                      <div className="settings-group">
                        <div className="section-header">Payment Method</div>
                        <div className="payment-method">
                          <p>Manage your payment methods and billing details</p>
                          <button className="btn-primary" onClick={() => showToast('Payment method management coming soon!', 'success')}>
                            Manage Payment Methods
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeSection === 'ai-preferences' && (
                    <div className="account-section">
                      <h2>AI Preferences</h2>
                      
                      <div className="settings-group">
                        <div className="section-header">Response Settings</div>
                        
                        <div className="setting-item">
                          <div className="setting-info">
                            <div className="setting-title">Assistant Reply Tone</div>
                            <p className="setting-description">Select how you would like your AI assistant to communicate with you.</p>
                          </div>
                          <div className="setting-control">
                            <div className="select-dropdown">
                              <select 
                                value={assistantTone} 
                                onChange={(e) => setAssistantTone(e.target.value)}
                              >
                                <option value="auto">Auto (Default)</option>
                                <option value="formal">Formal</option>
                                <option value="casual">Casual</option>
                                <option value="friendly">Friendly</option>
                                <option value="professional">Professional</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="setting-item">
                          <div className="setting-info">
                            <div className="setting-title">Assistant Name</div>
                            <p className="setting-description">Customize the name of your AI assistant.</p>
                          </div>
                          <div className="setting-control">
                            <input 
                              type="text" 
                              value={assistantName} 
                              onChange={(e) => setAssistantName(e.target.value)}
                              placeholder="Default Assistant"
                              className="setting-input"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="settings-group">
                        <div className="section-header">Daily Brief Settings</div>
                        
                        <div className="setting-item">
                          <div className="setting-info">
                            <div className="setting-title">Daily Brief Time</div>
                            <p className="setting-description">Select the time you'd like to receive your daily brief.</p>
                          </div>
                          <div className="setting-control">
                            <input 
                              type="time" 
                              value={dailyBriefTime} 
                              onChange={(e) => setDailyBriefTime(e.target.value)}
                              className="setting-input time-input"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className="btn-save"
                        onClick={handleUpdateAIPreferences}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save AI Preferences'}
                      </button>
                    </div>
                  )}
                  
                  {activeSection === 'notifications' && (
                    <div className="account-section">
                      <h2>Notifications</h2>
                      
                      <div className="settings-group">
                        <div className="section-header">Notification Preferences</div>
                        
                        <div className="setting-item">
                          <div className="setting-info">
                            <div className="setting-title">Email Notifications</div>
                            <p className="setting-description">Receive important updates and summaries via email.</p>
                          </div>
                          <div className="setting-control">
                            <label className="toggle-switch">
                              <input 
                                type="checkbox" 
                                checked={emailNotifications} 
                                onChange={() => setEmailNotifications(!emailNotifications)}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="setting-item">
                          <div className="setting-info">
                            <div className="setting-title">WhatsApp Daily Brief</div>
                            <p className="setting-description">Receive your daily summary and reminders via WhatsApp.</p>
                          </div>
                          <div className="setting-control">
                            <label className="toggle-switch">
                              <input 
                                type="checkbox" 
                                checked={whatsappNotifications} 
                                onChange={() => setWhatsappNotifications(!whatsappNotifications)}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="setting-item">
                          <div className="setting-info">
                            <div className="setting-title">In-App Notifications</div>
                            <p className="setting-description">Receive notifications and reminders within the application.</p>
                          </div>
                          <div className="setting-control">
                            <label className="toggle-switch">
                              <input 
                                type="checkbox" 
                                checked={inAppNotifications} 
                                onChange={() => setInAppNotifications(!inAppNotifications)}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className="btn-save"
                        onClick={handleUpdateNotifications}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save Notification Preferences'}
                      </button>
                    </div>
                  )}
                  
                  {activeSection === 'security' && (
                    <div className="account-section">
                      <h2>Security</h2>
                      
                      <div className="settings-group">
                        <div className="section-header">Two-Factor Authentication</div>
                        <div className="setting-item">
                          <div className="setting-info">
                            <div className="setting-title">Enable Two-Factor Authentication</div>
                            <p className="setting-description">Add an extra layer of security to your account by requiring a verification code in addition to your password.</p>
                          </div>
                          <div className="setting-control">
                            <label className="toggle-switch">
                              <input 
                                type="checkbox" 
                                checked={twoFactorEnabled} 
                                onChange={handleToggleTwoFactor}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </div>
                        </div>
                        
                        {twoFactorEnabled && (
                          <div className="two-factor-info">
                            <p>Two-factor authentication is enabled for your account. When signing in, you will need to provide a verification code in addition to your password.</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="settings-group">
                        <div className="section-header">Active Sessions</div>
                        <div className="active-sessions">
                          <div className="session-item current">
                            <div className="session-info">
                              <div className="device-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                  <line x1="8" y1="21" x2="16" y2="21"></line>
                                  <line x1="12" y1="17" x2="12" y2="21"></line>
                                </svg>
                              </div>
                              <div className="session-details">
                                <div className="device-name">Current Device</div>
                                <div className="session-meta">
                                  <span className="browser">Chrome on Windows</span>
                                  <span className="location">• {new Date().toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="session-actions">
                              <span className="current-label">Current</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="security-actions">
                          <button 
                            className="btn-secondary"
                            onClick={handleLogoutAllDevices}
                            disabled={isLoading}
                          >
                            Sign Out From All Devices
                          </button>
                        </div>
                      </div>
                      
                      <div className="settings-group">
                        <div className="section-header">Password Security</div>
                        <div className="security-info">
                          <p>We recommend using a strong, unique password for your account. If you suspect any unauthorized access, change your password immediately.</p>
                          <button 
                            className="btn-primary"
                            onClick={() => setActiveSection('profile')}
                          >
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeSection === 'danger-zone' && (
                    <div className="account-section">
                      <h2>Danger Zone</h2>
                      
                      <div className="settings-group danger-zone-group">
                        <div className="section-header danger">Dangerous Actions</div>
                        
                        <div className="danger-item">
                          <div className="danger-info">
                            <div className="danger-title">Reset AI Preferences</div>
                            <p className="danger-description">This will reset all AI preferences to their default values. This action cannot be undone.</p>
                          </div>
                          <div className="danger-action">
                            <button 
                              className="btn-warning"
                              onClick={handleResetAIPreferences}
                              disabled={isLoading}
                            >
                              Reset AI Preferences
                            </button>
                          </div>
                        </div>
                        
                        <div className="danger-item critical">
                          <div className="danger-info">
                            <div className="danger-title">Delete Account</div>
                            <p className="danger-description">This will permanently delete your account and all associated data. This action cannot be undone.</p>
                          </div>
                          <div className="danger-action">
                            <button 
                              className="btn-danger"
                              onClick={handleDeleteAccount}
                              disabled={isLoading}
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="danger-note">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <p>Please be careful with these actions as they can lead to data loss and cannot be reversed.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AccountModal; 