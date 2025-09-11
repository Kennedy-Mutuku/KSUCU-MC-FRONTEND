import React from 'react';
import styles from '../../styles/ministryPage.module.css';
import UniversalHeader from '../../components/UniversalHeader';
import Footer from '../../components/footer';
import { Link } from 'react-router-dom';
import creativityImg from '../../assets/praise-and-worship.jpg'; // Using available image

const CreativityPage: React.FC = () => {

  return (
    <>
      <UniversalHeader />
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Creativity Ministry</h1>
            <p className={styles.subtitle}>Expressing God's creativity through art and media</p>
          </div>
          <div className={styles.heroImage}>
            <img src={creativityImg} alt="Creativity Ministry" />
          </div>
        </div>


        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h2>About Creativity Ministry</h2>
            <p>
              The Creativity Ministry is a vibrant community of individuals passionate about using their 
              God-given talents to glorify Him and inspire others. Whether through visual arts, design, 
              writing, drama, dance, media, or other creative expressions, our mission is to bring the 
              message of Christ to life in unique and impactful ways.
            </p>
            
            <p>
              We believe creativity is a reflection of the Creator and a powerful tool to communicate truth, 
              evoke emotion, and build connections. From creating engaging visuals for worship, producing 
              powerful performances, or crafting inspiring content, we strive to use our gifts to draw 
              people closer to God.
            </p>
            
            <h3>Our Vision</h3>
            <p>
              To be a creative force that transforms hearts and minds through art, inspiring people to 
              see God's beauty and truth in fresh, innovative ways that speak to every generation.
            </p>
            
            <h3>What We Create</h3>
            <ul className={styles.activitiesList}>
              <li>Visual graphics and designs for church communications</li>
              <li>Video production for sermons and special events</li>
              <li>Photography for church activities and ministries</li>
              <li>Drama and theatrical performances</li>
              <li>Dance choreography and movement worship</li>
              <li>Creative writing and storytelling</li>
              <li>Digital media and social content</li>
              <li>Art installations and decorative displays</li>
            </ul>
            
            <h3>Creative Disciplines</h3>
            <div className={styles.instrumentsGrid}>
              <div className={styles.instrument}>🎨 Visual Arts</div>
              <div className={styles.instrument}>📹 Video Production</div>
              <div className={styles.instrument}>📷 Photography</div>
              <div className={styles.instrument}>🎭 Drama & Theater</div>
              <div className={styles.instrument}>💃 Dance & Movement</div>
              <div className={styles.instrument}>✍️ Creative Writing</div>
            </div>
          </div>

          <div className={styles.joinSection}>
            <h2>Unleash Your Creative Gifts</h2>
            <p>
              If you have a creative spark and a desire to serve, we invite you to join us in transforming 
              ideas into expressions of worship and outreach that make a difference in the church and beyond.
            </p>
            
            <div className={styles.requirements}>
              <h3>How to Get Involved</h3>
              <ul>
                <li>Passion for creative expression and artistic excellence</li>
                <li>Heart for worship and desire to serve God</li>
                <li>Skills in one or more creative disciplines (all levels welcome)</li>
                <li>Commitment to collaborative teamwork</li>
                <li>Willingness to learn new techniques and technologies</li>
                <li>Availability for project deadlines and events</li>
              </ul>
            </div>
            
            <div className={styles.schedule}>
              <h3>Creative Schedule</h3>
              <div className={styles.scheduleGrid}>
                <div className={styles.scheduleItem}>
                  <strong>Team Meetings</strong>
                  <p>Saturdays: 2:00 PM - 4:00 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Project Work</strong>
                  <p>Flexible based on deadlines</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Skills Workshops</strong>
                  <p>Monthly: Various times</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Creative Sessions</strong>
                  <p>As needed for special events</p>
                </div>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <Link to="/contact-us" className={styles.commitmentButton}>
                Join Creative Team
              </Link>
              <Link to="/contact-us" className={styles.contactButton}>
                Submit Creative Ideas
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.testimonialsSection}>
          <h2>Creative Testimonies</h2>
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <p>"This ministry has given me a platform to use my artistic gifts for God's glory while growing creatively."</p>
              <span>- Rachel, Graphic Designer</span>
            </div>
            <div className={styles.testimonial}>
              <p>"Through creative ministry, I've learned that art can be a form of worship and evangelism at the same time."</p>
              <span>- Mark, Video Producer</span>
            </div>
            <div className={styles.testimonial}>
              <p>"Being part of this team has pushed me to excellence while keeping Christ at the center of my creativity."</p>
              <span>- Lisa, Photographer</span>
            </div>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h3>Our Creative Philosophy</h3>
            <p>
              "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters." 
              – Colossians 3:23
            </p>
            <p>
              We believe that God is the ultimate Creator, and we are made in His image with the ability to create. 
              Every piece of art, every video, every design is an opportunity to reflect His creativity and share 
              His love with the world. Our work is not just creative expression - it's worship in action.
            </p>
            
            <h3>Creative Excellence</h3>
            <p>
              We pursue excellence in all our creative endeavors, not for personal glory, but to honor God with 
              the best of our abilities. We stay current with trends and technologies while maintaining timeless 
              biblical truths in our messaging.
            </p>
            
            <h3>Community Impact</h3>
            <p>
              Our creative works extend beyond church walls to impact the broader community through social media, 
              community events, and collaborative projects that demonstrate God's love and creativity to the world.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreativityPage;