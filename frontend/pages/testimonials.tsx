import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const TestimonialsPage: React.FC = () => {
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    timeSaved: 0,
    satisfaction: 0,
    companies: 0
  });
  
  const statsRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const finalStats = {
    users: 10000,
    timeSaved: 50000,
    satisfaction: 98,
    companies: 500
  };

  // Count-up animation function
  const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      callback(currentValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  // Intersection Observer for triggering animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Animate each stat with different durations for visual appeal
            animateValue(0, finalStats.users, 2000, (value) => {
              setAnimatedStats(prev => ({ ...prev, users: value }));
            });
            
            animateValue(0, finalStats.timeSaved, 2200, (value) => {
              setAnimatedStats(prev => ({ ...prev, timeSaved: value }));
            });
            
            animateValue(0, finalStats.satisfaction, 1800, (value) => {
              setAnimatedStats(prev => ({ ...prev, satisfaction: value }));
            });
            
            animateValue(0, finalStats.companies, 2400, (value) => {
              setAnimatedStats(prev => ({ ...prev, companies: value }));
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Startup Founder',
      company: 'TechFlow Inc.',
      quote: 'YourManager saved me at least 2 hours daily on email management alone. It\'s like having an executive assistant that knows exactly how I think.',
      rating: 5,
      featured: true
    },
    {
      id: 2,
      name: 'Michael Thompson',
      position: 'CEO',
      company: 'Growth Dynamics',
      quote: 'The calendar organization feature is a game-changer. I never realized how much time I was wasting on scheduling until YourManager took over.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Chen',
      position: 'VP of Operations',
      company: 'InnovateCorp',
      quote: 'Our team productivity increased by 40% after implementing YourManager. The AI learns our patterns and optimizes everything.',
      rating: 5
    },
    {
      id: 4,
      name: 'David Rodriguez',
      position: 'Managing Director',
      company: 'Capital Ventures',
      quote: 'I was skeptical about AI assistants, but YourManager proved me wrong. It handles my complex schedule better than any human assistant.',
      rating: 5
    },
    {
      id: 5,
      name: 'Lisa Park',
      position: 'Chief Marketing Officer',
      company: 'BrandForward',
      quote: 'The email prioritization is incredible. I only see what matters, when it matters. My stress levels have dropped significantly.',
      rating: 5
    },
    {
      id: 6,
      name: 'James Wilson',
      position: 'Founder & CEO',
      company: 'StartupLab',
      quote: 'YourManager is like having a personal chief of staff. It anticipates my needs and keeps me focused on high-impact activities.',
      rating: 5
    }
  ];

  const formatStatNumber = (num: number, type: string) => {
    switch (type) {
      case 'users':
        return `${(num / 1000).toFixed(0)}K+`;
      case 'timeSaved':
        return `${(num / 1000).toFixed(0)}K+`;
      case 'satisfaction':
        return `${num}%`;
      case 'companies':
        return `${num}+`;
      default:
        return num.toString();
    }
  };

  return (
    <>
      <Head>
        <title>Customer Testimonials | YourManager</title>
        <meta name="description" content="See what our customers say about YourManager - real testimonials from executives and founders who save 10+ hours weekly" />
      </Head>

      <div className="testimonials-container">
        {/* Hero Section */}
        <div className="testimonials-hero">
          <h1>What Our Customers Say</h1>
          <p>Join thousands of executives and founders who have transformed their productivity with YourManager. Here's what they have to say about their experience.</p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className={`testimonial-card ${testimonial.featured ? 'featured-testimonial' : ''}`}
            >
              {testimonial.featured && (
                <div className="featured-badge">Most Popular</div>
              )}
              
              <div className="testimonial-content">
                <p className="testimonial-text">{testimonial.quote}</p>
                
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
              </div>
              
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-title">{testimonial.position}</div>
                  <div className="author-title">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="stats-section" ref={statsRef}>
          <h2>Trusted by Thousands of Professionals</h2>
          <div className="testimonials-stats-grid">
            <div className="testimonials-stat-item">
              <span className={`testimonials-stat-number ${hasAnimated ? 'animate' : ''}`}>
                {formatStatNumber(animatedStats.users, 'users')}
              </span>
              <div className="testimonials-stat-label">Active Users</div>
            </div>
            <div className="testimonials-stat-item">
              <span className={`testimonials-stat-number ${hasAnimated ? 'animate' : ''}`}>
                {formatStatNumber(animatedStats.timeSaved, 'timeSaved')}
              </span>
              <div className="testimonials-stat-label">Hours Saved Monthly</div>
            </div>
            <div className="testimonials-stat-item">
              <span className={`testimonials-stat-number ${hasAnimated ? 'animate' : ''}`}>
                {formatStatNumber(animatedStats.satisfaction, 'satisfaction')}
              </span>
              <div className="testimonials-stat-label">Customer Satisfaction</div>
            </div>
            <div className="testimonials-stat-item">
              <span className={`testimonials-stat-number ${hasAnimated ? 'animate' : ''}`}>
                {formatStatNumber(animatedStats.companies, 'companies')}
              </span>
              <div className="testimonials-stat-label">Companies Trust Us</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Join Our Success Stories?</h2>
          <p>Experience the same productivity transformation that thousands of professionals are already enjoying with YourManager.</p>
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

export default TestimonialsPage; 