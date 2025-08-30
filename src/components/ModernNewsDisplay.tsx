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
  const [countdown, setCountdown] = useState<CountdownTime | null>(null);
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
        setNewsData(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!newsData?.eventDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      let targetDate = new Date(newsData.eventDate!).getTime();
      
      // If event time is provided, add it to the date
      if (newsData.eventTime) {
        const [hours, minutes] = newsData.eventTime.split(':');
        const eventDateTime = new Date(newsData.eventDate!);
        eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        targetDate = eventDateTime.getTime();
      }
      
      const difference = targetDate - now;
      
      if (difference <= 0) {
        setIsEventPassed(true);
        setCountdown(null);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };

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
        {/* Countdown Section - Only show if event date exists and hasn't passed */}
        {newsData.eventDate && countdown && !isEventPassed && (
          <div className={styles.countdownSection}>
            <div className={styles.countdownHeader}>
              <h3>🎉 Upcoming Event</h3>
              <p>Event starts in:</p>
            </div>
            <div className={styles.countdownDisplay}>
              <div className={styles.countdownItem}>
                <span className={styles.countdownNumber}>{countdown.days}</span>
                <span className={styles.countdownLabel}>Days</span>
              </div>
              <div className={styles.countdownDivider}>:</div>
              <div className={styles.countdownItem}>
                <span className={styles.countdownNumber}>{countdown.hours}</span>
                <span className={styles.countdownLabel}>Hours</span>
              </div>
              <div className={styles.countdownDivider}>:</div>
              <div className={styles.countdownItem}>
                <span className={styles.countdownNumber}>{countdown.minutes}</span>
                <span className={styles.countdownLabel}>Minutes</span>
              </div>
              <div className={styles.countdownDivider}>:</div>
              <div className={styles.countdownItem}>
                <span className={styles.countdownNumber}>{countdown.seconds}</span>
                <span className={styles.countdownLabel}>Seconds</span>
              </div>
            </div>
            {newsData.eventTime && (
              <div className={styles.eventTime}>
                📅 Event Time: {new Date(newsData.eventDate).toLocaleDateString()} at {newsData.eventTime}
              </div>
            )}
          </div>
        )}

        {/* Event Passed Notification */}
        {newsData.eventDate && isEventPassed && (
          <div className={styles.eventPassedSection}>
            <h3>✅ Event Has Started/Passed</h3>
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
            <h2 className={styles.newsTitle}>{newsData.title}</h2>
            <div className={styles.newsBody}>
              {newsData.body.split('\n').map((paragraph, index) => (
                <p key={index} className={styles.newsParagraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* News Timestamp */}
        <div className={styles.newsFooter}>
          <span className={styles.newsTimestamp}>
            📰 Latest Update • KSUCU-MC Communication Board
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModernNewsDisplay;