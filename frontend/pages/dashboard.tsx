import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  RiDashboardFill, 
  RiSettings4Line, 
  RiLogoutBoxLine,
  RiAppsLine
} from 'react-icons/ri';
import { LuCalendarClock, LuListTodo } from 'react-icons/lu';
import { FiUsers, FiSearch, FiMail, FiBell } from 'react-icons/fi';
import { HiLightBulb } from 'react-icons/hi';
import { IoSettingsSharp } from 'react-icons/io5';
import { TbDeviceMobileDown } from 'react-icons/tb';

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
    setUser({ name: 'User', email: 'user@example.com' }); // Placeholder
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Donezo</title>
        <meta name="description" content="Your AI Chief-of-Staff Dashboard" />
      </Head>

      <div className="dashboard-wrapper">
        <div className="dashboard-inner">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-header">
              <div className="logo">
                <div className="logo-icon">
                  <RiAppsLine />
                </div>
                <span className="logo-text">Donezo</span>
              </div>
            </div>

            <nav className="sidebar-nav">
              <div className="nav-sections-top">
              <div className="nav-section">
                <span className="nav-section-title">MENU</span>
                <ul className="nav-list">
                    <li className="sidebar-nav-item active">
                    <span className="nav-icon">
                        <RiDashboardFill />
                    </span>
                    Dashboard
                  </li>
                    <li className="sidebar-nav-item">
                    <span className="nav-icon">
                        <LuListTodo />
                    </span>
                      My Tasks
                    <span className="nav-badge">24</span>
                  </li>
                    <li className="sidebar-nav-item">
                    <span className="nav-icon">
                        <LuCalendarClock />
                    </span>
                      Meetings
                  </li>
                    <li className="sidebar-nav-item">
                    <span className="nav-icon">
                        <HiLightBulb />
                    </span>
                      Insights
                  </li>
                    <li className="sidebar-nav-item">
                    <span className="nav-icon">
                        <FiUsers />
                    </span>
                      Collaborators
                  </li>
                </ul>
                </div>
              </div>

              <div className="nav-sections-bottom">
                {/* Mobile App Download Card */}
                <div className="mobile-app-card">
                  <div className="app-card-header">
                    <div className="app-icon">
                      <TbDeviceMobileDown />
                    </div>
                    <div className="coming-soon-badge">Coming Soon</div>
                  </div>
                  <div className="app-card-content">
                    <h4>Download our Mobile App</h4>
                    <p>Get easy to use on mobile way</p>
                    <button className="download-btn" disabled>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </nav>


          </aside>

          {/* Main Content */}
          <main className="main-content">
            {/* Header */}
            <header className="dashboard-header">
              <div className="header-left">
                <div className="search-container">
                  <FiSearch className="search-icon" />
                  <input type="text" placeholder="Search task" className="search-input" />
                  <span className="search-shortcut">⌘F</span>
                </div>
              </div>
              <div className="header-right">
                <button className="header-btn">
                  <FiMail />
                </button>
                <button className="header-btn">
                  <FiBell />
                </button>
                <div className="user-profile">
                  <img src="/api/placeholder/32/32" alt="User" className="user-avatar" />
                  <div className="user-info">
                    <span className="user-name">Totok Michael</span>
                    <span className="user-email">tmichael20@mail.com</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="dashboard-content">
              <div className="page-header">
                <div className="page-header-left">
                  <h1 className="page-title">Dashboard</h1>
                  <p className="page-subtitle">Plan, prioritize, and accomplish your tasks with AI assistance.</p>
                </div>
                <div className="page-actions">
                  <button className="dashboard-btn dashboard-btn-primary">+ Add Task</button>
                  <button className="dashboard-btn dashboard-btn-secondary">Import Data</button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="dashboard-stats-grid">
                <div className="stat-card primary">
                  <div className="stat-header">
                    <h3>Tasks Managed by AI</h3>
                    <span className="stat-icon">📋</span>
                  </div>
                  <div className="dashboard-stat-value">156</div>
                  <div className="stat-change positive">
                    <span className="change-icon">📈</span>
                    Increased from last month
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Focus Sessions Completed</h3>
                    <span className="stat-icon">⏱️</span>
                  </div>
                  <div className="dashboard-stat-value">42</div>
                  <div className="stat-change positive">
                    <span className="change-icon">📈</span>
                    Increased from last month
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Smart Replies Sent</h3>
                    <span className="stat-icon">💬</span>
                  </div>
                  <div className="dashboard-stat-value">89</div>
                  <div className="stat-change positive">
                    <span className="change-icon">📈</span>
                    Increased from last month
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Inbox Summarized</h3>
                    <span className="stat-icon">📨</span>
                  </div>
                  <div className="dashboard-stat-value">7</div>
                  <div className="stat-change neutral">
                    On Discuss
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <h3>AI Usage Analytics</h3>
                    <span className="stat-icon">📊</span>
                  </div>
                  <div className="dashboard-stat-value">
                    <div className="mini-chart">
                      <div className="mini-bar" style={{height: '60%'}}></div>
                      <div className="mini-bar" style={{height: '80%'}}></div>
                      <div className="mini-bar" style={{height: '70%'}}></div>
                      <div className="mini-bar" style={{height: '100%'}}></div>
                    </div>
                  </div>
                  <div className="chart-labels-mini">
                    <span>M</span><span>T</span><span>W</span><span>T</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="dashboard-grid">
                {/* Left Column */}
                <div className="dashboard-left">
                  {/* AI Usage Analytics */}
                  <div className="dashboard-card analytics-card">
                    <h3>AI Usage Analytics</h3>
                    <div className="chart-container">
                      <div className="chart">
                        <div className="chart-bars">
                          <div className="chart-bar" style={{height: '60%'}}></div>
                          <div className="chart-bar" style={{height: '80%'}}></div>
                          <div className="chart-bar" style={{height: '70%'}}></div>
                          <div className="chart-bar" style={{height: '90%'}}></div>
                          <div className="chart-bar" style={{height: '65%'}}></div>
                          <div className="chart-bar" style={{height: '75%'}}></div>
                          <div className="chart-bar" style={{height: '85%'}}></div>
                        </div>
                        <div className="chart-labels">
                          <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions by AI */}
                  <div className="dashboard-card suggestions-card">
                    <div className="card-header">
                      <h3>Suggestions by AI</h3>
                      <button className="dashboard-btn dashboard-btn-outline">+ New</button>
                    </div>
                    <div className="suggestions-list">
                      <div className="suggestion-item">
                        <div className="suggestion-icon blue">🚀</div>
                        <div className="suggestion-content">
                          <h4>Optimize Email Workflow</h4>
                          <p>Due date: Nov 26, 2024</p>
                        </div>
                      </div>
                      <div className="suggestion-item">
                        <div className="suggestion-icon teal">🌊</div>
                        <div className="suggestion-content">
                          <h4>Schedule Deep Work</h4>
                          <p>Due date: Nov 28, 2024</p>
                        </div>
                      </div>
                      <div className="suggestion-item">
                        <div className="suggestion-icon green">📊</div>
                        <div className="suggestion-content">
                          <h4>Review Weekly Metrics</h4>
                          <p>Due date: Nov 30, 2024</p>
                        </div>
                      </div>
                      <div className="suggestion-item">
                        <div className="suggestion-icon yellow">📄</div>
                        <div className="suggestion-content">
                          <h4>Automate Report Generation</h4>
                          <p>Due date: Dec 5, 2024</p>
                        </div>
                      </div>
                      <div className="suggestion-item">
                        <div className="suggestion-icon purple">🔍</div>
                        <div className="suggestion-content">
                          <h4>AI Summary Review</h4>
                          <p>Due date: Dec 8, 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column */}
                <div className="dashboard-middle">
                  {/* Daily AI Brief */}
                  <div className="dashboard-card brief-card">
                    <h3>Daily AI Brief</h3>
                    <div className="brief-content">
                      <div className="brief-item">
                        <div className="brief-icon">📅</div>
                        <div className="brief-text">
                          <h4>Morning Focus Session</h4>
                          <p>Time: 09:00 am - 11:00 am</p>
                        </div>
                      </div>
                      <button className="dashboard-btn dashboard-btn-primary brief-btn">Start Focus Mode</button>
                    </div>
                  </div>

                  {/* AI Progress */}
                  <div className="dashboard-card progress-card">
                    <h3>AI Progress</h3>
                    <div className="progress-circle">
                      <div className="circle-chart">
                        <div className="circle-fill" style={{'--progress': '73%'} as React.CSSProperties}></div>
                        <div className="circle-content">
                          <span className="progress-value">73%</span>
                          <span className="progress-label">Tasks Automated</span>
                        </div>
                      </div>
                    </div>
                    <div className="progress-legend">
                      <div className="legend-item">
                        <span className="legend-color completed"></span>
                        <span>Completed</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color in-progress"></span>
                        <span>In Progress</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color pending"></span>
                        <span>Pending</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="dashboard-right">
                  {/* Time Tracker */}
                  <div className="dashboard-card time-tracker-card">
                    <h3 className="signature-text">Time Tracker</h3>
                    <div className="time-display">
                      <span className="time-value">01:24:08</span>
                    </div>
                    <div className="time-controls">
                      <button className="time-btn pause">⏸️</button>
                      <button className="time-btn stop">⏹️</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 