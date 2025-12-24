import React, { ReactNode } from 'react';
// import { useOffline } from '../hooks/useOffline';
// import '../styles/OfflineWrapper.css';

interface OfflineWrapperProps {
  children: ReactNode;
}

export const OfflineWrapper: React.FC<OfflineWrapperProps> = ({ children }) => {
  // const { isOnline, wasOffline, retryConnection } = useOffline();

  return (
    <>
      {children}
      
      {/* Offline detection disabled - always show the app */}
      {/* {!isOnline && (
        <div className="offline-banner">
          <div className="offline-content">
            <span className="offline-icon">📡</span>
            <span className="offline-text">You're offline</span>
            <button 
              className="retry-btn"
              onClick={retryConnection}
              aria-label="Retry connection"
            >
              Retry
            </button>
          </div>
        </div>
      )} */}
      
      {/* {isOnline && wasOffline && (
        <div className="online-banner">
          <div className="online-content">
            <span className="online-icon">✅</span>
            <span className="online-text">Back online</span>
          </div>
        </div>
      )} */}
    </>
  );
};