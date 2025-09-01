import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <button 
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 2147483647,
        background: '#730051',
        color: 'white',
        border: '2px solid #ffffff',
        padding: '12px 20px',
        fontSize: '16px',
        fontWeight: '600',
        borderRadius: '25px',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(115, 0, 81, 0.4)',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        minWidth: '100px',
        minHeight: '40px',
        transition: 'all 0.2s ease',
        visibility: 'visible',
        opacity: 1,
      }}
      onMouseOver={(e) => {
        const target = e.target as HTMLButtonElement;
        target.style.background = '#00c6ff';
        target.style.transform = 'scale(1.05)';
        target.style.boxShadow = '0 6px 20px rgba(0, 198, 255, 0.4)';
      }}
      onMouseOut={(e) => {
        const target = e.target as HTMLButtonElement;
        target.style.background = '#730051';
        target.style.transform = 'scale(1)';
        target.style.boxShadow = '0 4px 15px rgba(115, 0, 81, 0.4)';
      }}
    >
      ← Back
    </button>
  );
};

export default BackButton;