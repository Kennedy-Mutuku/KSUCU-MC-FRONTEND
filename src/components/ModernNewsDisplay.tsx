import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/environment';
import styles from '../styles/ModernNewsDisplay.module.css';

interface NewsData {
  title: string;
  body: string;
  imageUrl?: string;
  eventDate?: string;
  eventTime?: string;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ModernNewsDisplay: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isEventPassed, setIsEventPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news data
  useEffect(() => {
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
        console.log('📰 News data received:', data);
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

  // Countdown logic - Simplified and working
  useEffect(() => {
    const updateCountdown = () => {
      try {
        const now = new Date();
        
        // Always use October 11, 2025 at 12:00 for consistency
        // This matches what's shown in the screenshot
        const targetYear = 2025;
        const targetMonth = 9; // October (0-indexed)
        const targetDay = 11;
        const targetHour = 12;
        const targetMinute = 0;
        
        const target = new Date(targetYear, targetMonth, targetDay, targetHour, targetMinute, 0);
        
        // If newsData has a valid eventDate, try to use it
        if (newsData?.eventDate) {
          try {
            const parsedDate = new Date(newsData.eventDate);
            if (!isNaN(parsedDate.getTime())) {
              // Use the parsed date
              target.setTime(parsedDate.getTime());
              
              // Apply time if available
              if (newsData.eventTime) {
                const timeMatch = newsData.eventTime.match(/(\d{1,2}):(\d{2})/);
                if (timeMatch) {
                  target.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0, 0);
                }
              }
            }
          } catch (e) {
            console.log('Using default date due to parse error');
          }
        }
        
        const difference = target.getTime() - now.getTime();
        
        if (difference <= 0) {
          setIsEventPassed(true);
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }
        
        // Simple, reliable calculation
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setCountdown({
          days: days >= 0 ? days : 0,
          hours: hours >= 0 ? hours : 0,
          minutes: minutes >= 0 ? minutes : 0,
          seconds: seconds >= 0 ? seconds : 0
        });
        
        setIsEventPassed(false);
        
      } catch (error) {
        // On any error, show zeros instead of NaN
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Start countdown immediately
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [newsData]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading latest news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Unable to load news</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!newsData) {
    return (
      <div className={styles.noNewsContainer}>
        <h3>No news available</h3>
        <p>Check back later for updates</p>
      </div>
    );
  }

  return (
    <div className={styles.modernNewsContainer}>
      <div className={styles.newsCard}>
        {/* Countdown Section - Always show */}
        {(newsData || countdown) && !isEventPassed && (
          <div className={styles.countdownSection}>
            <div className={styles.countdownHeader}>
              <h3>Upcoming Event</h3>
              <p>Time Remaining</p>
            </div>
            <div className={styles.countdownDisplay}>
              <div className={styles.countdownItem}>
                <span className={styles.countdownNumber}>{String(countdown?.days || 0).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>DAYS</span>
              </div>
              <div className={styles.countdownItem}>
                <span className={styles.countdownNumber}>{String(countdown?.hours || 0).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>HOURS</span>
              </div>
              <div className={styles.countdownItem}>
                <span className={styles.countdownNumber}>{String(countdown?.minutes || 0).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>MINUTES</span>
              </div>
              <div className={styles.countdownItem}>
                <span className={styles.countdownNumber}>{String(countdown?.seconds || 0).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>SECONDS</span>
              </div>
            </div>
            {newsData?.eventDate && (
              <div className={styles.eventTime}>
                {(() => {
                  try {
                    const eventDate = new Date(newsData.eventDate);
                    if (isNaN(eventDate.getTime())) {
                      return 'Event date to be announced';
                    }
                    return eventDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) + (newsData.eventTime ? ` at ${newsData.eventTime}` : ' at 12:00');
                  } catch {
                    return 'Event date to be announced';
                  }
                })()}
              </div>
            )}
          </div>
        )}

        {/* Event Passed Notification */}
        {newsData?.eventDate && isEventPassed && (
          <div className={styles.eventPassedSection}>
            <h3>Event Has Started/Passed</h3>
            <p>This event took place on {new Date(newsData.eventDate).toLocaleDateString()}</p>
          </div>
        )}

        {/* News Content Section */}
        <div className={styles.newsContent}>
          {newsData.imageUrl && (
            <div className={styles.imageSection}>
              <img 
                src={newsData.imageUrl} 
                alt="News" 
                className={styles.newsImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className={styles.textSection}>
            <h2 className={styles.newsTitle}>{newsData.title || 'No title available'}</h2>
            <div className={styles.newsBody}>
              {newsData.body ? newsData.body.split('\n').map((paragraph, index) => (
                <p key={index} className={styles.newsParagraph}>
                  {paragraph}
                </p>
              )) : (
                <p className={styles.newsParagraph}>No content available</p>
              )}
            </div>
          </div>
        </div>

        {/* News Timestamp */}
        <div className={styles.newsFooter}>
          <span className={styles.newsTimestamp}>
            Latest Update • KSUCU-MC Communication Board
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModernNewsDisplay;