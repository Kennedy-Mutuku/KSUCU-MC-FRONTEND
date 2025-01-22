import React, { useEffect } from 'react';
import styles from '../styles/ET.module.css';
import Header from '../components/header';
import Footer from '../components/footer';
import { useLocation } from 'react-router-dom';

const Etpage: React.FC = () => {

  const location = useLocation();

  useEffect(() => {
    // Check if there's a hash in the URL
    if (location.hash) {
      // Extract the hash from the URL
      const targetSection = document.getElementById(location.hash.substring(1));

      // Scroll to the target section
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  return (
    <>
      <Header />
      <div className={styles['main']}>
        <h2 className={styles['ET--title']}>EVANGELISTIC TEAMS</h2>

        <div className={styles['ET-section']} id='rivet'>
          <div className={styles['ET-section--flex']}>
            <h3 className={styles['ET-name']}>RIVET</h3>
            <p className={styles['ET-content']}> RIVET Means Rift Valley Evangelistic Team. It covers Rift valley region. These are the main roles of the this Evangelistic Team•	Organize fellowships for their members
•	Equipping members for evangelism
•	Carrying all evangelism activities
•	Organizing missions in their respective regions 
</p>
          </div>
          <div className={styles['ET-img']}>
            <img src="" alt="" />
          </div>
        </div>

        <div className={styles['hr-et']}></div>

        <div className={`${styles['ET-section']} ${styles['ET-section--reverse']}`} id='net'>
          <div className={styles['ET-section--flex']}>
            <h3 className={styles['ET-name']}>NET</h3>
            <p className={styles['ET-content']}>NET Means Nyanza Evangelitic Team. It covers Nyanza region. These are the main roles of the this Evangelistic Team•	Organize fellowships for their members
•	Equipping members for evangelism
•	Carrying all evangelism activities
•	Organizing missions in their respective regions </p>
          </div>
          <div className={styles['ET-img']}>
            <img src="" alt="" />
          </div>
        </div>

        <div className={styles['hr-et']}></div>

        <div className={styles['ET-section']} id='eset'>
          <div className={styles['ET-section--flex']}>
            <h3 className={styles['ET-name']}>ESET</h3>
            <p className={styles['ET-content']}>ESET Means Eastern Evangelistic Team. It covers Eastern, Coastal and north Eastern region. These are the main roles of the this Evangelistic Team•	Organize fellowships for their members
•	Equipping members for evangelism
•	Carrying all evangelism activities
•	Organizing missions in their respective regions </p>
          </div>
          <div className={styles['ET-img']}>
            <img src="" alt="" />
          </div>
        </div>

        <div className={styles['hr-et']}></div>

        <div className={`${styles['ET-section']} ${styles['ET-section--reverse']}`} id='weso'>
          <div className={styles['ET-section--flex']}>
            <h3 className={styles['ET-name']}>WESO</h3>
            <p className={styles['ET-content']}>WESO Means Western Evangelistic Students Outreach. It covers Western Region. These are the main roles of the this Evangelistic Team•	Organize fellowships for their members
•	Equipping members for evangelism
•	Carrying all evangelism activities
•	Organizing missions in their respective regions </p>
          </div>
          <div className={styles['ET-img']}>
            <img src="" alt="" />
          </div>
        </div>

        <div className={styles['hr-et']}></div>

        <div className={styles['ET-section']} id='cet'>
          <div className={styles['ET-section--flex']}>
            <h3 className={styles['ET-name']}>CET</h3>
            <p className={styles['ET-content']}>CET Means Central  Evangelistic Team. It covers Central region and Nairobi. These are the main roles of the this Evangelistic Team•	Organize fellowships for their members
•	Equipping members for evangelism
•	Carrying all evangelism activities
•	Organizing missions in their respective regions </p>
          </div>
          <div className={styles['ET-img']}>
            <img src="" alt="" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Etpage;
