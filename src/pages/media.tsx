import React from 'react';
import styles from '../styles/Media.module.css';
import Header from '../components/header';
import Footer from '../components/footer';

const Media: React.FC = () => {
  return (
    <>
        <Header />
        <main>
            <div className={styles.mediatitle}>
                <h2 className={styles['media-tittle--text']}>KSUCU-MC MEDIA</h2>
                
                <div className={styles['link-flex']}>
                <div className={styles['first-links']}>
                    <ul className={styles['first-link--list']}>
                    <li className={styles['first-link--item']}>
                        <a href="https://www.youtube.com/results?search_query=kisii+university+christian+union" className={styles['first-link']}>YOUTUBE</a>
                    </li>
                    <li className={styles['first-link--item']}><a href="/" className={styles['first-link']}>FACEBOOK</a></li>
                    <li className={styles['first-link--item']}><a href="/" className={styles['first-link']}>TIKTOK</a></li>
                    <li className={styles['first-link--item']}><a href="/" className={styles['first-link']}>TWITTER</a></li>
                    </ul>
                </div>

                <div className={styles['first-links-2']}>
                    <ul className={styles['first-link--list']}>
                    <li className={styles['first-link--item']}><a href="/" className={styles['first-link']}>NEWS</a></li>
                    <li className={styles['first-link--item']}><a href="/" className={styles['first-link']}>GALLERY</a></li>
                    <li className={styles['first-link--item']}><a href="/" className={styles['first-link']}>VIDEOS</a></li>
                    <li className={styles['first-link--item']}><a href="/" className={styles['first-link']}>E-LIBRARY</a></li>
                    </ul>
                </div>
                </div>    

                <div className={styles['cta-btn-div']}>
                <button className={styles['cta-btn']}>Go Live</button>
                </div>
            </div>
        </main>
        <Footer />
    </>


  );
};

export default Media;

