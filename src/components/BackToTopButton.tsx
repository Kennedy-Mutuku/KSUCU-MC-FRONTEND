import React from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTopButton: React.FC = () => {
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
    right: '20px',
    bottom: '100px',
    width: '45px',
    height: '45px',
    backgroundColor: '#00c6ff',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 99999,
    boxShadow: '0 5px 20px rgba(0, 198, 255, 0.6)',
    border: '2px solid white',
    transition: 'all 0.3s ease',
    opacity: 1,
    visibility: 'visible'
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = '#0099cc';
    e.currentTarget.style.transform = 'scale(1.1)';
    e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 198, 255, 0.8)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = '#00c6ff';
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 198, 255, 0.6)';
  };

  return (
    <div 
      onClick={scrollToTop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title="Back to Top"
      style={buttonStyle}
    >
      <ArrowUp size={18} />
    </div>
  );
};

export default BackToTopButton;