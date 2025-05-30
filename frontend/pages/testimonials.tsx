import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const TestimonialsPage: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah J.',
      position: 'Startup Founder',
      quote: 'YourManager saved me at least 2 hours daily on email management alone. It\'s like having an executive assistant that knows exactly how I think.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      name: 'Michael T.',
      position: 'CEO',
      quote: 'The calendar organization feature is a game-changer. I never realized how much time I was wasting on scheduling until YourManager took over.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      name: 'Priya S.',
      position: 'Venture Partner',
      quote: 'The AI\'s tone-matching and decision support are next-level. I trust YourManager with my most important communications.',
      image: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      id: 4,
      name: 'David L.',
      position: 'Tech Executive',
      quote: 'Burnout detection and focus block suggestions have made a real difference in my work-life balance. Highly recommended!',
      image: 'https://randomuser.me/api/portraits/men/65.jpg'
    },
    {
      id: 5,
      name: 'Elena M.',
      position: 'COO',
      quote: 'The daily briefings and smart replies are so accurate, it feels like magic. My productivity has never been higher.',
      image: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    {
      id: 6,
      name: 'James R.',
      position: 'Marketing Director',
      quote: 'I\'ve tried many productivity tools, but YourManager is the first one that actually adapts to my working style instead of forcing me to adapt to it.',
      image: 'https://randomuser.me/api/portraits/men/11.jpg'
    }
  ];

  return (
    <>
      <Head>
        <title>Testimonials | YourManager</title>
        <meta name="description" content="See what our customers say about YourManager - AI Chief-of-Staff" />
      </Head>

      <div className="testimonial-page-container">
        <div className="testimonial-header">
          <h1 className="testimonial-header-title">What Our Customers Say</h1>
          <p className="testimonial-header-description">Hear from executives and founders who have transformed their productivity with YourManager</p>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <div className="testimonial-card" key={testimonial.id}>
              <div className="testimonial-content">
                <blockquote className="testimonial-quote">"{testimonial.quote}"</blockquote>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-author-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="testimonial-author-info">
                  <h3>{testimonial.name}</h3>
                  <p>{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonial-cta-section">
          <h2 className="testimonial-cta-title">Ready to Win Back 10+ Hours Every Week?</h2>
          <p className="testimonial-cta-text">Join thousands of executives and founders who trust YourManager with their productivity.</p>
          <Link href="/signup">
            <button className="testimonial-cta-button">Start Your Free Trial</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default TestimonialsPage; 