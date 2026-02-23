import React, { useEffect, useRef, useState } from 'react';
import styles from './choir.module.css';
import { Link } from 'react-router-dom';
import choirImg from '../../assets/choir.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const ChoirPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${choirImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Choir Ministry</h1>
          <p className={styles.subtitle}>Voices united in harmony to glorify God</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Choir Ministry</h2>
            <p>
              The Choir Ministry is a dedicated team of student vocalists committed to glorifying God through unified, disciplined singing. Through rehearsed harmony and heartfelt worship, we seek to support the spiritual life of the Christian Union and serve the campus community with excellence.
            </p>

            <h3>Our Mission</h3>
            <p>
              To honor God through coordinated vocal excellence, using music to encourage faith, strengthen unity, and support the worship life of the Christian Union.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">Perform special musical presentations and concerts</li>
              <li data-number="02">Support community outreach through musical ministry</li>
              <li data-number="03">Collaborate with other ministries for combined worship</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join Our Choir</h2>
            <p>
              Do you have a passion for singing and a desire to use your voice in service to God? We welcome students who are willing to grow in vocal skill, discipline, and spiritual maturity while serving through music.
            </p>
            <p>
              We are looking for:
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>A genuine commitment to Christ</li>
                <li>Willingness to develop vocal ability</li>
                <li>Consistent attendance at rehearsals and ministry activities</li>
                <li>Team spirit and humility</li>
                <li>Openness to correction and growth</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <Link to="/contact-us" className={styles.commitmentButton}>
                Join Choir
              </Link>
              <Link to="/contact-us" className={styles.contactButton}>
                Contact Overseer
              </Link>
            </div>
          </div>
        </div>

        <MinistryRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ministryName="Choir Ministry"
        />
      </div>
    </>
  );
};

export default ChoirPage;