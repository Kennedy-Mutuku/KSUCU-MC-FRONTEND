import React, { useState, useEffect } from 'react';
import styles from '../styles/NewsPage.module.css';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';

interface NewsData {
  title: string;
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
        const response = await fetch('https://ksucu-mc.co.ke/news/news', {
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

  // Calculate countdown timer
  const calculateCountdown = (eventDate: string, eventTime: string): CountdownTime | null => {
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    const now = new Date();
    const difference = eventDateTime.getTime() - now.getTime();

    if (difference <= 0) {
      return null; // Event has passed
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  // Update countdown every second
  useEffect(() => {
    if (!newsData?.eventDate || !newsData?.eventTime) return;

    const updateCountdown = () => {
      const countdownData = calculateCountdown(newsData.eventDate!, newsData.eventTime!);
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}, Log in if you haven't and try again</div>;
  }

  if (!newsData) {
    return <div>No news available.</div>;
  }

  return (
    <>
      <UniversalHeader />
      <div className={styles.newsPageContainer}>
        <h2 className={styles.title}>Communication Board</h2>

        {/* Event Countdown Timer */}
        {newsData.eventDate && newsData.eventTime && (
          <div className={styles.eventSection}>
            <div className={styles.eventInfo}>
              <h3 className={styles.eventTitle}>🎉 Upcoming Event</h3>
              <p className={styles.eventDateTime}>
                📅 {new Date(newsData.eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {newsData.eventTime && ` at ${newsData.eventTime}`}
              </p>
            </div>
            
            {countdown && !eventPassed && (
              <div className={styles.countdownTimer}>
                <h4 className={styles.countdownTitle}>⏰ Time Remaining</h4>
                <div className={styles.countdownGrid}>
                  <div className={styles.timeUnit}>
                    <span className={styles.timeNumber}>{countdown.days}</span>
                    <span className={styles.timeLabel}>Days</span>
                  </div>
                  <div className={styles.timeUnit}>
                    <span className={styles.timeNumber}>{countdown.hours}</span>
                    <span className={styles.timeLabel}>Hours</span>
                  </div>
                  <div className={styles.timeUnit}>
                    <span className={styles.timeNumber}>{countdown.minutes}</span>
                    <span className={styles.timeLabel}>Minutes</span>
                  </div>
                  <div className={styles.timeUnit}>
                    <span className={styles.timeNumber}>{countdown.seconds}</span>
                    <span className={styles.timeLabel}>Seconds</span>
                  </div>
                </div>
              </div>
            )}
            
            {eventPassed && (
              <div className={styles.eventPassed}>
                <h4 className={styles.eventPassedTitle}>✅ Event Has Started/Ended</h4>
                <p>This event is no longer upcoming.</p>
              </div>
            )}
          </div>
        )}

        <div className={styles.newsPage}>
          <div className={styles.imageSection}>
            <img src={newsData.imageUrl} alt="News Image" />
          </div>
          <div className={styles.contentText}>
            <h3 className={styles.newsTextTitle}>{newsData.title}</h3>
            <p className={styles.contextTextP}>{newsData.body}</p>
          </div>
        </div>
        
      </div>
      <Footer />
    </>
  );
};

export default NewsPage;
