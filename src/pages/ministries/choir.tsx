import React from 'react';
import styles from '../../styles/ministryPage.module.css';
import Header from '../../components/header';
import Footer from '../../components/footer';
import AttendanceForm, { AttendanceSubmission } from '../../components/AttendanceForm';
import { Link } from 'react-router-dom';
import choirImg from '../../assets/choir.jpg';

const ChoirPage: React.FC = () => {
  const handleAttendanceSubmit = (submission: AttendanceSubmission) => {
    console.log('Attendance submitted:', submission);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Choir Ministry</h1>
            <p className={styles.subtitle}>Voices united in harmony to glorify God</p>
          </div>
          <div className={styles.heroImage}>
            <img src={choirImg} alt="Choir Ministry" />
          </div>
        </div>

        <AttendanceForm 
          ministry="Choir" 
          onSubmit={handleAttendanceSubmit}
        />

        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h2>About Our Choir</h2>
            <p>
              The Choir Ministry in KSUCU-MC is a vibrant team of dedicated vocalists committed to leading the 
              congregation in worship through song. With a passion for glorifying God through music, the choir 
              blends voices in harmony to create a powerful and uplifting worship atmosphere.
            </p>
            
            <p>
              Through practice, prayer, and dedication, they minister to the hearts of many, drawing people 
              closer to God with every song they sing. Our choir serves as a vessel for God's love and grace, 
              touching lives through the beauty of unified worship.
            </p>
            
            <h3>Our Mission</h3>
            <p>
              To worship God through the gift of music, creating harmonious melodies that lift spirits, 
              inspire faith, and bring glory to our Heavenly Father. We believe in the transformative 
              power of music to heal, encourage, and unite God's people.
            </p>
            
            <h3>What We Do</h3>
            <ul className={styles.activitiesList}>
              <li>Lead congregational singing during worship services</li>
              <li>Perform special musical presentations and concerts</li>
              <li>Participate in seasonal celebrations and special events</li>
              <li>Support community outreach through musical ministry</li>
              <li>Collaborate with other ministries for combined worship</li>
              <li>Provide music for weddings, funerals, and special ceremonies</li>
            </ul>
            
            <h3>Choir Sections</h3>
            <div className={styles.instrumentsGrid}>
              <div className={styles.instrument}>🎵 Soprano</div>
              <div className={styles.instrument}>🎶 Alto</div>
              <div className={styles.instrument}>🎼 Tenor</div>
              <div className={styles.instrument}>🎹 Bass</div>
              <div className={styles.instrument}>🎤 Lead Vocalists</div>
              <div className={styles.instrument}>🎧 Section Leaders</div>
            </div>
          </div>

          <div className={styles.joinSection}>
            <h2>Join Our Choir Family</h2>
            <p>
              Whether you're an experienced vocalist or someone who simply loves to sing, our choir welcomes 
              all who have a heart for worship and a desire to serve God through music. We provide training 
              and support to help you grow in your musical gifts.
            </p>
            
            <div className={styles.requirements}>
              <h3>Requirements to Join</h3>
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
              <Link to="/choir" className={styles.commitmentButton}>
                Sign Commitment Form
              </Link>
              <Link to="/worship-coordinator" className={styles.contactButton}>
                Contact Coordinator
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.testimonialsSection}>
          <h2>Voices of Joy</h2>
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <p>"The choir has become my second family. We don't just sing together, we grow in faith together."</p>
              <span>- Grace, Alto Section</span>
            </div>
            <div className={styles.testimonial}>
              <p>"Through the choir, I've discovered gifts I never knew I had and confidence I never thought possible."</p>
              <span>- Michael, Tenor Section</span>
            </div>
            <div className={styles.testimonial}>
              <p>"Every rehearsal is a mini worship service. We're blessed even before we bless others."</p>
              <span>- Sarah, Soprano Section</span>
            </div>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h3>Our Choir Philosophy</h3>
            <p>
              "Sing to the Lord a new song; sing to the Lord, all the earth. Sing to the Lord, praise his name; 
              proclaim his salvation day after day." – Psalm 96:1-2
            </p>
            <p>
              We believe that when voices unite in worship, something beautiful happens – hearts are lifted, 
              spirits are encouraged, and God is glorified. Our choir is more than a musical group; we're a 
              community of believers who have found joy in serving God together through song.
            </p>
            
            <h3>Training and Development</h3>
            <p>
              We provide ongoing vocal training, music theory education, and performance coaching to help 
              every member reach their full potential. Our experienced leaders and guest instructors ensure 
              that each member grows both musically and spiritually.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChoirPage;