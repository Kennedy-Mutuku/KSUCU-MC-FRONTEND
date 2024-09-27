import React from 'react';
import styles from '../styles/NewsPage.module.css';
import image from '../assets/instrumenttalist.jpg';
import Header from '../components/header';
import Footer from '../components/footer';

const NewsPage: React.FC = () => {
  return (

    <>
    <Header />
    
    <div className={styles.newsPageContainer}>
      
    <h2 className={styles['title']}>Communication Board</h2>
        <div className={styles.newsPage}>
          
          <div className={styles.imageSection}>
            <img src={image} alt="page image" />
          </div>

          <div className={styles.contentText}>
                      <h3 className={styles.newsTextTitle}>See how the grace lifted the drummist</h3>
            <p className={styles.contextTextP}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, animi nulla! Excepturi vel quos omnis. Quasi necessitatibus suscipit, sed vitae quibusdam consequatur perspiciatis? Perspiciatis eaque vero repellat et totam nesciunt ab saepe rem amet, culpa consectetur id cum asperiores reprehenderit, deserunt nam iusto, animi aut neque nulla minus alias tempora?</p>
          </div>
        </div>

    </div>
    <Footer />
    </>

  );
};

export default NewsPage;

