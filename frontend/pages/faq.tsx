import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const FAQPage: React.FC = () => {
  // FAQ categories
  const faqCategories = [
    {
      title: "Getting Started",
      questions: [
        {
          question: "How do I sign up for YourManager?",
          answer: "Signing up is simple! Click the 'Get Started' button on our homepage, choose your plan, and follow the guided setup process. You'll be up and running in less than 5 minutes."
        },
        {
          question: "What email services does YourManager integrate with?",
          answer: "YourManager currently integrates with Gmail, Microsoft Outlook, and other email providers that support IMAP. We're continuously adding support for more email services."
        },
        {
          question: "Is my data secure with YourManager?",
          answer: "Absolutely. We use enterprise-grade encryption and security protocols to protect your data. We never store your email passwords, and all connections are made through secure OAuth protocols. You can review our security policies in detail on our Security page."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes, you can cancel your subscription at any time from your account settings. There are no long-term contracts or cancellation fees."
        }
      ]
    },
    {
      title: "Features & Functionality",
      questions: [
        {
          question: "How does the AI learn my communication style?",
          answer: "Our AI analyzes your past emails and messages to understand your tone, vocabulary, and response patterns. Over time, it adapts to match your unique communication style. The more you use YourManager, the more personalized it becomes."
        },
        {
          question: "Can YourManager reply to emails automatically?",
          answer: "Yes, but with your control. You can set YourManager to suggest replies which you approve before sending, or for routine emails, you can enable auto-replies with confidence thresholds you define."
        },
        {
          question: "How does the calendar optimization work?",
          answer: "YourManager analyzes your meeting patterns, productivity cycles, and stated preferences to suggest optimal scheduling. It automatically detects meeting requests in emails and can suggest available times based on your preferences for focus time, meeting-free days, and buffer periods between meetings."
        },
        {
          question: "What does the burnout detection feature do?",
          answer: "Our burnout detection system monitors patterns in your work habits, such as late-night emails, decreased response times, or calendar overload. When it detects potential signs of burnout, it suggests recovery strategies like blocked focus time, meeting-free days, or reminder breaks."
        }
      ]
    },
    {
      title: "Pricing & Plans",
      questions: [
        {
          question: "What's included in the free plan?",
          answer: "The Free plan includes basic email and calendar integration, daily briefings, and limited smart reply suggestions. It's perfect for trying out YourManager's core functionality."
        },
        {
          question: "What are the differences between Pro and Elite plans?",
          answer: "The Pro plan ($29/month) includes unlimited integrations, advanced smart replies, focus block scheduling, and meeting request detection. The Elite plan ($99/month) adds AI tone matching, decision support, burnout detection, and premium support."
        },
        {
          question: "Do you offer discounts for annual subscriptions?",
          answer: "Yes! You can save 20% by choosing annual billing for any of our paid plans."
        },
        {
          question: "Is there a free trial for paid plans?",
          answer: "Yes, all paid plans come with a 14-day free trial, no credit card required. You can experience all features before committing to a subscription."
        }
      ]
    },
    {
      title: "Support & Troubleshooting",
      questions: [
        {
          question: "How can I contact support?",
          answer: "You can reach our support team via email at support@yourmanager.com or through the in-app chat feature. Pro and Elite users receive priority support with faster response times."
        },
        {
          question: "What if I have trouble connecting my email account?",
          answer: "First, check that you're using a supported email provider. If you're still having issues, our troubleshooting guide in the Help Center addresses most common connection problems. You can also contact our support team for personalized assistance."
        },
        {
          question: "Can I export my data if I decide to cancel?",
          answer: "Yes, you can export all your data at any time from the account settings. We provide your data in standard formats that can be easily imported into other systems if needed."
        },
        {
          question: "How often do you release new features?",
          answer: "We release minor updates and improvements weekly, with major feature releases typically every quarter. Elite users get early access to new features before they're generally available."
        }
      ]
    }
  ];

  // State to track expanded questions
  const [expandedQuestions, setExpandedQuestions] = useState<{[key: string]: boolean}>({});

  // Toggle question expansion
  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      <Head>
        <title>FAQ | YourManager</title>
        <meta name="description" content="Frequently asked questions about YourManager - the AI Chief-of-Staff that saves you 10+ hours per week" />
      </Head>

      <div className="faq-container">
        {/* Hero Section */}
        <div className="faq-hero">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about YourManager's features, pricing, and how it can transform your productivity.</p>
        </div>

        {/* FAQ Categories */}
        <div className="faq-container">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h2 className="category-title">{category.title}</h2>
              <div className="questions-list">
                {category.questions.map((faq, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isExpanded = expandedQuestions[key] || false;
                  
                  return (
                    <div 
                      key={questionIndex} 
                      className={`faq-item ${isExpanded ? 'expanded' : ''}`}
                    >
                      <div 
                        className="faq-question"
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                      >
                        <h3>{faq.question}</h3>
                        <div className="toggle-icon">
                          {isExpanded ? '−' : '+'}
                        </div>
                      </div>
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Need More Help Section */}
        <div className="more-help-section">
          <h2>Need More Help?</h2>
          <p>Our support team is ready to assist you with any questions not covered here.</p>
          <div className="help-options">
            <div className="help-option">
              <div className="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <h3>Email Support</h3>
              <p>Contact us at <a href="mailto:support@yourmanager.com">support@yourmanager.com</a> for personalized assistance.</p>
            </div>
            <div className="help-option">
              <div className="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </div>
              <h3>Live Chat</h3>
              <p>Chat with our support team in real-time through the app when you're logged in.</p>
            </div>
            <div className="help-option">
              <div className="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h3>Help Center</h3>
              <p>Browse our comprehensive <a href="/help-center">Help Center</a> for guides and tutorials.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Transform Your Productivity?</h2>
          <p>Join thousands of professionals who save 10+ hours every week with YourManager.</p>
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

export default FAQPage; 