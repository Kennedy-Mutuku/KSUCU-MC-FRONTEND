import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../config/environment';
import styles from '../styles/NewsPage.module.css';

interface NewsData {
  title: string;
  summary: string;
  body: string;
  imageUrl: string;
  eventDate?: string;
  eventTime?: string;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const NewsPage: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<CountdownTime | null>(null);
  const [eventPassed, setEventPassed] = useState<boolean>(false);

  useEffect(() => {
    // Fetch the news data from the backend
    const fetchNewsData = async () => {
      try {
        const response = await fetch(getApiUrl('news'), {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch news data');
        }
        const data = await response.json();
        setNewsData(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchNewsData();

    // Auto-refresh news every 30 seconds to ensure all devices get updates
    const newsRefreshInterval = setInterval(() => {
      fetchNewsData();
    }, 30000);

    // Refresh when user returns to the page
    const handleFocus = () => {
      fetchNewsData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(newsRefreshInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Calculate countdown timer
  const calculateCountdown = (eventDate: string, eventTime: string): CountdownTime | null => {
    try {
      console.log('NewsPage: Calculating countdown for:', eventDate, eventTime);
      
      // Parse the date more robustly
      let eventDateTime: Date;
      
      // Handle different date formats
      if (eventTime && eventTime !== '') {
        // Try different formats for combining date and time
        if (eventDate.includes('T')) {
          // ISO format
          eventDateTime = new Date(`${eventDate.split('T')[0]}T${eventTime}`);
        } else {
          // Try standard format
          eventDateTime = new Date(`${eventDate}T${eventTime}`);
        }
        
        // If that fails, try parsing separately
        if (isNaN(eventDateTime.getTime())) {
          eventDateTime = new Date(eventDate);
          const timeParts = eventTime.match(/(\d{1,2}):(\d{2})/);
          if (timeParts) {
            eventDateTime.setHours(parseInt(timeParts[1], 10), parseInt(timeParts[2], 10), 0, 0);
          }
        }
      } else {
        // If no time specified, use noon as default
        eventDateTime = new Date(eventDate);
        eventDateTime.setHours(12, 0, 0, 0);
      }
      
      console.log('NewsPage: Parsed event date:', eventDateTime);
      
      // Validate the date
      if (isNaN(eventDateTime.getTime())) {
        console.error('NewsPage: Invalid date/time format:', eventDate, eventTime);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      const now = new Date();
      const difference = eventDateTime.getTime() - now.getTime();
      
      console.log('NewsPage: Time difference:', difference, 'ms');

      if (difference <= 0) {
        console.log('NewsPage: Event has passed');
        return null; // Event has passed
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const result = { days, hours, minutes, seconds };
      console.log('NewsPage: Countdown result:', result);
      
      // Ensure no NaN values
      if (isNaN(days) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        console.error('NewsPage: NaN values detected in countdown');
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return result;
    } catch (error) {
      console.error('NewsPage: Error calculating countdown:', error);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  // Update countdown every second
  useEffect(() => {
    if (!newsData?.eventDate) return;

    const updateCountdown = () => {
      const countdownData = calculateCountdown(newsData.eventDate!, newsData.eventTime || '12:00');
      if (countdownData) {
        setCountdown(countdownData);
        setEventPassed(false);
      } else {
        setCountdown(null);
        setEventPassed(true);
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [newsData]);

  if (loading) {
    return (
      <div className={styles.newsPageContainer} style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>Loading news...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className={styles.newsPageContainer} style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          maxWidth: '480px',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          margin: '2rem'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #730051, #a0006e)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem' }}>
            📰
          </div>
          <h2 style={{ color: '#730051', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            {error ? 'Unable to Load News' : 'No News Available'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {error
              ? 'We couldn\'t fetch the latest news. Please sign in to your account and try again.'
              : 'There are no news updates at the moment. Check back later for the latest from KSUCU-MC.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signIn" style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #730051, #a0006e)',
              color: 'white',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'transform 0.2s',
            }}>
              Sign In
            </Link>
            <Link to="/" style={{
              padding: '10px 24px',
              background: '#f3f4f6',
              color: '#374151',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'transform 0.2s',
            }}>
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.newsPageContainer}>
        <h2 className={styles.title}>Communication Board</h2>

        {/* Event Countdown Timer */}
        {newsData.eventDate && (
          <div className={styles.eventSection}>
            <div className={styles.eventInfo}>
              <h3 className={styles.eventTitle}>Upcoming Event</h3>
              <p className={styles.eventDateTime}>
                {new Date(newsData.eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {newsData.eventTime ? ` at ${newsData.eventTime}` : ' at 12:00'}
              </p>
            </div>
            
            {countdown && !eventPassed && (
              <div className={styles.countdownTimer}>
                <h4 className={styles.countdownTitle}>Time Remaining</h4>
                <div className={styles.countdownGrid}>
                  <div className={styles.timeUnit}>
                    <span className={styles.timeNumber}>{String(countdown.days || 0).padStart(2, '0')}</span>
                    <span className={styles.timeLabel}>Days</span>
                  </div>
                  <div className={styles.timeUnit}>
                    <span className={styles.timeNumber}>{String(countdown.hours || 0).padStart(2, '0')}</span>
                    <span className={styles.timeLabel}>Hours</span>
                  </div>
                  <div className={styles.timeUnit}>
                    <span className={styles.timeNumber}>{String(countdown.minutes || 0).padStart(2, '0')}</span>
                    <span className={styles.timeLabel}>Minutes</span>
                  </div>
                  <div className={styles.timeUnit}>
                    <span className={styles.timeNumber}>{String(countdown.seconds || 0).padStart(2, '0')}</span>
                    <span className={styles.timeLabel}>Seconds</span>
                  </div>
                </div>
              </div>
            )}
            
            {eventPassed && (
              <div className={styles.eventPassed}>
                <h4 className={styles.eventPassedTitle}>Event Has Started/Ended</h4>
                <p>This event is no longer upcoming.</p>
              </div>
            )}
          </div>
        )}

        <div className={styles.newsPage}>
          {newsData.imageUrl && (
            <div className={styles.imageSection}>
              <img src={newsData.imageUrl} alt="News Image" />
            </div>
          )}
          <div className={styles.contentText}>
            <h3 className={styles.newsTextTitle}>{newsData.title}</h3>
            <div className={styles.contextTextP}>
              {newsData.body.split('\n').map((paragraph, index) => (
                <p key={index} style={{marginBottom: '15px', lineHeight: '1.8'}}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default NewsPage;
