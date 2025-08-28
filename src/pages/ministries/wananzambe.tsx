import React from 'react';
import styles from '../../styles/ministryPage.module.css';
import Header from '../../components/header';
import Footer from '../../components/footer';
import AttendanceSignin from '../../components/AttendanceSignin';
import { Link } from 'react-router-dom';
import wananzambeImg from '../../assets/wananzambe.jpg';

const WananzambePage: React.FC = () => {

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Wananzambe Ministry</h1>
            <p className={styles.subtitle}>Instrumentalists dedicated to worship excellence</p>
          </div>
          <div className={styles.heroImage}>
            <img src={wananzambeImg} alt="Wananzambe Ministry" />
          </div>
        </div>

        <AttendanceSignin ministry="Wananzambe" />

        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h2>About Wananzambe</h2>
            <p>
              Wananzambe is the instrumentalists' ministry in KSUCU-MC, dedicated to enhancing worship through music. 
              This ministry consists of skilled musicians who play various instruments to create a powerful and uplifting 
              worship experience. With a passion for excellence and a heart for service, Wananzambe plays a vital role 
              in leading the congregation into deep and meaningful worship.
            </p>
            
            <h3>Our Mission</h3>
            <p>
              To glorify God through instrumental worship, creating an atmosphere where hearts are lifted and 
              souls are touched by His presence. We strive to support the worship experience through skillful 
              musicianship and devoted hearts.
            </p>
            
            <h3>What We Do</h3>
            <ul className={styles.activitiesList}>
              <li>Lead instrumental worship during church services</li>
              <li>Support choir and praise & worship team performances</li>
              <li>Participate in special events and concerts</li>
              <li>Conduct music workshops and mentorship programs</li>
              <li>Organize community outreach through music</li>
            </ul>
            
            <h3>Instruments We Play</h3>
            <div className={styles.instrumentsGrid}>
              <div className={styles.instrument}>🎸 Guitar</div>
              <div className={styles.instrument}>🎹 Keyboard/Piano</div>
              <div className={styles.instrument}>🥁 Drums</div>
              <div className={styles.instrument}>🎺 Brass Instruments</div>
              <div className={styles.instrument}>🎻 Strings</div>
              <div className={styles.instrument}>🎷 Woodwinds</div>
            </div>
          </div>

          <div className={styles.joinSection}>
            <h2>Join Wananzambe</h2>
            <p>
              Do you have a heart for worship and musical talents to share? We welcome musicians of all 
              skill levels who are passionate about serving God through instrumental worship.
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
                  <strong>Pre-Service Practice</strong>
                  <p>Sundays: 7:30 AM - 8:30 AM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Special Events</strong>
                  <p>As scheduled and announced</p>
                </div>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <Link to="/wananzambe" className={styles.commitmentButton}>
                Sign Commitment Form
              </Link>
              <Link to="/worship-coordinator" className={styles.contactButton}>
                Contact Coordinator
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.testimonialsSection}>
          <h2>What Our Members Say</h2>
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <p>"Being part of Wananzambe has deepened my relationship with God and improved my musical skills tremendously."</p>
              <span>- Sarah, Pianist</span>
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

export default WananzambePage;