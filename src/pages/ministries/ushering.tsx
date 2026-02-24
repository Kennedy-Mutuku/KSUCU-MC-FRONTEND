import React, { useEffect, useRef, useState } from 'react';
import styles from './ushering.module.css';
import { Link } from 'react-router-dom';
import usheringImg from '../../assets/ushering.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const UsheringPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${usheringImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Ushering and Hospitality Ministry</h1>
          <p className={styles.subtitle}>Serving with order, warmth, and responsibility</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Ushering & Hospitality</h2>
            <p>
              The Ushering and Hospitality Ministry supports the smooth and orderly flow of Christian Union services. Through practical service and responsible coordination, we assist attendees, maintain structure during gatherings, and ensure that every service environment remains welcoming and well organized.
            </p>

            <h3>Our Mission</h3>
            <p>
              To serve with integrity and discipline, creating an atmosphere of order and hospitality that supports meaningful worship experiences.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">Assist with seating and provide service information</li>
              <li data-number="02">Manage offering collection during services</li>
              <li data-number="03">Maintain order and assist with crowd coordination</li>
              <li data-number="04">Provide directions and respond to questions</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join the Ushering Team</h2>
            <p>
              Do you have a heart for service and a willingness to support the ministry through practical responsibility? We welcome students who value order, reliability, and teamwork in serving the Christian Union community.
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>Commitment to serving faithfully</li>
                <li>Punctuality and reliability</li>
                <li>Respectful and responsible conduct</li>
                <li>Ability to remain calm and attentive during services</li>
                <li>Willingness to work as part of a coordinated team</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.commitmentButton} onClick={() => setIsModalOpen(true)}>
                Join Ushering Team
              </button>
              <Link to="/contact-us" className={styles.contactButton}>
                Contact Coordinator
              </Link>
            </div>
          </div>
        </div>

        <MinistryRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ministryName="Ushering and Hospitality Ministry"
        />
      </div>
    </>
  );
};

export default UsheringPage;