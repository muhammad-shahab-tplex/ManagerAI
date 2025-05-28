import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-left">
          <div className="navbar-brand">
            <Logo size={34} />
            <div className="navbar-logo">YOUR MANAGER</div>
          </div>
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link href="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/features" className="nav-links">
              Features
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/how-it-works" className="nav-links">
              How It Works
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/pricing" className="nav-links">
              Pricing
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/testimonials" className="nav-links">
              Testimonials
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/faq" className="nav-links">
              FAQ
            </Link>
          </li>
        </ul>
        <div className="nav-auth">
          <Link href="/login">
            <button className="btn-login">Login</button>
          </Link>
          <Link href="/get-started">
            <button className="btn-signup">Get Started</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 