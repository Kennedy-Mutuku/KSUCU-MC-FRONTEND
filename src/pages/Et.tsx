import React, { useEffect } from 'react';
import styles from '../styles/ET.module.css';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import { useLocation } from 'react-router-dom';
import WESO from '../assets/WESO.jpg';
import RIVET from '../assets/RIVET.jpg';
import ESET from '../assets/eset.jpg';
import CET  from '../assets/CET.jpg'
import NET from '../assets/NET.jpg'

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
      <UniversalHeader />
      <div className={styles['main']}>
        <h2 className={styles['ET--title']}>EVANGELISTIC TEAMS</h2>

        <div className={styles['ET-section']} id='rivet'>
          <div className={styles['ET-section--flex']}>
            <h3 className={styles['ET-name']}>RIVET</h3>
            <p className={styles['ET-content']}> RIVET (Rift Valley Evangelistic Team) is a dedicated evangelistic ministry within KSUCU-MC, focused on spreading the Gospel across the Rift Valley region. The team is committed to equipping believers for evangelism, organizing impactful missions, and fostering spiritual growth through regular fellowships. By actively engaging in outreach and discipleship, RIVET plays a vital role in fulfilling the Great Commission within its designated region.
</p>
          </div>
          <div className={styles['ET-img']}>
            <img src={RIVET} alt="" />
          </div>
        </div>

        <div className={styles['hr-et']}></div>

        <div className={`${styles['ET-section']} ${styles['ET-section--reverse']}`} id='net'>
          <div className={styles['ET-section--flex']}>
            <h3 className={styles['ET-name']}>NET</h3>
            <p className={styles['ET-content']}>NET (Nyanza Evangelistic Team) is a vibrant ministry in KSUCU-MC, dedicated to evangelizing the Nyanza region. The team focuses on equipping members for evangelism, organizing impactful missions, and fostering spiritual growth through regular fellowships. Through outreach, discipleship, and mission work, NET seeks to spread the Gospel and transform lives, advancing the Kingdom of God in the region.</p>
          </div>
          <div className={styles['ET-img']}>
            <img src={NET} alt="" />
          </div>
        </div>

        <div className={styles['hr-et']}></div>

        <div className={styles['ET-section']} id='eset'>
          <div className={styles['ET-section--flex']}>
            <h3 className={styles['ET-name']}>ESET</h3>
            <p className={styles['ET-content']}>ESET (Eastern Evangelistic Team) is a dedicated ministry in KSUCU-MC, focused on spreading the Gospel across the Eastern, Coastal, and North Eastern regions. The team actively equips members for evangelism, organizes impactful missions, and fosters spiritual growth through regular fellowships. Committed to reaching diverse communities, ESET plays a crucial role in advancing the Great Commission and transforming lives through the power of the Gospel.</p>
          </div>
          <div className={styles['ET-img']}>
            <img src={ESET} alt="" />
          </div>
        </div>

        <div className={styles['hr-et']}></div>

        <div className={`${styles['ET-section']} ${styles['ET-section--reverse']}`} id='weso'>
          <div className={styles['ET-section--flex']}>
            <h3 className={styles['ET-name']}>WESO</h3>
            <p className={styles['ET-content']}>WESO (Western Evangelistic Students Outreach) is a passionate evangelistic ministry in KSUCU-MC, dedicated to spreading the Gospel across the Western region. The team focuses on equipping members for effective evangelism, organizing fellowships, and carrying out impactful missions. Through outreach, discipleship, and mission work, WESO seeks to transform lives and expand God’s kingdom in the region. </p>
          </div>
          <div className={styles['ET-img']}>
            <img src={WESO} alt="" />
          </div>
        </div>

        <div className={styles['hr-et']}></div>

        <div className={styles['ET-section']} id='cet'>
          <div className={styles['ET-section--flex']}>
            <h3 className={styles['ET-name']}>CET</h3>
            <p className={styles['ET-content']}>CET (Central Evangelistic Team) is a mission-driven ministry in KSUCU-MC, committed to evangelizing the Central region and Nairobi. The team focuses on equipping members for evangelism, organizing fellowships, and conducting impactful missions. Through outreach and discipleship, CET plays a key role in spreading the Gospel and nurturing spiritual growth in the region. </p>
          </div>
          <div className={styles['ET-img']}>
            <img src={CET} alt="" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Etpage;
