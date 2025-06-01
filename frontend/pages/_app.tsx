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
import '../styles/transitions.css';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    },
    out: {
      opacity: 0
    }
  };
  
  // Page transition settings
  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.4
  };
  
  return (
    <>
      {/* Simple morphing background */}
      <div className="morphing-background"></div>
      
      {!isAuthPage && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.main
          key={router.route}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
        <Component {...pageProps} />
        </motion.main>
      </AnimatePresence>
      {!isAuthPage && <Footer />}
    </>
  );
}

export default MyApp; 