import React, { useEffect, useRef, useState } from 'react';
import styles from './creativity.module.css';
import { Link } from 'react-router-dom';
import creativityImg from '../../assets/creativity.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const CreativityPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${creativityImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Creativity Ministry</h1>
          <p className={styles.subtitle}>Using drama and storytelling to communicate truth</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Creativity Ministry</h2>
            <p>
              The Creativity Ministry uses drama and theatrical expression to communicate biblical truth in relatable and impactful ways. Through skits, stage presentations, and themed productions, we support the preaching of the Word and create moments that help the congregation reflect, understand, and respond.
            </p>

            <h3>Our Vision</h3>
            <p>
              To use drama and creative storytelling as a tool for spiritual reflection, helping students engage with biblical truth in practical and memorable ways.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">Present drama and skits during Sunday services to illustrate sermon messages</li>
              <li data-number="02">Organize themed Creativity Nights featuring stage performances and storytelling</li>
              <li data-number="03">Develop short dramatic pieces that address real-life issues from a biblical perspective</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join the Creativity Ministry</h2>
            <p>
              Do you have a passion for drama, storytelling, or stage performance? We welcome students who are willing to grow in confidence, teamwork, and biblical understanding while using creativity to serve the Christian Union.
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>A genuine commitment to Christ</li>
                <li>Willingness to learn and participate in rehearsals</li>
                <li>Openness to teamwork and constructive feedback</li>
                <li>Reliability during scheduled presentations</li>
                <li>Desire to grow in confidence and stage discipline</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.commitmentButton} onClick={() => setIsModalOpen(true)}>
                Join Creativity Ministry
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
          ministryName="Creativity Ministry"
        />
      </div>
    </>
  );
};

export default CreativityPage;