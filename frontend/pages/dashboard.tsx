import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      // No token, redirect to signin
      router.push('/signin');
      return;
    }

    // For now, we'll just show a welcome message
    // In a real app, you'd fetch user data from the API
    setUser({ name: 'User' }); // Placeholder
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Inter, sans-serif'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - ManagerAI</title>
        <meta name="description" content="Your ManagerAI Dashboard" />
      </Head>

      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'Inter, sans-serif'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0
          }}>
            ManagerAI Dashboard
          </h1>
          
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </header>

        {/* Main Content */}
        <main style={{
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Welcome Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              🎉 Welcome to ManagerAI!
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              lineHeight: '1.75',
              marginBottom: '1.5rem'
            }}>
              Your account has been successfully created. You now have access to your AI Chief-of-Staff that will help you save 10+ hours per week.
            </p>
            
            <div style={{
              backgroundColor: '#dbeafe',
              border: '1px solid #3b82f6',
              borderRadius: '0.375rem',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{
                color: '#1e40af',
                fontSize: '0.875rem',
                margin: 0
              }}>
                <strong>🚀 Getting Started:</strong> Your AI assistant is ready to help with email management, calendar organization, and daily briefings.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Email Management */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  backgroundColor: '#dbeafe',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  marginRight: '1rem'
                }}>
                  📧
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Email Management
                </h3>
              </div>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: 0
              }}>
                Connect your email to get smart digests and AI-generated replies that match your writing style.
              </p>
            </div>

            {/* Calendar Organization */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  backgroundColor: '#dcfce7',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  marginRight: '1rem'
                }}>
                  📅
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Calendar Organization
                </h3>
              </div>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: 0
              }}>
                Optimize your schedule with intelligent meeting planning and focus time blocks.
              </p>
            </div>

            {/* Daily Briefings */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  backgroundColor: '#fef3c7',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  marginRight: '1rem'
                }}>
                  📋
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Daily Briefings
                </h3>
              </div>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: 0
              }}>
                Start each day with a personalized summary of your priorities and upcoming tasks.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              🎯 Next Steps
            </h3>
            <div style={{
              display: 'grid',
              gap: '0.75rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem'
              }}>
                <span style={{ marginRight: '0.75rem' }}>1️⃣</span>
                <span style={{ color: '#374151' }}>Connect your email account (Coming Soon)</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem'
              }}>
                <span style={{ marginRight: '0.75rem' }}>2️⃣</span>
                <span style={{ color: '#374151' }}>Set up your calendar integration (Coming Soon)</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem'
              }}>
                <span style={{ marginRight: '0.75rem' }}>3️⃣</span>
                <span style={{ color: '#374151' }}>Customize your AI assistant preferences (Coming Soon)</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard; 