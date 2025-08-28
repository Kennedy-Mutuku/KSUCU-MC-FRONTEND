import React from 'react';
import styles from '../../styles/ministryPage.module.css';
import Header from '../../components/header';
import Footer from '../../components/footer';
import AttendanceSignin from '../../components/AttendanceSignin';
import { Link } from 'react-router-dom';
import pwImg from '../../assets/praise-and-worship.jpg';

const PraiseAndWorshipPage: React.FC = () => {

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Praise and Worship Ministry</h1>
            <p className={styles.subtitle}>Leading hearts into God's presence through worship</p>
          </div>
          <div className={styles.heroImage}>
            <img src={pwImg} alt="Praise and Worship Ministry" />
          </div>
        </div>

        <AttendanceSignin ministry="Praise and Worship" />

        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h2>About Praise and Worship</h2>
            <p>
              The Praise and Worship Ministry exists to lead our congregation into the presence of God through heartfelt worship, 
              uplifting music, and a lifestyle of praise. We are passionate about glorifying God and creating an atmosphere 
              where people can encounter Him, experience His love, and respond in worship.
            </p>
            
            <p>
              Our ministry is committed to excellence in musicianship, unity in spirit, and authenticity in worship. Whether 
              through singing, playing instruments, or leading in prayer, our team's mission is to magnify God and inspire 
              others to do the same.
            </p>
            
            <h3>Our Vision</h3>
            <p>
              To create transformative worship experiences that draw people closer to God, encouraging every heart to 
              worship in spirit and truth. We believe worship is not just about music, but about the condition of our 
              hearts before God.
            </p>
            
            <h3>What We Do</h3>
            <ul className={styles.activitiesList}>
              <li>Lead corporate worship during Sunday services</li>
              <li>Facilitate prayer and worship nights</li>
              <li>Organize special worship concerts and events</li>
              <li>Mentor upcoming worship leaders and musicians</li>
              <li>Participate in community outreach through worship</li>
              <li>Lead worship during retreats and conferences</li>
            </ul>
            
            <h3>Worship Elements</h3>
            <div className={styles.instrumentsGrid}>
              <div className={styles.instrument}>🎤 Lead Vocals</div>
              <div className={styles.instrument}>🎵 Harmony Vocals</div>
              <div className={styles.instrument}>🎸 Acoustic Guitar</div>
              <div className={styles.instrument}>🎹 Keyboard</div>
              <div className={styles.instrument}>🥁 Percussion</div>
              <div className={styles.instrument}>🙏 Prayer Leadership</div>
            </div>
          </div>

          <div className={styles.joinSection}>
            <h2>Join Our Worship Team</h2>
            <p>
              If you have a heart for worship and a desire to use your gifts for God's glory, we invite you to join us. 
              Together, we'll lift up the name of Jesus and create moments that touch heaven and change lives.
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
                  <p>Saturdays: 3:00 PM - 5:00 PM</p>
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
              <Link to="/p&w" className={styles.commitmentButton}>
                Sign Commitment Form
              </Link>
              <Link to="/worship-coordinator" className={styles.contactButton}>
                Contact Coordinator
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.testimonialsSection}>
          <h2>Hearts Transformed Through Worship</h2>
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <p>"Being part of this ministry has taught me that worship is a lifestyle, not just a Sunday activity."</p>
              <span>- Mary, Worship Leader</span>
            </div>
            <div className={styles.testimonial}>
              <p>"Through this team, I've grown not just as a musician, but as a worshipper who seeks God's heart."</p>
              <span>- Peter, Guitarist</span>
            </div>
            <div className={styles.testimonial}>
              <p>"The unity and love in this ministry reflects God's heart for His people. It's truly a family."</p>
              <span>- Ruth, Vocalist</span>
            </div>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h3>Our Worship Philosophy</h3>
            <p>
              "Let everything that has breath praise the Lord. Praise the Lord!" – Psalm 150:6
            </p>
            <p>
              We believe that worship is both a privilege and a responsibility. It's our response to who God is and what 
              He has done for us. Our goal is not just to perform music, but to create an environment where every person 
              can encounter the living God and respond with their whole heart.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PraiseAndWorshipPage;