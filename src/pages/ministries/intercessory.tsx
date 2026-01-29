import React, { useEffect, useRef } from 'react';
import styles from '../../styles/ministryPage.module.css';
import UniversalHeader from '../../components/UniversalHeader';
import Footer from '../../components/footer';
import { Link } from 'react-router-dom';
import intercesorryImg from '../../assets/intersesory.jpg';

const IntercessoryPage: React.FC = () => {
  const contentRef1 = useRef<HTMLDivElement>(null);
  const contentRef2 = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

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
      <UniversalHeader />
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Intercessory Ministry</h1>
            <p className={styles.subtitle}>Standing in the gap through prayer</p>
          </div>
          
          <div className={styles.heroImage}>
            <img src={intercesorryImg} alt="Ushering and Hospitality Ministry" />
          </div>
        </div>

        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.description}>
            <h2>About Intercessory Prayer</h2>
            <p>
              The Intercessory Ministry is dedicated to standing in the gap through prayer, seeking God's heart, and lifting the needs of others before Him. Rooted in faith and compassion, this ministry strives to align with God's will and bring hope, healing, and transformation through the power of prayer.
            </p>
            
            <p>
              We believe in the importance of interceding for individuals, families, communities, and nations, trusting in the promises of God to hear and answer our petitions. Our prayer warriors are committed to creating a spiritual covering, offering support during times of challenge, and celebrating breakthroughs as God moves.
            </p>
            
            <h3>Our Mission</h3>
            <p>
              To be a house of prayer for all nations, interceding for the needs of our church, community, and world. We seek to build a bridge between heaven and earth through persistent, faithful prayer.
            </p>
            
            <h3>What We Do</h3>
            <ul className={styles.activitiesList}>
              <li data-number="01">Corporate prayer sessions and prayer meetings</li>
              <li data-number="02">Individual prayer requests and follow-up</li>
              <li data-number="03">24/7 prayer chain for urgent needs</li>
              <li data-number="04">Fasting and prayer retreats</li>
              <li data-number="05">Spiritual warfare and deliverance ministry</li>
              <li data-number="06">Prayer walks and community intercession</li>
              <li data-number="06">Training in prayer principles and techniques</li>
              <li data-number="06">Prophetic intercession and listening prayer</li>
            </ul>
            
          </div>

          <div className={styles.joinSection}>
            <h2>Join Our Prayer Army</h2>
            <p>
             Whether you're in need of prayer, feel called to intercede for others, or want to deepen your connection with God, we welcome you to join us in this vital and impactful ministry.
            </p>
            
            <div className={styles.requirements}>
              <h3>How to Get Involved</h3>
              <ul>
                <li>Heart for prayer and seeking God's presence</li>
                <li>Commitment to confidentiality and sensitivity</li>
                <li>Regular participation in prayer meetings</li>
                <li>Willingness to pray for others consistently</li>
                <li>Desire to grow in prayer and spiritual maturity</li>
                <li>Availability for emergency prayer needs</li>
              </ul>
            </div>
            

            <div className={styles.schedule}>
              <h3>Prayer Schedule</h3>
              <div className={styles.scheduleGrid}>
                <div className={styles.scheduleItem}>
                  <strong>Weekly Prayer Meeting</strong>
                  <p>Wednesdays: 6:00 PM - 7:30 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Early Morning Prayer</strong>
                  <p>Daily: 5:30 AM - 6:30 AM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Friday Night Prayer</strong>
                  <p>Fridays: 8:00 PM - 10:00 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Prayer & Fasting</strong>
                  <p>First Friday of each month</p>
                </div>
              </div>
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

<div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1} >
          <div className={styles.description}>
            <h3>Our Prayer Philosophy</h3>
            <p>
              "The prayer of a righteous person is powerful and effective." James 5:1
            </p>
            <p>
             We believe prayer is both a privilege and a responsibility. It's our direct line of communication with our Heavenly Father and the means by which His will is accomplished on earth. Through intercession, we partner with God in His work of transformation and redemption.
            </p>
            
          </div>
        </div>
        <div className={`${styles.testimonialsSection} ${styles.animate}`} ref={testimonialsRef}>
          <h2>Testimonies of God's Faithfulness</h2>
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <p>"Through intercession, I've learned that prayer is not just asking, but listening for God's heart and will."</p>
              <span>- Elizabeth, Prayer Warrior</span>
            </div>
            <div className={styles.testimonial}>
              <p>"This ministry has taught me the power of persistent prayer and how God moves when His people unite in prayer."</p>
              <span>- Samuel, Intercessor</span>
            </div>
            <div className={styles.testimonial}>
              <p>"Being part of this ministry has deepened my relationship with God and shown me His faithfulness in answering prayer."</p>
              <span>- Mary, Prayer Team Leader</span>
            </div>
          </div>
        </div>

        
      </div>
      
      <Footer />
    </>
  );
};

export default IntercessoryPage;