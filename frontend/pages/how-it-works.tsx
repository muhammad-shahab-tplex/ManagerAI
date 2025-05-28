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
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    },
    {
      number: 2,
      title: "AI Learns Your Style",
      description: "Our AI studies your communication patterns, preferences, and priorities to adapt to your unique work style.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
    },
    {
      number: 3,
      title: "Daily Management",
      description: "Receive morning briefings, smart email categorization, and optimized scheduling recommendations.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
    },
    {
      number: 4,
      title: "Continuous Improvement",
      description: "Your AI assistant learns from every interaction, becoming more personalized and efficient over time.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
    }
  ];

  // Workflow sections data
  const workflowSections = [
    {
      title: "Email Management Workflow",
      description: "YourManager transforms your inbox from a time drain to a productivity asset.",
      details: [
        "Incoming emails are automatically categorized and prioritized",
        "Important messages are highlighted for your attention",
        "Smart reply suggestions are generated in your writing style",
        "Regular updates summarize your email activity",
        "Automated follow-ups ensure nothing falls through the cracks"
      ],
      image: "https://img.freepik.com/free-vector/chatbot-artificial-intelligence-abstract-concept-illustration_335657-3723.jpg"
    },
    {
      title: "Calendar Optimization Process",
      description: "Reclaim control of your time with intelligent scheduling and focus protection.",
      details: [
        "Your meeting patterns are analyzed to identify optimal scheduling times",
        "Focus blocks are automatically protected for deep work",
        "Meeting requests are evaluated against your priorities",
        "Buffer time is added between meetings to reduce stress",
        "Regular calendar analyses suggest productivity improvements"
      ],
      image: "https://img.freepik.com/free-vector/time-management-concept-illustration_114360-1058.jpg"
    },
    {
      title: "Decision Support System",
      description: "Get data-driven insights for better decision making without information overload.",
      details: [
        "Important decisions are broken down into clear pros and cons",
        "Relevant data is gathered and presented in digestible formats",
        "Multiple perspectives are offered for complex decisions",
        "Past decisions are tracked to improve future recommendations",
        "Decision fatigue is reduced through smart prioritization"
      ],
      image: "https://img.freepik.com/free-vector/brain-with-digital-circuit-programmer-with-laptop-machine-learning-artificial-intelligence-digital-brain-artificial-thinking-process-concept-vector-isolated-illustration_335657-2246.jpg"
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
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Sections */}
        <div className="workflow-sections">
          {workflowSections.map((section, index) => (
            <div key={index} className={`workflow-section ${index % 2 === 1 ? 'reverse' : ''}`}>
              <div className="workflow-content">
                <h2>{section.title}</h2>
                <p className="workflow-description">{section.description}</p>
                <ul className="workflow-list">
                  {section.details.map((detail, i) => (
                    <li key={i}><span className="check-icon">✓</span> {detail}</li>
                  ))}
                </ul>
              </div>
              <div className="workflow-image">
                <img src={section.image} alt={section.title} />
              </div>
            </div>
          ))}
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