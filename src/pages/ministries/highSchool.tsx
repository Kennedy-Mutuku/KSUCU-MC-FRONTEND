import React, { useEffect, useRef, useState } from 'react';
import styles from './highSchool.module.css';
import { Link } from 'react-router-dom';
import highSchoolImg from '../../assets/high-school.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const HighSchoolPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${highSchoolImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>High School Ministry</h1>
          <p className={styles.subtitle}>Preaching Christ. Mentoring Students. Making Disciples.</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.description}>
            <div className={styles.sectionBlock}>
              <h2>About High School Ministry</h2>
              <p>
                The High School Ministry exists to preach the Gospel to high-school students and walk with them through intentional mentorship and structured discipleship. We aim to ground students in biblical truth, support their spiritual growth, and help them live out their faith with conviction during their school years.
              </p>

              <h3>Our Mission</h3>
              <p>
                To raise biblically grounded high-school students who understand their faith, live it with integrity, and reflect Christ in their schools and communities.
              </p>
            </div>
            
            <div className={styles.sectionBlock}>
              <h2>What We Do</h2>
              <ul className={styles.activitiesList}>
                <li data-number="01">Gospel-centered preaching and teaching during high-school gatherings</li>
                <li data-number="02">Intentional mentorship and personal spiritual guidance</li>
                <li data-number="03">Structured discipleship through small-group Bible study</li>
              </ul>
            </div>

            <div className={styles.sectionBlock}>
              <h2>Join High School Ministry</h2>
              <p>
                This ministry requires spiritually mature and consistent university students who are willing to teach, mentor, and disciple high-school students faithfully. If you are ready to serve with integrity and commitment, we welcome you.
              </p>
              
              <div className={styles.requirements}>
                <h3>Expectations</h3>
                <ul>
                  <li>A growing and disciplined personal relationship with Christ</li>
                  <li>Willingness to teach and mentor consistently</li>
                  <li>Commitment to sound biblical doctrine</li>
                  <li>Integrity in conduct and speech</li>
                  <li>Availability for scheduled outreach and follow-up</li>
                </ul>
              </div>
              
              <div className={styles.actionButtons}>
                <button className={styles.commitmentButton} onClick={() => setIsModalOpen(true)}>
                  Join High School Ministry
                </button>
                <Link to="/contact-us" className={styles.contactButton}>
                  Contact Ministry Coordinator
                </Link>
              </div>
            </div>
          </div>
        </div>

        <MinistryRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ministryName="High School Ministry"
        />
      </div>
    </>
  );
};

export default HighSchoolPage;