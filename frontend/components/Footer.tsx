import React from 'react';
import Link from 'next/link';
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <h3>YOUR MANAGER</h3>
          <p>The AI Chief-of-Staff that simplifies management and maximizes your potential productivity.</p>
          <div className="social-section">
            <h4 className="social-heading">FOLLOW US ON SOCIAL MEDIA</h4>
            <div className="social-icons">
              <a href="#" className="social-icon" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" className="social-icon" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3>Product</h3>
          <ul>
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/how-it-works">How It Works</Link></li>
            <li><Link href="/roadmap">Roadmap</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Resources</h3>
          <ul>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/documentation">Documentation</Link></li>
            <li><Link href="/api">API Reference</Link></li>
            <li><Link href="/help-center">Help Center</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/terms-privacy">Terms & Privacy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} YOUR MANAGER. All rights reserved.</p>
        <div className="footer-legal">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/cookie-policy">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 