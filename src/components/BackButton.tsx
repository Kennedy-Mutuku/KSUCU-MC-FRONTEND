import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  className?: string;
  style?: React.CSSProperties;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  className = '', 
  style = {} 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  const defaultStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 999999,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    ...style
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      style={defaultStyle}
      onMouseEnter={(e) => {
        const target = e.target as HTMLElement;
        target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        target.style.transform = 'translateY(-1px)';
        target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
      }}
      onMouseLeave={(e) => {
        const target = e.target as HTMLElement;
        target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        target.style.transform = 'translateY(0)';
        target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
      }}
    >
      <ArrowLeft size={16} />
      <span>Back</span>
    </button>
  );
};

export default BackButton;