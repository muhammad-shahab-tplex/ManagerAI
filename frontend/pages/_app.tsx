import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/index.css';
import '../styles/navbar.css';
import '../styles/footer.css';
import '../styles/home.css';
import '../styles/testimonials.css';
import '../styles/how-it-works.css';
import '../styles/faq.css';
import '../styles/signin.css';
import '../styles/signup.css';
import '../styles/roadmap.css';
import '../styles/features.css';
import '../styles/pricing.css';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthPage = router.pathname === '/signin' || router.pathname === '/signup';
  
  useEffect(() => {
    if (isAuthPage) {
      // Ensure the body doesn't scroll on auth pages
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    };
  }, [isAuthPage]);
  
  return (
    <>
      {/* Simple morphing background */}
      <div className="morphing-background"></div>
      
      {!isAuthPage && <Navbar />}
      <main>
        <Component {...pageProps} />
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}

export default MyApp; 