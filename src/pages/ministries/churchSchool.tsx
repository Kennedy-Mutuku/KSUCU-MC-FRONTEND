import React from 'react';
import styles from '../../styles/ministryPage.module.css';
import Header from '../../components/header';
import Footer from '../../components/footer';
import AttendanceForm, { AttendanceSubmission } from '../../components/AttendanceForm';
import { Link } from 'react-router-dom';
import csImg from '../../assets/churchschool.jpg';

const ChurchSchoolPage: React.FC = () => {
  const handleAttendanceSubmit = (submission: AttendanceSubmission) => {
    console.log('Attendance submitted:', submission);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Church School Ministry</h1>
            <p className={styles.subtitle}>Bridging faith and education</p>
          </div>
          <div className={styles.heroImage}>
            <img src={csImg} alt="Church School Ministry" />
          </div>
        </div>

        <AttendanceForm 
          ministry="Church School" 
          onSubmit={handleAttendanceSubmit}
        />

        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h2>About Church School Ministry</h2>
            <p>
              The Church-School Ministry is dedicated to building a bridge between our church and local schools, 
              fostering relationships that reflect God's love and make a lasting impact on students, teachers, 
              and families. This ministry exists to serve, support, and inspire the next generation by meeting 
              practical needs, encouraging spiritual growth, and sharing the hope of Christ.
            </p>
            
            <p>
              Through partnerships with schools, we provide mentorship, tutoring, prayer support, and resources 
              that enhance both academic success and personal development. Whether through after-school programs, 
              teacher appreciation initiatives, or outreach events, our goal is to create an environment where 
              faith, education, and community come together to transform lives.
            </p>
            
            <h3>Our Vision</h3>
            <p>
              To be a beacon of hope and support within our educational community, demonstrating Christ's love 
              through practical service and building relationships that lead to positive change in students' lives.
            </p>
            
            <h3>What We Do</h3>
            <ul className={styles.activitiesList}>
              <li>After-school tutoring and homework assistance</li>
              <li>Mentorship programs for at-risk students</li>
              <li>Teacher appreciation events and support</li>
              <li>School supply drives and resource provision</li>
              <li>Career guidance and life skills workshops</li>
              <li>Prayer support for schools and educators</li>
              <li>Volunteer coordination for school events</li>
              <li>Scholarship programs for deserving students</li>
            </ul>
            
            <h3>Areas of Focus</h3>
            <div className={styles.instrumentsGrid}>
              <div className={styles.instrument}>📚 Academic Support</div>
              <div className={styles.instrument}>🎯 Mentorship</div>
              <div className={styles.instrument}>🎁 Resource Provision</div>
              <div className={styles.instrument}>👥 Community Building</div>
              <div className={styles.instrument}>🙏 Prayer Ministry</div>
              <div className={styles.instrument}>🎆 Life Skills Training</div>
            </div>
          </div>

          <div className={styles.joinSection}>
            <h2>Make a Difference in Education</h2>
            <p>
              Join us as we invest in the lives of students and educators, planting seeds of faith and hope 
              that will bear fruit for years to come. Every student deserves support and encouragement to 
              reach their full potential.
            </p>
            
            <div className={styles.requirements}>
              <h3>How to Get Involved</h3>
              <ul>
                <li>Heart for children and young people's development</li>
                <li>Background check clearance for working with minors</li>
                <li>Basic academic skills or willingness to be trained</li>
                <li>Patience and understanding with diverse learning needs</li>
                <li>Commitment to regular volunteer schedule</li>
                <li>Respect for diverse backgrounds and beliefs</li>
              </ul>
            </div>
            
            <div className={styles.schedule}>
              <h3>Ministry Schedule</h3>
              <div className={styles.scheduleGrid}>
                <div className={styles.scheduleItem}>
                  <strong>Tutoring Sessions</strong>
                  <p>Mon-Thu: 3:30 PM - 5:30 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Mentorship Meetings</strong>
                  <p>Saturdays: 10:00 AM - 12:00 PM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>Planning & Training</strong>
                  <p>Second Saturday: 9:00 AM - 11:00 AM</p>
                </div>
                <div className={styles.scheduleItem}>
                  <strong>School Visits</strong>
                  <p>As arranged with schools</p>
                </div>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <Link to="/worship-coordinator" className={styles.commitmentButton}>
                Join Education Ministry
              </Link>
              <Link to="/worship-coordinator" className={styles.contactButton}>
                Contact Coordinator
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.testimonialsSection}>
          <h2>Transforming Lives Through Education</h2>
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <p>"Seeing a struggling student finally understand a concept and smile with confidence - that's what this ministry is about."</p>
              <span>- Patricia, Tutor</span>
            </div>
            <div className={styles.testimonial}>
              <p>"This ministry has shown me that education is not just about academics, but about building character and hope."</p>
              <span>- David, Mentor</span>
            </div>
            <div className={styles.testimonial}>
              <p>"Through this ministry, I've learned that every child has potential - they just need someone who believes in them."</p>
              <span>- Grace, Volunteer Coordinator</span>
            </div>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.description}>
            <h3>Our Education Philosophy</h3>
            <p>
              "Train up a child in the way he should go, and when he is old he will not depart from it." – Proverbs 22:6
            </p>
            <p>
              We believe that education is a partnership between school, family, church, and community. By working 
              together, we can provide students with the academic support, life skills, and moral foundation they 
              need to succeed not just in school, but in life.
            </p>
            
            <h3>Community Impact</h3>
            <p>
              Our ministry has touched hundreds of lives through tutoring, mentorship, and support programs. 
              We've seen students improve their grades, gain confidence, and develop positive life goals. 
              Teachers and parents consistently report the positive impact our volunteers have on their students.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChurchSchoolPage;