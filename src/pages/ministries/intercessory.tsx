import React, { useEffect, useRef, useState } from 'react';
import styles from './intercessory.module.css';
import { Link } from 'react-router-dom';
import intercesorryImg from '../../assets/intersesory.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const IntercessoryPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${intercesorryImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Intercessory Ministry</h1>
          <p className={styles.subtitle}>Standing in the gap through prayer</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Intercessory Ministry</h2>
            <p>
              The Intercessory Ministry is dedicated to standing in the gap through intentional and faithful prayer. We lift the needs of individuals, the Christian Union, and the wider community before God, seeking His will and trusting His promises. Through disciplined intercession, we create spiritual covering, support others in times of challenge, and celebrate answered prayer together.
            </p>

            <h3>Our Mission</h3>
            <p>
              To be a house of prayer within the Christian Union, faithfully interceding for the church, the campus, and the wider community. We seek to build a consistent culture of prayer that aligns with God’s heart and purposes.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">Hold corporate prayer meetings</li>
              <li data-number="02">Receive and intercede over individual prayer requests</li>
              <li data-number="03">Organize fasting and prayer gatherings</li>
              <li data-number="04">Provide training and guidance in biblical intercession</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join the Intercessory Team</h2>
            <p>
              Do you have a burden for prayer and a desire to stand in the gap for others? We welcome committed individuals who are willing to grow in spiritual discipline and faithful intercession.
            </p>
            <p>
              We are looking for:
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>A genuine commitment to prayer</li>
                <li>Spiritual maturity and confidentiality</li>
                <li>Consistent participation in meetings</li>
                <li>Willingness to pray faithfully for others</li>
                <li>Desire to grow in biblical understanding of prayer</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <Link to="/contact-us" className={styles.commitmentButton}>
                Join Prayer Team
              </Link>
              <Link to="/contact-us" className={styles.contactButton}>
                Submit Prayer Request
              </Link>
            </div>
          </div>
        </div>

        <MinistryRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ministryName="Intercessory Ministry"
        />
      </div>
    </>
  );
};

export default IntercessoryPage;