import React from 'react';
import styles from '../../styles/ministryPage.module.css';
import UniversalHeader from '../../components/UniversalHeader';
import Footer from '../../components/footer';
import { Link } from 'react-router-dom';
import usheringImg from '../../assets/ushering.jpg';

const UsheringPage: React.FC = () => {

  return (
    <>
      <UniversalHeader />
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Ushering Ministry</h1>
            <p className={styles.subtitle}>The welcoming heart of our church</p>
          </div>
          <div className={styles.heroImage}>
            <img src={usheringImg} alt="Ushering Ministry" />
          </div>
        </div>


        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h2>About Ushering Ministry</h2>
            <p>
              The Ushering Ministry is the welcoming heart of our church, committed to creating a warm and 
              inviting atmosphere where everyone feels valued and at home. Our ushers serve as the hands 
              and feet of Christ, greeting each person with kindness, guiding them with care, and ensuring 
              that every service runs smoothly and orderly.
            </p>
            
            <p>
              From welcoming guests at the door to assisting with seating, offering directions, and 
              facilitating worship elements, the Ushering Ministry plays a vital role in enhancing the 
              worship experience. Our team is dedicated to embodying hospitality, joy, and excellence, 
              reflecting God's love in every interaction.
            </p>
            
            <h3>Our Mission</h3>
            <p>
              To create an atmosphere of warmth, welcome, and worship excellence that allows every person 
              who enters our church to feel the love of God and experience His presence.
            </p>
            
            <h3>What We Do</h3>
            <ul className={styles.activitiesList}>
              <li>Welcome and greet congregation members and visitors</li>
              <li>Assist with seating and provide service information</li>
              <li>Distribute bulletins, programs, and other materials</li>
              <li>Manage offering collection during services</li>
              <li>Maintain order and assist with crowd control</li>
              <li>Provide directions and answer questions</li>
              <li>Assist elderly, disabled, and families with children</li>
              <li>Coordinate with other ministries during services</li>
            </ul>
            
            <h3>Service Areas</h3>
            <div className={styles.instrumentsGrid}>
              <div className={styles.instrument}>Greeting Team</div>
              <div className={styles.instrument}>Seating Assistance</div>
              <div className={styles.instrument}>Information Desk</div>
              <div className={styles.instrument}>Offering Team</div>
              <div className={styles.instrument}>Program Distribution</div>
              <div className={styles.instrument}>Special Needs</div>
            </div>
          </div>

          <div className={styles.joinSection}>
            <h2>Join Our Hospitality Team</h2>
            <p>
              If you have a heart for service and a friendly smile, we invite you to join us in making 
              every worship experience meaningful and memorable. Together, we can help create an environment 
              where God's presence is felt and His people are blessed.
            </p>
            
            <div className={styles.requirements}>
              <h3>Qualities We Value</h3>
              <ul>
                <li>Warm, friendly personality and genuine smile</li>
                <li>Heart for hospitality and serving others</li>
                <li>Punctuality and reliability for scheduled services</li>
                <li>Professional appearance and positive attitude</li>
                <li>Ability to remain calm under pressure</li>
                <li>Good communication and interpersonal skills</li>
              </ul>
            </div>
            
            <div className={styles.schedule}>
              <h3>Service Schedule</h3>
              <div className={styles.scheduleGrid}>
                <div className={styles.scheduleItem}>
                  <strong>First Service</strong>
                  <p>Sundays: 7:30 AM - 10:00 AM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Second Service</strong>
                  <p>Sundays: 10:30 AM - 1:00 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Special Events</strong>
                  <p>As scheduled for conferences</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Training Sessions</strong>
                  <p>Quarterly: Saturdays 10:00 AM</p>
                </div>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <Link to="/worship-coordinator" className={styles.commitmentButton}>
                Join Ushering Team
              </Link>
              <Link to="/worship-coordinator" className={styles.contactButton}>
                Contact Head Usher
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.testimonialsSection}>
          <h2>Hearts of Service</h2>
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <p>"Being an usher has taught me that the smallest acts of kindness can have the biggest impact on someone's day."</p>
              <span>- John, Head Usher</span>
            </div>
            <div className={styles.testimonial}>
              <p>"I love seeing first-time visitors feel welcomed and comfortable. It's a privilege to be their first impression of our church."</p>
              <span>- Susan, Greeting Team</span>
            </div>
            <div className={styles.testimonial}>
              <p>"This ministry has shown me that serving others is not just a duty, but a joy and a way to worship God."</p>
              <span>- Peter, Offering Team</span>
            </div>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h3>Our Service Philosophy</h3>
            <p>
              "Better is one day in your courts than a thousand elsewhere; I would rather be a doorkeeper 
              in the house of my God." – Psalm 84:10
            </p>
            <p>
              We believe that serving as an usher is a sacred privilege. Every person who walks through 
              our doors carries hopes, fears, and needs. Our role is to be Jesus with skin on - to offer 
              the warmth, care, and welcome that reflects God's heart for His people.
            </p>
            
            <h3>Training and Development</h3>
            <p>
              We provide comprehensive training covering hospitality excellence, crowd management, emergency 
              procedures, and conflict resolution. Regular workshops help our team stay updated on best 
              practices and continue growing in their service skills.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default UsheringPage;