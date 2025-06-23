import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const FeaturesPage: React.FC = () => {
  // Main features data
  const mainFeatures = [
    {
      title: "Smart Email Management",
      description: "AI-powered inbox organization that automatically categorizes and prioritizes your emails.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
    },
    {
      title: "Calendar Optimization",
      description: "Intelligent scheduling that maximizes your productivity and protects your focus time.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
    },
    {
      title: "AI Response Suggestions",
      description: "Context-aware reply suggestions that match your writing style and tone.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    },
    {
      title: "Task Automation",
      description: "Automate repetitive tasks and workflows to save time and reduce manual effort.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
    },
    {
      title: "Analytics & Insights",
      description: "Get detailed insights into your productivity patterns and optimize your workflow.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>
    },
    {
      title: "Team Collaboration",
      description: "Seamlessly collaborate with your team and share insights across your organization.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    }
  ];

  // Detailed features
  const detailedFeatures = [
    {
      title: "Email Management",
      description: "Stop wasting time in your inbox. YourManager automatically categorizes emails, highlights important messages, and can even draft responses in your voice.",
      details: [
        "Smart categorization of incoming emails",
        "Priority inbox management",
        "One-click responses for common emails",
        "Personalized writing style adaptation",
        "Automated follow-up reminders",
        "Important contact identification"
      ],
      image: "/images/email-feature.png"
    },
    {
      title: "Intelligent Calendar",
      description: "Take control of your time with AI-powered calendar management that respects your work style and priorities.",
      details: [
        "Optimized meeting scheduling",
        "Focus time protection",
        "Smart buffer time between meetings",
        "Automatic travel time allocation",
        "Meeting preparation reminders",
        "Timezone-aware scheduling"
      ],
      image: "/images/calendar-feature.png"
    },
    {
      title: "Daily Briefings",
      description: "Start your day prepared with personalized briefings that highlight what matters most for your day.",
      details: [
        "Morning summary of upcoming meetings",
        "Priority task recommendations",
        "Important email highlights",
        "Weather and commute information",
        "Key performance metrics integration",
        "Custom news and updates"
      ],
      image: "/images/briefing-feature.png"
    },
    {
      title: "AI Assistant",
      description: "Your personal AI assistant that learns your preferences and helps you work more efficiently.",
      details: [
        "Context-aware task suggestions",
        "Personalized productivity insights",
        "Burnout prevention monitoring",
        "Continuous learning from your habits",
        "Communication style adaptation",
        "Smart notification filtering"
      ],
      image: "/images/assistant-feature.png"
    }
  ];

  return (
    <>
      <Head>
        <title>Features | YourManager</title>
        <meta name="description" content="Discover how YourManager helps you reclaim your time and boost productivity" />
      </Head>

      <div className="container">
        {/* Hero Section */}
        <div className="hero">
          <h1>Your AI-Powered Productivity Partner</h1>
          <p>YourManager combines cutting-edge AI with powerful productivity tools to help you focus on what truly matters.</p>
        </div>

        {/* Main Features Section */}
        <div className="main-features">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Detailed Features Section */}
        <div className="detailed-features">
          {detailedFeatures.map((feature, index) => (
            <div key={index} className={`detailed-feature ${index % 2 === 1 ? 'reverse' : ''}`}>
              <div className="feature-content">
                <h2>{feature.title}</h2>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-list">
                  {feature.details.map((detail, i) => (
                    <li key={i}><span className="check-icon">✓</span> {detail}</li>
                  ))}
                </ul>
              </div>
              <div className="feature-image">
                <div className="image-placeholder">{feature.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to transform your productivity?</h2>
          <p>Join thousands of professionals who have reclaimed their time with YourManager.</p>
          <div className="cta-buttons">
            <Link href="/signup">
              <button className="cta-button primary">Get Started Free</button>
            </Link>
            <Link href="/pricing">
              <button className="cta-button secondary">View Pricing</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturesPage; 