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

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          color: white;
        }

        .hero {
          text-align: center;
          margin-bottom: 60px;
        }

        .hero h1 {
          font-size: 2.8rem;
          margin-bottom: 20px;
          background: linear-gradient(45deg, #ffffff, #778da9);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .main-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 80px;
        }

        .feature-card {
          background: linear-gradient(145deg, #0D1B2A, #14243A);
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(65, 90, 119, 0.5);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(65, 90, 119, 0.6);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          justify-content: center;
        }

        .feature-icon svg {
          width: 48px;
          height: 48px;
          stroke: rgba(255, 255, 255, 0.7);
        }

        .feature-card h3 {
          font-size: 1.4rem;
          margin-bottom: 15px;
          color: #fff;
        }

        .feature-card p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .detailed-features {
          margin-bottom: 80px;
        }

        .detailed-feature {
          display: flex;
          align-items: center;
          margin-bottom: 80px;
          gap: 40px;
        }

        .detailed-feature.reverse {
          flex-direction: row-reverse;
        }

        .feature-content {
          flex: 1;
        }

        .feature-content h2 {
          font-size: 2rem;
          margin-bottom: 15px;
          color: #fff;
        }

        .feature-description {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .feature-list {
          list-style: none;
          padding: 0;
        }

        .feature-list li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
        }

        .check-icon {
          color: #415A77;
          margin-right: 10px;
          font-weight: bold;
        }

        .feature-image {
          flex: 1;
          max-width: 500px;
        }

        .image-placeholder {
          background: rgba(65, 90, 119, 0.2);
          border-radius: 12px;
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 15px 2px rgba(65, 90, 119, 0.3);
          position: relative;
        }

        .image-placeholder::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 12px;
          box-shadow: 0 0 20px 3px rgba(65, 90, 119, 0.4);
          z-index: -1;
        }

        .cta-section {
          text-align: center;
          background: linear-gradient(145deg, rgba(13, 27, 42, 0.8), rgba(20, 36, 58, 0.8));
          border-radius: 12px;
          padding: 60px 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 15px 2px rgba(65, 90, 119, 0.3);
          position: relative;
        }

        .cta-section::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 12px;
          box-shadow: 0 0 20px 3px rgba(65, 90, 119, 0.4);
          z-index: -1;
        }

        .cta-section h2 {
          font-size: 2.2rem;
          margin-bottom: 15px;
        }

        .cta-section p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          margin-bottom: 30px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .cta-button {
          padding: 12px 30px;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .cta-button.primary {
          background-color: #415A77;
          color: white;
        }

        .cta-button.secondary {
          background-color: transparent;
          color: white;
          border: 2px solid #415A77;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .detailed-feature {
            flex-direction: column;
            gap: 30px;
          }

          .detailed-feature.reverse {
            flex-direction: column;
          }

          .feature-image {
            max-width: 100%;
          }

          .cta-buttons {
            flex-direction: column;
            gap: 15px;
          }

          .cta-button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default FeaturesPage; 