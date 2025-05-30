import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Head>
        <title>YourManager - AI Chief-of-Staff</title>
        <meta name="description" content="Win back 10+ hours per week with an AI assistant that thinks, plans, and responds like your personal Chief-of-Staff." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="home-hero-section">
        <div className="home-hero-content">
          <h1 className="home-hero-title">Your AI Chief-of-Staff</h1>
          <p className="home-hero-subtitle">
            Win back 10+ hours per week with an AI assistant that thinks, plans, and responds like your personal Chief-of-Staff.
          </p>
          <div className="home-hero-buttons">
            <Link href="/signup">
              <button className="home-btn-primary">Get Started</button>
            </Link>
            <Link href="/demo">
              <button className="home-btn-secondary">Watch Demo</button>
            </Link>
          </div>
        </div>
        <div className="home-hero-image">
          <div className="home-dashboard-container">
            <img 
              src="https://img.freepik.com/free-vector/dark-analytics-dashboard-template_23-2148405780.jpg" 
              alt="AI Dashboard"
              className="home-dashboard-image"
            />
          </div>
        </div>
      </section>

      <section className="home-features-section">
        <h2 className="home-features-title">How YourManager Works For You</h2>
        <div className="home-features-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <h3 className="home-feature-title">Email Digest + Smart Reply</h3>
            <p className="home-feature-description">Filter important emails and generate context-aware replies that match your writing style.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <h3 className="home-feature-title">Calendar Organizer</h3>
            <p className="home-feature-description">Intelligently schedule meetings, suggest focus blocks, and optimize your calendar.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h3 className="home-feature-title">Daily Brief Generator</h3>
            <p className="home-feature-description">Start your day with a smart summary of meetings, emails, and priorities.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3 className="home-feature-title">Decision Assistant</h3>
            <p className="home-feature-description">Get pros/cons lists and personalized recommendations for important decisions.</p>
          </div>
        </div>
      </section>

      <section className="home-testimonials-section">
        <h2 className="home-testimonials-title">What Our Users Say</h2>
        <div className="home-testimonials-container">
          <div className="home-testimonial-card">
            <p className="home-testimonial-text">"YourManager saved me at least 2 hours daily on email management alone. It's like having an executive assistant that knows exactly how I think."</p>
            <div className="home-testimonial-author">
              <span className="home-author-name">Sarah J.</span>
              <span className="home-author-title">Startup Founder</span>
            </div>
          </div>
          <div className="home-testimonial-card">
            <p className="home-testimonial-text">"The calendar organization feature is a game-changer. I never realized how much time I was wasting on scheduling until YourManager took over."</p>
            <div className="home-testimonial-author">
              <span className="home-author-name">Michael T.</span>
              <span className="home-author-title">CEO</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta-section">
        <h2 className="home-cta-title">Ready to Win Back 10+ Hours Every Week?</h2>
        <p className="home-cta-text">
          Join thousands of executives and founders who trust YourManager with their productivity.
        </p>
        <Link href="/signup">
          <button className="home-cta-button">Start Your Free Trial</button>
        </Link>
      </section>
    </div>
  );
};

export default Home; 