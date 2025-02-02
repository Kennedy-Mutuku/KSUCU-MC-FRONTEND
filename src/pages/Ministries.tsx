import React, { useEffect } from 'react';
import styles from '../styles/ministries.module.css';

import Header from '../components/header';
import Footer from '../components/footer';
import { useLocation } from 'react-router-dom';

const MinistriesPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetSection = document.getElementById(location.hash.substring(1));
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  return (
    <>
      <Header />
      <div className={styles.main}>
        <h2 className={styles['ministries--title']}>MINISTRIES</h2>

        <div className={styles['ministry-section']} id='wananzambe'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Wananzambe</h3>
            <p className={styles['ministry-content']}>Wanazambe is one of the ministries in KSUCU-MC which deals with Instruments. </p>
          </div>
          <div className={styles['ministry-img']}>
            <img src="" alt="Wananzambe Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={`${styles['ministry-section']} ${styles['ministry-section--reverse']}`} id='compassion'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Compassion</h3>
            <p className={styles['ministry-content']}> Compassion Ministry is one of the ministries in KSUCU-MC which deals with helping the needy students with foodstuffs, personal effects and counseling, It also reaches out to outside compasion like the childrens homes and the street kids </p>
          </div>
          <div className={styles['ministry-img']}>
            <img src="" alt="Compassion Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={styles['ministry-section']} id='pw'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Praise and Worship</h3>
            <p className={styles['ministry-content']}> Praise and Worship is the ministry which deals with Leading the church in Praises and Worship Ministrations </p>
          </div>
          <div className={styles['ministry-img']}>
            <img src="" alt="Praise and Worship Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={`${styles['ministry-section']} ${styles['ministry-section--reverse']}`} id='intercessory'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Intercessory</h3>
            <p className={styles['ministry-content']}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam cupiditate, sequi quis ducimus rem, quidem obcaecati illum odit nostrum sed omnis libero, dolore optio porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime deleniti consectetur dolor velit expedita, doloremque quibusdam temporibus consequatur. Ut, sed?</p>
          </div>
          <div className={styles['ministry-img']}>
            <img src="" alt="Intercessory Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={styles['ministry-section']} id='cs'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Church School</h3>
            <p className={styles['ministry-content']}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam cupiditate, sequi quis ducimus rem, quidem obcaecati illum odit nostrum sed omnis libero, dolore optio porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime deleniti consectetur dolor velit expedita, doloremque quibusdam temporibus consequatur. Ut, sed?</p>
          </div>
          <div className={styles['ministry-img']}>
            <img src="" alt="Church School Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={`${styles['ministry-section']} ${styles['ministry-section--reverse']}`} id='hs'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>High School</h3>
            <p className={styles['ministry-content']}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam cupiditate, sequi quis ducimus rem, quidem obcaecati illum odit nostrum sed omnis libero, dolore optio porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime deleniti consectetur dolor velit expedita, doloremque quibusdam temporibus consequatur. Ut, sed?</p>
          </div>
          <div className={styles['ministry-img']}>
            <img src="" alt="High School Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={styles['ministry-section']} id='ushering'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Ushering</h3>
            <p className={styles['ministry-content']}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam cupiditate, sequi quis ducimus rem, quidem obcaecati illum odit nostrum sed omnis libero, dolore optio porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime deleniti consectetur dolor velit expedita, doloremque quibusdam temporibus consequatur. Ut, sed?</p>
          </div>
          <div className={styles['ministry-img']}>
            <img src="" alt="Ushering Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={`${styles['ministry-section']} ${styles['ministry-section--reverse']}`} id='creativity'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Creativity</h3>
            <p className={styles['ministry-content']}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam cupiditate, sequi quis ducimus rem, quidem obcaecati illum odit nostrum sed omnis libero, dolore optio porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime deleniti consectetur dolor velit expedita, doloremque quibusdam temporibus consequatur. Ut, sed?</p>
          </div>
          <div className={styles['ministry-img']}>
            <img src="" alt="Creativity Ministry" />
          </div>
        </div>

        <div className={`${styles['ministry-section']} ${styles['ministry-section--reverse']}`} id='choir'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Choir</h3>
            <p className={styles['ministry-content']}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam cupiditate, sequi quis ducimus rem, quidem obcaecati illum odit nostrum sed omnis libero, dolore optio porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime deleniti consectetur dolor velit expedita, doloremque quibusdam temporibus consequatur. Ut, sed?</p>
          </div>
          <div className={styles['ministry-img']}>
            <img src="" alt="Choir Ministry" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MinistriesPage;
