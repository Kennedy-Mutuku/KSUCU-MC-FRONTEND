import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/ministryPage.module.css';
import { Link } from 'react-router-dom';
import choirImg from '../../assets/choir.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const ChoirPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${choirImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Choir Ministry</h1>
          <p className={styles.subtitle}>Voices united in harmony to glorify God</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.description}>
            <h2>About Choir</h2>
            <p>
              The Choir Ministry in KSUCU-MC is a vibrant team of dedicated vocalists committed to leading the congregation in worship through song. With a passion for glorifying God through music, the choir blends voices in harmony to create a powerful and uplifting worship atmosphere.
            </p>

            <p>
              Through practice, prayer, and dedication, they minister to the hearts of many, drawing people closer to God with every song they sing. Our choir serves as a vessel for God's love and grace, touching lives through the beauty of unified worship.
            </p>

            <h3>Our Mission</h3>
            <p>
              To worship God through the gift of music, creating harmonious melodies that lift spirits, inspire faith, and bring glory to our Heavenly Father. We believe in the transformative power of music to heal, encourage, and unite God's people
            </p>

            <h3>What We Do</h3>
            <ul className={styles.activitiesList}>
              <li data-number="01">Lead congregational singing during worship services</li>
              <li data-number="02">Perform special musical presentations and concerts</li>
              <li data-number="03">Participate in seasonal celebrations and special events</li>
              <li data-number="04">Support community outreach through musical ministry</li>
              <li data-number="05">Collaborate with other ministries for combined worship</li>
              <li data-number="06">Provide music for weddings, funerals, and special ceremonies</li>
            </ul>

          </div>

          <div className={styles.joinSection}>
            <h2>Join Our Choir Family</h2>
            <p>
              Whether you're an experienced vocalist or someone who simply loves to sing, our choir welcomes all who have a heart for worship and a desire to serve God through music. We provide training and support to help you grow in your musical gifts.
            </p>

            <div className={styles.requirements}>
              <h3>Requirements to Join.</h3>
              <ul>
                <li>Love for Jesus Christ and desire to worship Him</li>
                <li>Willingness to learn and improve vocal skills</li>
                <li>Commitment to regular rehearsals and performances</li>
                <li>Team spirit and cooperative attitude</li>
                <li>Basic reading ability (music reading helpful but not required)</li>
                <li>Consistent attendance at practices and services</li>
              </ul>
            </div>


            <div className={styles.schedule}>
              <h3>Choir Schedule</h3>
              <div className={styles.scheduleGrid}>
                <div className={styles.scheduleItem}>
                  <strong>Main Rehearsal</strong>
                  <p>Saturdays: 2:00 PM - 4:30 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Sectional Practice</strong>
                  <p>Thursdays: 6:00 PM - 7:30 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Pre-Service Warm-up</strong>
                  <p>Sundays: 7:45 AM - 8:15 AM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Special Events</strong>
                  <p>As announced and scheduled</p>
                </div>
              </div>
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

        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1} >
          <div className={styles.description}>
            <h3>Our Choir Philosophy</h3>
            <p>
              "Sing to the Lord a new song; sing to the Lord, all the earth. Sing to the Lord, praise his name; proclaim his salvation day after day." Psalm 96:1-2
            </p>
            <p>
              We believe that when voices unite in worship, something beautiful happens â€“ hearts are lifted, spirits are encouraged, and God is glorified. Our choir is more than a musical group; we're a community of believers who have found joy in serving God together through song.
            </p>

            <h3>Training and Development</h3>
            <p>
              We provide ongoing vocal training, music theory education, and performance coaching to help every member reach their full potential. Our experienced leaders and guest instructors ensure that each member grows both musically and spiritually.
            </p>
          </div>
        </div>


      </div>

      <MinistryRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ministryName="Choir Ministry"
      />
    </>
  );
};

export default ChoirPage;