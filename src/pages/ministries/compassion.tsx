import React from 'react';
import styles from '../../styles/ministryPage.module.css';
import UniversalHeader from '../../components/UniversalHeader';
import Footer from '../../components/footer';
import { Link } from 'react-router-dom';
import compassionImg from '../../assets/compassion.jpg';

const CompassionPage: React.FC = () => {

  return (
    <>
      <UniversalHeader />
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Compassion Ministry</h1>
            <p className={styles.subtitle}>Being the hands and feet of Jesus to those in need</p>
          </div>
          <div className={styles.heroImage}>
            <img src={compassionImg} alt="Compassion Ministry" />
          </div>
        </div>


        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h2>About Compassion Ministry</h2>
            <p>
              The Compassion Ministry is dedicated to being the hands and feet of Jesus, reaching out to those in 
              need with love, care, and practical support. Rooted in God's call to serve others, we strive to meet 
              the physical, emotional, and spiritual needs of individuals and families in our church and community.
            </p>
            
            <p>
              Our mission is to bring hope to the hurting, comfort to the brokenhearted, and help to those facing 
              life's challenges. Whether through food assistance, clothing drives, hospital visits, crisis care, 
              or prayer, we are committed to demonstrating the love of Christ in tangible ways.
            </p>
            
            <h3>Our Vision</h3>
            <p>
              To create a community where no one walks alone in their time of need, where God's love is expressed 
              through practical acts of compassion, and where every person experiences the hope and healing that 
              comes from Christ's love.
            </p>
            
            <h3>What We Do</h3>
            <ul className={styles.activitiesList}>
              <li>Emergency food assistance and food bank operations</li>
              <li>Clothing drives and distribution to those in need</li>
              <li>Hospital and home visits for the sick and elderly</li>
              <li>Crisis intervention and emergency financial assistance</li>
              <li>Community outreach programs and events</li>
              <li>Prayer support and spiritual encouragement</li>
              <li>Bereavement support and grief counseling</li>
              <li>Youth mentorship and family support programs</li>
            </ul>
            
            <h3>Areas of Service</h3>
            <div className={styles.instrumentsGrid}>
              <div className={styles.instrument}>🍞 Food Ministry</div>
              <div className={styles.instrument}>👕 Clothing Assistance</div>
              <div className={styles.instrument}>🏥 Healthcare Support</div>
              <div className={styles.instrument}>💝 Crisis Care</div>
              <div className={styles.instrument}>🙏 Prayer Ministry</div>
              <div className={styles.instrument}>👥 Community Outreach</div>
            </div>
          </div>

          <div className={styles.joinSection}>
            <h2>Join Our Mission of Love</h2>
            <p>
              If you feel called to make a difference, join us in this transformative ministry as we work together 
              to reflect God's compassion and bring His light into the lives of others. Every act of kindness, 
              no matter how small, has the power to change lives.
            </p>
            
            <div className={styles.requirements}>
              <h3>How to Get Involved</h3>
              <ul>
                <li>Heart for serving others and showing Christ's love</li>
                <li>Willingness to volunteer time for various outreach activities</li>
                <li>Compassionate spirit and listening ear for those in need</li>
                <li>Commitment to maintaining confidentiality and dignity</li>
                <li>Desire to grow in understanding of social justice issues</li>
                <li>Availability for both planned events and emergency responses</li>
              </ul>
            </div>
            
            <div className={styles.schedule}>
              <h3>Ministry Schedule</h3>
              <div className={styles.scheduleGrid}>
                <div className={styles.scheduleItem}>
                  <strong>Planning Meeting</strong>
                  <p>First Saturday: 10:00 AM - 12:00 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Food Distribution</strong>
                  <p>Every Saturday: 9:00 AM - 12:00 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Hospital Visits</strong>
                  <p>Wednesdays & Sundays: 2:00 PM - 5:00 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Emergency Response</strong>
                  <p>24/7 on-call rotation system</p>
                </div>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <Link to="/worship-coordinator" className={styles.commitmentButton}>
                Join Compassion Team
              </Link>
              <Link to="/worship-coordinator" className={styles.contactButton}>
                Contact Coordinator
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.testimonialsSection}>
          <h2>Lives Touched by Compassion</h2>
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <p>"Through this ministry, I've learned that serving others is not just about giving, but about receiving God's love in return."</p>
              <span>- Martha, Volunteer Coordinator</span>
            </div>
            <div className={styles.testimonial}>
              <p>"Being part of Compassion Ministry has opened my eyes to the needs around us and the joy of making a difference."</p>
              <span>- James, Food Bank Volunteer</span>
            </div>
            <div className={styles.testimonial}>
              <p>"Every person we help teaches us something about God's heart for the vulnerable and marginalized."</p>
              <span>- Ruth, Hospital Visitor</span>
            </div>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h3>Our Compassion Philosophy</h3>
            <p>
              "Carry each other's burdens, and in this way you will fulfill the law of Christ." – Galatians 6:2
            </p>
            <p>
              We believe that compassion is not just an emotion, but an action. It's seeing a need and being moved 
              to respond. Our ministry is built on the understanding that when we serve others, we serve Christ 
              Himself, and in blessing others, we ourselves are blessed.
            </p>
            
            <h3>Impact and Outreach</h3>
            <p>
              Through partnerships with local organizations, schools, and community leaders, we extend our reach 
              to serve more families and individuals. Our goal is not just to provide temporary relief, but to 
              offer hope and resources that lead to lasting positive change in people's lives.
            </p>
            
            <h3>How You Can Help</h3>
            <p>
              Beyond joining our ministry team, there are many ways to support our work: donate non-perishable 
              food items, contribute gently used clothing, provide financial support for emergency assistance, 
              or simply pray for our ministry and those we serve.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompassionPage;