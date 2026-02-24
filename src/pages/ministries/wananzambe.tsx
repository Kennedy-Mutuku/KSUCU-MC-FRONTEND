import React, { useEffect, useRef, useState } from 'react';
import styles from './wananzambe.module.css';
import { Link } from 'react-router-dom';
import wanazambeImg from '../../assets/wananzambe.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const WanazambePage: React.FC = () => {
  const contentRef1 = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Simple scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible || 'visible');
        }
      });
    }, observerOptions);

    // Observe elements if they exist
    if (contentRef1.current) observer.observe(contentRef1.current);

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${wanazambeImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Wananzambe (Instrumentalists)</h1>
          <p className={styles.subtitle}>Instrumentalists dedicated to worship excellence</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Wananzambe</h2>
            <p>
              Wananzambe is the instrumentalists' ministry of KSUCU-MC, committed to strengthening worship through skilled musicianship and servant leadership. Our team exists to support and elevate the worship experience, creating an atmosphere that leads the congregation into deep and meaningful encounters with God.
            </p>

            <h3>Our Mission</h3>
            <p>
              To glorify God through instrumental worship, creating an atmosphere where hearts are lifted and souls are touched by His presence. We strive to support the worship experience through skillful musicianship and devoted hearts.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">Lead instrumental worship during church services</li>
              <li data-number="02">Support choir and praise & worship team performances</li>
              <li data-number="03">Participate in special events and concerts</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join Wananzambe</h2>
            <p>
              Do you have a heart for worship and musical talents to share? We welcome musicians of all skill levels who are passionate about serving God through instrumental worship.
            </p>
            <p>
              We are looking for:
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>Born-again Christian with a heart for worship</li>
                <li>Basic instrumental skills (training provided for beginners)</li>
                <li>Commitment to regular practice and services</li>
                <li>Willingness to grow in faith and musical excellence</li>
                <li>Team player attitude and servant's heart</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <Link to="/contact-us" className={styles.commitmentButton}>
                Join Wananzambe
              </Link>
              <Link to="/contact-us" className={styles.contactButton}>
                Contact Worship Coordinator
              </Link>
            </div>
          </div>
        </div>

        <MinistryRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ministryName="Wananzambe Ministry"
        />
      </div>
    </>
  );
};

export default WanazambePage;