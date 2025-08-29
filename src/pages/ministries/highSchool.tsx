import React from 'react';
import styles from '../../styles/ministryPage.module.css';
import UniversalHeader from '../../components/UniversalHeader';
import Footer from '../../components/footer';
import { Link } from 'react-router-dom';
import hsImg from '../../assets/high-school.jpg';

const HighSchoolPage: React.FC = () => {

  return (
    <>
      <UniversalHeader />
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>High School Ministry</h1>
            <p className={styles.subtitle}>Empowering youth to live boldly for Christ</p>
          </div>
          <div className={styles.heroImage}>
            <img src={hsImg} alt="High School Ministry" />
          </div>
        </div>


        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h2>About High School Ministry</h2>
            <p>
              The High School Ministry is a vibrant community where students can grow in their faith, build lasting 
              friendships, and discover their purpose in Christ. We are passionate about equipping the next generation 
              to navigate the challenges of high school with confidence, grounded in God's Word and His love.
            </p>
            
            <p>
              Through engaging worship, relevant teaching, small group discussions, and fun activities, we create 
              an environment where students feel welcomed, valued, and empowered. Our goal is to inspire a deeper 
              relationship with Jesus, foster authentic connections, and encourage students to live out their faith 
              boldly in their schools, homes, and communities.
            </p>
            
            <h3>Our Mission</h3>
            <p>
              To raise up a generation of young leaders who are passionate about Jesus, equipped with His Word, 
              and committed to making a positive impact in their world.
            </p>
            
            <h3>What We Offer</h3>
            <ul className={styles.activitiesList}>
              <li>Weekly youth gatherings with worship and teaching</li>
              <li>Small group Bible studies and discipleship</li>
              <li>Peer mentoring and leadership development</li>
              <li>Community service projects and missions</li>
              <li>Retreats, camps, and special events</li>
              <li>Academic support and college preparation</li>
              <li>Crisis counseling and pastoral care</li>
              <li>Sports tournaments and recreational activities</li>
            </ul>
            
            <h3>Growth Areas</h3>
            <div className={styles.instrumentsGrid}>
              <div className={styles.instrument}>❤️ Spiritual Growth</div>
              <div className={styles.instrument}>💪 Leadership Skills</div>
              <div className={styles.instrument}>🎆 Life Purpose</div>
              <div className={styles.instrument}>🤝 Relationships</div>
              <div className={styles.instrument}>🎯 Academic Excellence</div>
              <div className={styles.instrument}>🌍 Global Awareness</div>
            </div>
          </div>

          <div className={styles.joinSection}>
            <h2>Join Our Youth Community</h2>
            <p>
              Whether you're new to church or have been attending for years, there's a place for you here. 
              Join us as we grow together, serve others, and make a difference for God's Kingdom.
            </p>
            
            <div className={styles.requirements}>
              <h3>What to Expect</h3>
              <ul>
                <li>Welcoming environment for all backgrounds and beliefs</li>
                <li>Age-appropriate activities and discussions</li>
                <li>Opportunities for personal spiritual growth</li>
                <li>Safe space to ask questions and explore faith</li>
                <li>Fun activities and lasting friendships</li>
                <li>Leadership and service opportunities</li>
              </ul>
            </div>
            
            <div className={styles.schedule}>
              <h3>Weekly Schedule</h3>
              <div className={styles.scheduleGrid}>
                <div className={styles.scheduleItem}>
                  <strong>Youth Service</strong>
                  <p>Fridays: 6:00 PM - 8:00 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Small Groups</strong>
                  <p>Wednesdays: 4:00 PM - 5:30 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Leadership Team</strong>
                  <p>Saturdays: 10:00 AM - 12:00 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Special Events</strong>
                  <p>Monthly activities and trips</p>
                </div>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <Link to="/worship-coordinator" className={styles.commitmentButton}>
                Join Youth Ministry
              </Link>
              <Link to="/worship-coordinator" className={styles.contactButton}>
                Contact Youth Pastor
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.testimonialsSection}>
          <h2>Student Voices</h2>
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <p>"This ministry has given me the confidence to share my faith at school and be a light for Jesus."</p>
              <span>- Alex, Grade 11</span>
            </div>
            <div className={styles.testimonial}>
              <p>"I've found my best friends here and learned what it really means to follow Jesus in everyday life."</p>
              <span>- Mercy, Grade 12</span>
            </div>
            <div className={styles.testimonial}>
              <p>"The leaders here genuinely care about us and help us through the ups and downs of teenage life."</p>
              <span>- Kevin, Grade 10</span>
            </div>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h3>Our Youth Philosophy</h3>
            <p>
              "Don't let anyone look down on you because you are young, but set an example for the believers 
              in speech, in conduct, in love, in faith, and in purity." – 1 Timothy 4:12
            </p>
            <p>
              We believe that young people are not just the church of tomorrow - they are the church of today. 
              God has a plan and purpose for every teenager, and our role is to help them discover their identity 
              in Christ and equip them to fulfill their calling.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HighSchoolPage;