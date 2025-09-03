import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTopButton: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const scrollToTop = () => {
    // Multiple methods to ensure it works on all browsers/pages
    try {
      // Method 1: Modern smooth scroll
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      
      // Method 2: Direct DOM scrolling for immediate effect
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Method 3: Force scroll for stubborn cases
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
      
      console.log('Scroll to top triggered');
    } catch (error) {
      // Fallback method
      console.log('Using fallback scroll method');
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  };

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    right: isMobile ? '15px' : '20px',
    bottom: isMobile ? '80px' : '100px',
    width: isMobile ? '40px' : '50px',
    height: isMobile ? '40px' : '50px',
    backgroundColor: '#00c6ff',
    color: 'white',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 999999,
    boxShadow: isMobile ? '0 4px 20px rgba(0, 198, 255, 0.6)' : '0 6px 25px rgba(0, 198, 255, 0.7)',
    border: isMobile ? '1px solid white' : '2px solid white',
    transition: 'all 0.3s ease',
    opacity: 1, // Always fully visible
    visibility: 'visible', // Always visible
    transform: 'scale(1)', // Always normal size
    pointerEvents: 'auto' // Always clickable
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = '#0099cc';
    e.currentTarget.style.transform = isMobile ? 'scale(1.05)' : 'scale(1.1)';
    e.currentTarget.style.boxShadow = isMobile ? '0 4px 20px rgba(0, 198, 255, 0.7)' : '0 6px 25px rgba(0, 198, 255, 0.8)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = '#00c6ff';
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = isMobile ? '0 3px 15px rgba(0, 198, 255, 0.5)' : '0 5px 20px rgba(0, 198, 255, 0.6)';
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked!');
    scrollToTop();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      console.log('Button activated with keyboard!');
      scrollToTop();
    }
  };

  return (
    <div 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title="Back to Top"
      style={buttonStyle}
      role="button"
      tabIndex={0}
      aria-label="Scroll to top of page"
    >
      <ArrowUp size={isMobile ? 18 : 22} strokeWidth={3} />
    </div>
  );
};

export default BackToTopButton;