import React, { useState, useEffect } from 'react';
import styles from '../styles/NewsPage.module.css';
import Header from '../components/header';
import Footer from '../components/footer';

interface NewsData {
  title: string;
  body: string;
  imageUrl: string;
}

const NewsPage: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the news data from the backend
    const fetchNewsData = async () => {
      try {
        const response = await fetch('http://localhost:3000/adminnews/news', {
          method: 'GET',
          credentials: 'include'  // Ensures cookies (for authentication) are sent with the request
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
      <Header />
      <div className={styles.newsPageContainer}>
        <h2 className={styles.title}>Communication Board</h2>
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
