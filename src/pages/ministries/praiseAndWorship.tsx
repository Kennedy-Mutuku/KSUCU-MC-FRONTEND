import React, { useEffect, useRef, useState } from 'react';
import styles from './praiseAndWorship.module.css';
import { Link } from 'react-router-dom';
import praiseAndWorshipImg from '../../assets/praise-and-worship.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const PraiseAndWorshipPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${praiseAndWorshipImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Praise & Worship Ministry</h1>
          <p className={styles.subtitle}>Leading hearts into God’s presence through authentic worship</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Praise & Worship</h2>
            <p>
              We lead the community in sincere worship that points people to God. Our focus is creating space where students encounter Him, understand His love, and respond with faith and devotion.
            </p>

            <h3>Our Vision</h3>
            <p>
              To cultivate a culture of worship that shapes lives, strengthens faith, and reflects Christ across campus.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">Lead powerful corporate worship during Sunday services and Friday Fellowships</li>
              <li data-number="02">Participate in community outreach through worship</li>
              <li data-number="03">Lead worship during retreats and conferences</li>
              <li data-number="04">Develop disciplined, skilled worship leaders and musicians</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join Our Worship Team</h2>
            <p>
              Ready to use your voice, instrument, or leadership for something eternal? We are building a team of people who love Jesus and value excellence in worship.
            </p>
            <p>
              We are looking for:
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>A visible and growing relationship with Jesus</li>
                <li>A lifestyle that reflects integrity and spiritual maturity</li>
                <li>Musical or vocal ability with willingness to train seriously</li>
                <li>Commitment to rehearsals, services, and team accountability</li>
                <li>Humility, discipline, and hunger for growth</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <Link to="/contact-us" className={styles.commitmentButton}>
                Join Worship Team
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
          ministryName="Praise and Worship Ministry"
        />
      </div>
    </>
  );
};

export default PraiseAndWorshipPage;