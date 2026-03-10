import React, { useEffect, useRef, useState } from 'react';
import styles from './churchSchool.module.css';
import { Link } from 'react-router-dom';
import churshSchoolImg from '../../assets/churchschool.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const ChurchSchoolPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${churshSchoolImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Church School Ministry</h1>
          <p className={styles.subtitle}>Serving schools through mentorship, support, and faith</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Church School Ministry</h2>
            <p>
              The Church School Ministry partners with local schools to provide mentorship, academic support, and spiritual encouragement to students. Through consistent engagement, we aim to support character development, strengthen learning, and reflect Christ's love through practical service.
            </p>

            <h3>Our Vision</h3>
            <p>
              To support the educational community through mentorship, academic assistance, and spiritual guidance, contributing positively to students' growth in character and faith.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">After-school tutoring and homework assistance</li>
              <li data-number="02">Mentorship and guidance for students</li>
              <li data-number="03">Teacher support and appreciation initiatives</li>
              <li data-number="04">Spiritual nurture through prayer and biblical encouragement</li>
              <li data-number="05">Character and values development through structured engagement</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join Church School Ministry</h2>
            <p>
              Do you have a heart for guiding and supporting young learners? We welcome students who are willing to invest their time, skills, and faith into mentorship and academic support within local schools.
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>A genuine commitment to Christ</li>
                <li>Respect for children and educational environments</li>
                <li>Willingness to mentor and support students consistently</li>
                <li>Basic academic competence or willingness to assist with tutoring</li>
                <li>Commitment to safeguarding and responsible conduct (background check may be required)</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.commitmentButton} onClick={() => setIsModalOpen(true)}>
                Join Church School Ministry
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
          ministryName="Church School Ministry"
        />
      </div>
    </>
  );
};

export default ChurchSchoolPage;