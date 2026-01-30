import React, { useEffect, useRef } from 'react';
import styles from '../../styles/ministryPage.module.css';
import UniversalHeader from '../../components/UniversalHeader';
import Footer from '../../components/footer';
import { Link } from 'react-router-dom';
import wanazambeImg from '../../assets/wananzambe.jpg';

const WanazambePage: React.FC = () => {
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
            <h1 className={styles.title}>Wananzambe (Instrumentalists)</h1>
            <p className={styles.subtitle}>Instrumentalists dedicated to worship excellence</p>
          </div>
          
          <div className={styles.heroImage}>
            <img src={wanazambeImg} alt="Ushering and Hospitality Ministry" />
          </div>
        </div>

        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.description}>
            <h2>About Wananzambe</h2>
            <p>
              Wananzambe is the instrumentalists' ministry in KSUCU-MC, dedicated to enhancing worship through music. This ministry consists of skilled musicians who play various instruments to create a powerful and uplifting worship experience. With a passion for excellence and a heart for service, Wananzambe plays a vital role in leading the congregation into deep and meaningful worship.
            </p>
            
            
            <h3>Our Mission</h3>
            <p>
              To glorify God through instrumental worship, creating an atmosphere where hearts are lifted and souls are touched by His presence. We strive to support the worship experience through skillful musicianship and devoted hearts.
            </p>
            
            <h3>What We Do</h3>
            <ul className={styles.activitiesList}>
              <li data-number="01">Lead instrumental worship during church services</li>
              <li data-number="02">Support choir and praise & worship team performances</li>
              <li data-number="03">Participate in special events and concerts</li>
              <li data-number="04">Conduct music workshops and mentorship programs</li>
              <li data-number="05">Organize community outreach through music</li>
            </ul>
            
          </div>

          <div className={styles.joinSection}>
            <h2>Join Wananzambe</h2>
            <p>
             Do you have a heart for worship and musical talents to share? We welcome musicians of all skill levels who are passionate about serving God through instrumental worship.
            </p>
            
            <div className={styles.requirements}>
              <h3>Requirements to Join</h3>
              <ul>
                <li>Born-again Christian with a heart for worship</li>
                <li>Basic instrumental skills (training provided for beginners)</li>
                <li>Commitment to regular practice and services</li>
                <li>Willingness to grow in faith and musical excellence</li>
                <li>Team player attitude and servant's heart</li>
              </ul>
            </div>
            

            <div className={styles.schedule}>
              <h3>Practice Schedule</h3>
              <div className={styles.scheduleGrid}>
                <div className={styles.scheduleItem}>
                  <strong>Weekly Rehearsals</strong>
                  <p>Saturdays: 2:00 PM - 4:00 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Pre-Practice</strong>
                  <p>Thursday: 5:00 PM - 7:00 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Special Events</strong>
                  <p>As scheduled and announced</p>
                </div>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <Link to="/contact-us" className={styles.commitmentButton}>
                Join Wanazambe
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
        <div className={`${styles.testimonialsSection} ${styles.animate}`} ref={testimonialsRef}>
          <h2>What Our Members Say</h2>
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <p>"I am a vessel of influence for God's kingdom courtesy of wanazambe ministry"</p>
              <span>- Tonny, Pianist</span>
            </div>
            <div className={styles.testimonial}>
              <p>"The fellowship and growth in this ministry is incredible. We're not just musicians, we're family."</p>
              <span>- David, Guitarist</span>
            </div>
            <div className={styles.testimonial}>
              <p>"Through Wananzambe, I've learned that worship is not just about music, but about the heart behind it."</p>
              <span>- Grace, Violinist</span>
            </div>
          </div>
        </div>

        
      </div>
      
      <Footer />
    </>
  );
};

export default WanazambePage;