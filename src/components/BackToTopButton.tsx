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
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToTop = () => {
    // Multiple scroll methods to ensure it works
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    right: isMobile ? '15px' : '20px',
    bottom: isMobile ? '80px' : '100px',
    width: isMobile ? '35px' : '45px',
    height: isMobile ? '35px' : '45px',
    backgroundColor: '#00c6ff',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 99999,
    boxShadow: isMobile ? '0 3px 15px rgba(0, 198, 255, 0.5)' : '0 5px 20px rgba(0, 198, 255, 0.6)',
    border: isMobile ? '1px solid white' : '2px solid white',
    transition: 'all 0.3s ease',
    opacity: 1,
    visibility: 'visible'
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

  return (
    <div 
      onClick={scrollToTop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title="Back to Top"
      style={buttonStyle}
    >
      <ArrowUp size={isMobile ? 14 : 18} />
    </div>
  );
};

export default BackToTopButton;