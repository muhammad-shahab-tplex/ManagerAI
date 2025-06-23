import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const HowItWorksPage: React.FC = () => {
  // Process steps data
  const steps = [
    {
      number: 1,
      title: "Connect Your Accounts",
      description: "Connect your email, calendar, and other productivity tools with our secure integration system.",
      features: [
        "Secure OAuth integration with major platforms",
        "One-click setup for Gmail, Outlook, and Calendar",
        "Bank-level encryption for all your data"
      ]
    },
    {
      number: 2,
      title: "AI Learns Your Style",
      description: "Our AI studies your communication patterns, preferences, and priorities to adapt to your unique work style.",
      features: [
        "Analyzes your email patterns and preferences",
        "Learns your meeting scheduling habits",
        "Adapts to your communication style"
      ]
    },
    {
      number: 3,
      title: "Daily Management",
      description: "Receive morning briefings, smart email categorization, and optimized scheduling recommendations.",
      features: [
        "Daily productivity briefings",
        "Smart email prioritization",
        "Optimized calendar scheduling"
      ]
    },
    {
      number: 4,
      title: "Continuous Improvement",
      description: "Your AI assistant learns from every interaction, becoming more personalized and efficient over time.",
      features: [
        "Machine learning optimization",
        "Personalized recommendations",
        "Performance analytics and insights"
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>How It Works | YourManager</title>
        <meta name="description" content="Learn how YourManager works as your AI Chief-of-Staff to save you time and boost productivity" />
      </Head>

      <div className="container">
        {/* Hero Section */}
        <div className="hero">
          <h1>How YourManager Works</h1>
          <p>Your AI Chief-of-Staff works seamlessly behind the scenes to transform your productivity, simplify your workflow, and give you back hours in your day.</p>
        </div>

        {/* Process Steps Section */}
        <div className="process-section">
          <h2 className="section-title">The YourManager Process</h2>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-content">
                  <div className="step-header">
                    <div className="step-number">{step.number}</div>
                    <h3 className="step-title">{step.title}</h3>
                  </div>
                  <p className="step-description">{step.description}</p>
                  <ul className="step-features">
                    {step.features.map((feature, i) => (
                      <li key={i}>
                        <span className="step-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="step-visual">
                  <div className="step-image">
                    Process Step {step.number}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Experience the Future of Productivity?</h2>
          <p>Join thousands of executives and founders who save 10+ hours every week with YourManager.</p>
          <div className="cta-buttons">
            <Link href="/signup">
              <button className="cta-button primary">Start Your Free Trial</button>
            </Link>
            <Link href="/pricing">
              <button className="cta-button secondary">View Pricing Plans</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorksPage; 