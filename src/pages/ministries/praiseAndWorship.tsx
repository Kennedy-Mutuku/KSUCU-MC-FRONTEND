import React, { useEffect, useRef } from 'react';
import styles from '../../styles/ministryPage.module.css';
import { Link } from 'react-router-dom';
import praiseAndWorshipImg from '../../assets/praise-and-worship.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';
import { useState } from 'react';

const PraiseAndWorshipPage: React.FC = () => {
  const contentRef1 = useRef<HTMLDivElement>(null);
  const contentRef2 = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
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
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe elements if they exist
    if (contentRef1.current) observer.observe(contentRef1.current);
    if (contentRef2.current) observer.observe(contentRef2.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${praiseAndWorshipImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Praise and Worship Ministry</h1>
          <p className={styles.subtitle}>Leading hearts into God's presence through worship</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.description}>
            <h2>About Praise and Worship</h2>
            <p>
              The Praise and Worship Ministry exists to lead our congregation into the presence of God through heartfelt worship, uplifting music, and a lifestyle of praise. We are passionate about glorifying God and creating an atmosphere where people can encounter Him, experience His love, and respond in worship.
            </p>

            <p>
              Our ministry is committed to excellence in musicianship, unity in spirit, and authenticity in worship. Whether through singing, playing instruments, or leading in prayer, our team's mission is to magnify God and inspire others to do the same
            </p>

            <h3>Our Vision</h3>
            <p>
              To create transformative worship experiences that draw people closer to God, encouraging every heart to worship in spirit and truth. We believe worship is not just about music, but about the condition of our hearts before God.
            </p>

            <h3>What We Do</h3>
            <ul className={styles.activitiesList}>
              <li data-number="01">Lead corporate worship during Sunday services</li>
              <li data-number="02">Facilitate prayer and worship nights</li>
              <li data-number="03">Organize special worship concerts and events</li>
              <li data-number="04">Mentor upcoming worship leaders and musicians</li>
              <li data-number="05">Participate in community outreach through worship</li>
              <li data-number="06">Lead worship during retreats and conferences</li>
            </ul>

          </div>

          <div className={styles.joinSection}>
            <h2>Join Our Worship Team</h2>
            <p>
              If you have a heart for worship and a desire to use your gifts for God's glory, we invite you to join us. Together, we'll lift up the name of Jesus and create moments that touch heaven and change lives.
            </p>

            <div className={styles.requirements}>
              <h3>Requirements to Join</h3>
              <ul>
                <li>Personal relationship with Jesus Christ</li>
                <li>Heart for worship and leading others into God's presence</li>
                <li>Musical ability (voice or instruments) - all skill levels welcome</li>
                <li>Commitment to team practices and Sunday services</li>
                <li>Willingness to grow spiritually and musically</li>
                <li>Team spirit and humble servant's heart</li>
              </ul>
            </div>


            <div className={styles.schedule}>
              <h3>Our Schedule</h3>
              <div className={styles.scheduleGrid}>
                <div className={styles.scheduleItem}>
                  <strong>Team Practice</strong>
                  <p>Saturdays: 8:00 PM - 4:00 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Pre-Service Prep</strong>
                  <p>Sundays: 7:00 AM - 8:15 AM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Worship Service</strong>
                  <p>Sundays: 8:30 AM - 11:30 AM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Prayer Sessions</strong>
                  <p>Wednesdays: 6:00 PM - 7:30 PM</p>
                </div>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <Link to="/contact-us" className={styles.commitmentButton}>
                Join Worship Team
              </Link>
              <Link to="/contact-us" className={styles.contactButton}>
                Contact Worship Coodinator
              </Link>
            </div>
          </div>
        </div>

        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1} >
          <div className={styles.description}>
            <h3>Our Worship Philosophy</h3>
            <p>
              "Let everything that has breath praise the Lord. Praise the Lord!" Psalm 150:6
            </p>
            <p>
              We believe that worship is both a privilege and a responsibility. It's our response to who God is and what He has done for us. Our goal is not just to perform music, but to create an environment where every person can encounter the living God and respond with their whole heart.
            </p>

          </div>
        </div>


      </div>

      <MinistryRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ministryName="Praise and Worship Ministry"
      />
    </>
  );
};

export default PraiseAndWorshipPage;