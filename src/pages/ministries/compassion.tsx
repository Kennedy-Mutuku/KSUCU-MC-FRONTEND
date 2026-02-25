<<<<<<< HEAD
import React from 'react';
=======
import React, { useEffect, useRef } from 'react';
import styles from '../../styles/ministryPage.module.css';
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
import { Link } from 'react-router-dom';
import compassionImg from '../../assets/compassion.jpg';
import MinistryLayout from '../../components/MinistryLayout';
import styles from '../../styles/ministryPage.module.css';
import { Heart, HandHelping, GraduationCap, Users, Clock, Church } from 'lucide-react';

const CompassionPage: React.FC = () => {
  return (
<<<<<<< HEAD
    <MinistryLayout
      title="Compassion and Counselling Ministry"
      subtitle="Speak out, Get reached, We care."
      heroImage={compassionImg}
      ministryName="Compassion and Counselling Ministry"
      heroActions={
        <div className={styles.heroActionButtons}>
          <Link to="/compassion-counseling" className={styles.commitmentButton}>
            Give support to the ministry
          </Link>
        </div>
      }
      aboutText={
        <>
          <p>
            The Compassion and Counseling Ministry is dedicated to being the hands and feet of Jesus, reaching out to those in need with love, care, and practical support. Rooted in God's call to serve others, we strive to meet the physical, emotional, and spiritual needs of individuals and families in our church and community.
          </p>
          <p>
            Our mission is to bring hope to the hurting, comfort to the brokenhearted, and help to those facing life's challenges. Whether through food assistance, clothing drives, hospital visits, crisis care, or prayer, we are committed to demonstrating the love of Christ in tangible ways.
          </p>
        </>
      }
      missionText={
        <>
          <p>
            To serve others with empathy, care, and spiritual guidance guided by the example of Jesus Christ as the Ultimate model of compassion.
          </p>
          <p>
            Speak out, Get reached, We care.
          </p>
        </>
      }
      joinText={
        <p>
          From 1 Peter 3:8 we are reminded that we should be compassionate, love one another and be humble. Therefore I would like to welcome you all to the ministry which will nurture you. It's a family where we grow, bond, help and share our joys and hardships. Welcome all!
        </p>
      }
      requirements={[
        "A member of Christian Union",
        "Should be willing to join the ministry",
        "Commitment",
        "Confidence",
        "Should be familiar with the scriptures",
        "Participate in CU activities"
      ]}
      whatWeDoHeader="Here’s how our Compassion and Counselling team serves our congregation and the entire Kisii University community."
      whatWeDoCards={[
        { icon: <Users size={32} className="text-[#730051]" />, title: "Church Community", description: "It serves the CU by providing help to the members of the CU that reach out when in need." },
        { icon: <Heart size={32} className="text-[#730051]" />, title: "Members", description: "It nurtures its members to become compassionate members in this self centered generation." },
        { icon: <GraduationCap size={32} className="text-[#730051]" />, title: "Training", description: "The ministry conducts detailed trainings on counseling and compassion to its members." },
        { icon: <HandHelping size={32} className="text-[#730051]" />, title: "Bonding", description: "The ministry has bonding sessions for its members." }
      ]}
      ourRole="We ensure everyone feels heard, supported, and cared for."
      ensureList={[
        "Warm welcoming atmosphere for members",
        "Welcome of guest speakers",
        "Organized seating",
        "Visitor assistance"
      ]}
      scheduleCards={[
        { icon: <Clock size={40} className="text-[#730051]" />, title: "Ministry meeting", time: "Tuesday: 6:50 PM - 8:00 PM" },
        { icon: <Church size={40} className="text-[#730051]" />, title: "Ministry Prayers", time: "Saturday: 6:30 PM - 7:30 PM" }
      ]}
      philosophyText={
        <>
          <p>
            The core philosophy of this Ministry is rooted in Christ’s love and the call to serve others with empathy, care, and spiritual guidance. This ministry's philosophy is guided by the example of Jesus Christ as the Ultimate model of compassion.
          </p>
          <p>
            They guide our activities by actively looking for those who need help, giving them a safe place to talk, and continuing to support them.
          </p>
        </>
      }
      communityImpactText={
        <p>
          Through partnerships with local organizations, schools, and community leaders, we extend our reach to serve more families and individuals. Our goal is not just to provide temporary relief, but to offer hope and resources that lead to lasting positive change.
        </p>
      }
      testimonials={[
        { quote: "Through this ministry, I've learned that serving others is not just about giving, but about receiving God's love in return.", author: "Martha, Volunteer Coordinator" },
        { quote: "Being part of Compassion and Counseling Ministry has opened my eyes to the needs around us and the joy of making a difference.", author: "James, Food Bank Volunteer" },
        { quote: "This ministry has shown me that small acts of kindness can change lives.", author: "Kevin, Volunteer" }
      ]}
      ministryId="compassion"
      testimonialTitle="Lives Touched by Compassion"
    />
=======
    <>
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${compassionImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Compassion and Counseling Ministry</h1>
          <p className={styles.subtitle}>Being the hands and feet of Jesus to those in need</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.actionButtons}>
              <Link to="/compassion-counseling" className={styles.commitmentButton}>
                Give support to the ministry
              </Link>
        </div>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.description}>
            <h2>About Compassion and Counseling Ministry</h2>
            The Compassion and Counseling Ministry is dedicated to being the hands and feet of Jesus, reaching out to those in need with love, care, and practical support. Rooted in God's call to serve others, we strive to meet the physical, emotional, and spiritual needs of individuals and families in our church and community<p>
              
            </p>
            
            <p>
              Our mission is to bring hope to the hurting, comfort to the brokenhearted, and help to those facing life's challenges. Whether through food assistance, clothing drives, hospital visits, crisis care, or prayer, we are committed to demonstrating the love of Christ in tangible ways.
            </p>
            
            <h3>Our Vision</h3>
            <p>
              To create a community where no one walks alone in their time of need, where God's love is expressed through practical acts of compassion, and where every person experiences the hope and healing that comes from Christ's love.
            </p>
            
            <h3>What We Do</h3>
            <ul className={styles.activitiesList}>
              <li data-number="01">Emergency food assistance and food bank operations</li>
              <li data-number="02">Clothing drives and distribution to those in need</li>
              <li data-number="03">Hospital and home visits for the sick and elderly</li>
              <li data-number="04">Crisis intervention and emergency financial assistance</li>
              <li data-number="05">Community outreach programs and events</li>
              <li data-number="06">Prayer support and spiritual encouragement</li>
              <li data-number="06">Bereavement support and grief counseling</li>
              <li data-number="06">Youth mentorship and family support programs</li>
            </ul>
            
          </div>

          <div className={styles.joinSection}>
            <h2>Join Our Mission of Love</h2>
            <p>
             If you feel called to make a difference, join us in this transformative ministry as we work together to reflect God's compassion and bring His light into the lives of others. Every act of kindness, no matter how small, has the power to change lives
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
              <Link to="/contact-us" className={styles.commitmentButton}>
                Join Church School
              </Link>
              <Link to="/contact-us" className={styles.contactButton}>
                Contact Overseer
              </Link>
            </div>
          </div>
        </div>

<div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1} >
          <div className={styles.description}>
            <h3>Our Compassion Philosophy</h3>
            <p>
              "Carry each other's burdens, and in this way you will fulfill the law of Christ." Galatians 6:2
            </p>
            <p>
             We believe that compassion is not just an emotion, but an action. It's seeing a need and being moved to respond. Our ministry is built on the understanding that when we serve others, we serve Christ Himself, and in blessing others, we ourselves are blessed
            </p>
            
            <h3>Impact and Outreach</h3>
            <p>
              Through partnerships with local organizations, schools, and community leaders, we extend our reach to serve more families and individuals. Our goal is not just to provide temporary relief, but to offer hope and resources that lead to lasting positive change in people's lives.
            </p>
            <h3>How You Can Help</h3>
            <p>
              Beyond joining our ministry team, there are many ways to support our work: donate non-perishable food items, contribute gently used clothing, provide financial support for emergency assistance, or simply pray for our ministry and those we serve.
            </p>
          </div>
        </div>

        
      </div>
      
    </>
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
  );
};

export default CompassionPage;
