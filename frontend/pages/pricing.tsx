import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Define feature interface
interface PricingFeature {
  name: string;
  included: boolean;
}

// Animation function to count up/down to target number
const AnimatedPrice: React.FC<{ price: number }> = ({ price }) => {
  const [displayPrice, setDisplayPrice] = useState(price);
  const previousPrice = useRef(price);

  useEffect(() => {
    let startValue = previousPrice.current;
    const endValue = price;
    const duration = 500; // Animation duration in ms
    const frameRate = 20; // Update every 20ms (50fps)
    const frames = duration / frameRate;
    const increment = (endValue - startValue) / frames;
    let currentFrame = 0;
    
    if (startValue === endValue) {
      return; // No animation needed
    }

    const timer = setInterval(() => {
      currentFrame++;
      const newValue = startValue + (increment * currentFrame);
      
      if (currentFrame >= frames) {
        clearInterval(timer);
        setDisplayPrice(endValue); // Ensure we end with exact value
        previousPrice.current = endValue;
      } else {
        setDisplayPrice(Number(newValue.toFixed(0))); // Round to integer
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [price]);

  return <>{displayPrice}</>;
};

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  // Plan data
  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Basic features for getting started",
      features: [
        { name: "Connect 1 email account", included: true },
        { name: "Connect 1 calendar", included: true },
        { name: "View daily brief inside the app", included: true },
        { name: "Get basic smart reply suggestions", included: true },
        { name: "Access community-level support", included: true }
      ],
      buttonText: "Start Free",
      buttonLink: "/signup"
    },
    {
      name: "Pro",
      price: isAnnual ? 24 : 29,
      description: "Advanced features for professionals",
      features: [
        { name: "Connect unlimited email accounts", included: true },
        { name: "Connect unlimited calendars", included: true },
        { name: "Get daily briefs via WhatsApp or SMS", included: true },
        { name: "Access smart reply suggestions tailored to you", included: true },
        { name: "Block focus time automatically", included: true },
        { name: "Detect meetings and suggest availability", included: true }
      ],
      buttonText: "Start 14-Day Free Trial",
      buttonLink: "/signup?plan=pro"
    },
    {
      name: "Elite",
      price: isAnnual ? 79 : 99,
      description: "Premium features for executives",
      features: [
        { name: "Includes all Pro features", included: true },
        { name: "Auto-approve replies with confidence scoring", included: true },
        { name: "Match your tone with AI-trained writing style", included: true },
        { name: "Get AI-powered decision support", included: true },
        { name: "Detect signs of burnout and suggest recovery", included: true }, 
        { name: "Access premium support with faster response", included: true }
      ],
      buttonText: "Start 14-Day Free Trial",
      buttonLink: "/signup?plan=elite",
      popular: true
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "Can I switch between plans?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the changes take effect immediately. If you downgrade, the changes will take effect at the end of your current billing cycle."
    },
    {
      question: "Do you offer a free trial for paid plans?",
      answer: "Yes, we offer a 14-day free trial for both our Pro and Elite plans. No credit card required to start your trial."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. We also support payments via PayPal."
    },
    {
      question: "Is there a setup fee?",
      answer: "No, there are no setup fees for any of our plans. You only pay the advertised price."
    }
  ];

  return (
    <>
      <Head>
        <title>Pricing | YourManager</title>
        <meta name="description" content="Choose the right plan for your productivity needs" />
      </Head>

      <div className="container">
        <div className="header">
          <h1>Choose Your Productivity Plan</h1>
          <p>Select the perfect plan to reclaim your time and boost productivity.</p>
        </div>

        <div className="toggle-container">
          <span>Monthly</span>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={isAnnual} 
              onChange={() => setIsAnnual(!isAnnual)} 
            />
            <span className="slider"></span>
          </label>
          <span>Annually</span>
          <span className="discount-badge">Save 20%</span>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className="pricing-card"
            >
              <h3 className="plan-name">{plan.name}</h3>
              
              <div className="plan-price">
                <span className="currency">$</span>
                <span className="amount">
                  <AnimatedPrice price={plan.price} />
                </span>
                <span className="period">/{isAnnual ? 'year' : 'mo'}</span>
              </div>
              
              <p className="plan-description">{plan.description}</p>
              
              <ul className="features-list">
                {plan.features.map((feature, i) => (
                  <li key={i} className={feature.included ? 'included' : 'not-included'}>
                    <span className="check-icon">{feature.included ? '✓' : '✕'}</span>
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
              
              <Link href={plan.buttonLink}>
                <button 
                  className="plan-button"
                >
                  {plan.buttonText}
                </button>
              </Link>
            </div>
          ))}
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 10px 20px 40px;
          color: white;
        }
        
        .header {
          text-align: center;
          margin-bottom: 25px;
        }
        
        .header h1 {
          font-size: 2.2rem;
          margin-bottom: 30px;
        }
        
        .header p {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto 30px auto;
          line-height: 1.5;
        }
        
        .toggle-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 30px;
          padding: 5px 0;
        }
        
        .toggle {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 32px;
        }
        
        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.2);
          transition: .4s;
          border-radius: 34px;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 24px;
          width: 24px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        
        input:checked + .slider {
          background-color: #415A77;
        }
        
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        
        .discount-badge {
          background-color: rgba(65, 90, 119, 0.2);
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 14px;
        }
        
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        
        @media (min-width: 992px) {
          .pricing-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        .pricing-card {
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          position: relative;
          border: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(65, 90, 119, 0.5);
          background: linear-gradient(145deg, #0D1B2A, #14243A);
          transition: all 0.3s ease;
          height: 400px;
          min-height: auto;
          max-height: none;
        }
        
        .pricing-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(65, 90, 119, 0.6);
        }
        
        .plan-name {
          font-size: 1.2rem;
          margin-bottom: 8px;
          text-align: center;
        }
        
        .plan-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          margin-bottom: 5px;
        }
        
        .currency {
          font-size: 0.9rem;
          margin-right: 2px;
        }
        
        .amount {
          font-size: 2.2rem;
          font-weight: bold;
        }
        
        .period {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          margin-left: 2px;
        }
        
        .plan-description {
          text-align: center;
          margin-bottom: 10px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
        }
        
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 15px 0;
          flex-grow: 1;
          font-size: 0.8rem;
        }
        
        .features-list li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 5px;
          font-size: 0.8rem;
          line-height: 1.3;
        }
        
        .check-icon {
          margin-right: 8px;
          font-weight: bold;
        }
        
        .included .check-icon {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .not-included {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: line-through;
        }
        
        .not-included .check-icon {
          color: rgba(255, 255, 255, 0.3);
        }
        
        .plan-button {
          width: 100%;
          padding: 8px;
          border-radius: 30px;
          border: none;
          color: white;
          font-size: 0.85rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 5px;
          background-color: #415A77;
        }
        
        .faq-section {
          margin-top: 120px;
          padding-top: 60px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .faq-section h2 {
          text-align: center;
          margin-bottom: 40px;
          font-size: 2rem;
        }
        
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 30px;
        }
        
        .faq-item {
          background-color: rgba(13, 27, 42, 0.5);
          border-radius: 8px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .faq-item h3 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 1.2rem;
        }
        
        .faq-item p {
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
        }
        
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .faq-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default PricingPage; 