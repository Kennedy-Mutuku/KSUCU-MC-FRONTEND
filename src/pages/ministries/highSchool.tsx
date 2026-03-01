<<<<<<< HEAD
import React from 'react';
import highSchoolImg from '../../assets/high-school.jpg';
import MinistryLayout from '../../components/MinistryLayout';
import { MessageCircle, UserPlus, Megaphone, BookOpen, Clock, Heart } from 'lucide-react';

const HighSchoolPage: React.FC = () => {
  return (
    <MinistryLayout
      title="High School Ministry"
      subtitle="Declare his glory among the nations, his marvelous deeds among all peoples."
      heroImage={highSchoolImg}
      ministryName="High School Ministry"
      aboutText={
        <>
          <p>
            The High School Ministry is a vibrant community where students can grow in their faith, build lasting friendships, and discover their purpose in Christ. We are passionate about equipping the next generation to navigate the challenges of high school with confidence, grounded in God's Word and His love.
          </p>
          <p>
            Through engaging worship, relevant teaching, small group discussions, and fun activities, we create an environment where students feel welcomed, valued, and empowered.
          </p>
        </>
      }
      missionText={
        <p>
          To faithfully Minister to high school students through Evangelism, Discipleship, Mentorship and Christian Fellowship, nurturing them into Godly individuals prepared for life and Faith.
        </p>
      }
      joinText={
        <p>
          We invite all who are interested in winning souls and showing the way of Christ to students to join our mission. Yee to the schools and declare His glory!
        </p>
      }
      requirements={[
        "Respect",
        "Integrity",
        "Team work",
        "Courage",
        "Excellence"
      ]}
      whatWeDoHeader="Here’s how our High School team serves our congregation and the entire Kisii University community."
      whatWeDoCards={[
        { icon: <MessageCircle size={32} className="text-[#730051]" />, title: "Counselling", description: "Respect student confidentiality during counselling or personal sharing." },
        { icon: <UserPlus size={32} className="text-[#730051]" />, title: "Discipleship", description: "Share sensitive issues only with leaders or overseer where necessary." },
        { icon: <Megaphone size={32} className="text-[#730051]" />, title: "Evangelism", description: "Empower students to lead and share the gospel, Salvation, and Identity in Christ." },
        { icon: <BookOpen size={32} className="text-[#730051]" />, title: "Teaching", description: "All teachings must align with KSUCU Statement of Faith." }
      ]}
      ourRole="To raise up a generation of young leaders who are passionate about Jesus, equipped with His Word, and committed to making a positive impact in their world."
      ensureList={[
        "Maintain discipline, punctuality and Unity during school visits.",
        "Members must exhibit Christian Character ( 1 Timothy 4:12 )",
        "Dress modestly and professionally during outreach.",
        "Members must be willing to share their faith and testimonies."
      ]}
      scheduleCards={[
        { icon: <Clock size={40} className="text-[#730051]" />, title: "Ministry meeting", time: "Tuesday: 6:50 PM - 8:00 PM" },
        { icon: <Heart size={40} className="text-[#730051]" />, title: "Prayer and fasting", time: "Saturday: 5:00 PM - 6:30 PM" }
      ]}
      philosophyText={
        <p>
          Self driven and ministry commitment. Our activities are many and exhausting; one needs to be prepared mentally & physically.
        </p>
      }
      communityImpactText={
        <p>
          Nurturing Godly individuals prepared for life and faith through authentic fellowship and mentorship.
        </p>
      }
      testimonials={[
        { quote: "Church school is one of greatest ministries which has made me to grow my Resilience, strength. It has taught me on how to deal with different kinds of kids boosting my emotional intelligence", author: "Catherine, Member" },
        { quote: "Seeing a struggling student finally understand a concept and smile with confidence - that's what this ministry is about.", author: "Patricia, Tutor" },
        { quote: "This ministry has shown me that education is not just about academics, but about building character and hope.", author: "David, Mentor" }
      ]}
      ministryId="hs"
      testimonialTitle="Student Voices"
    />
=======
import React, { useEffect, useRef, useState } from 'react';
import styles from './highSchool.module.css';
import { Link } from 'react-router-dom';
import highSchoolImg from '../../assets/high-school.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const HighSchoolPage: React.FC = () => {
  const contentRef1 = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          entry.target.classList.add(styles.visible || 'visible');
        }
      });
    }, observerOptions);

    // Observe elements if they exist
    if (contentRef1.current) observer.observe(contentRef1.current);

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${highSchoolImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>High School Ministry</h1>
          <p className={styles.subtitle}>Preaching Christ. Mentoring Students. Making Disciples.</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.description}>
            <div className={styles.sectionBlock}>
              <h2>About High School Ministry</h2>
              <p>
                The High School Ministry exists to preach the Gospel to high-school students and walk with them through intentional mentorship and structured discipleship. We aim to ground students in biblical truth, support their spiritual growth, and help them live out their faith with conviction during their school years.
              </p>

              <h3>Our Mission</h3>
              <p>
                To raise biblically grounded high-school students who understand their faith, live it with integrity, and reflect Christ in their schools and communities.
              </p>
            </div>
            
            <div className={styles.sectionBlock}>
              <h2>What We Do</h2>
              <ul className={styles.activitiesList}>
                <li data-number="01">Gospel-centered preaching and teaching during high-school gatherings</li>
                <li data-number="02">Intentional mentorship and personal spiritual guidance</li>
                <li data-number="03">Structured discipleship through small-group Bible study</li>
              </ul>
            </div>

            <div className={styles.sectionBlock}>
              <h2>Join High School Ministry</h2>
              <p>
                This ministry requires spiritually mature and consistent university students who are willing to teach, mentor, and disciple high-school students faithfully. If you are ready to serve with integrity and commitment, we welcome you.
              </p>
              
              <div className={styles.requirements}>
                <h3>Expectations</h3>
                <ul>
                  <li>A growing and disciplined personal relationship with Christ</li>
                  <li>Willingness to teach and mentor consistently</li>
                  <li>Commitment to sound biblical doctrine</li>
                  <li>Integrity in conduct and speech</li>
                  <li>Availability for scheduled outreach and follow-up</li>
                </ul>
              </div>
              
              <div className={styles.actionButtons}>
                <button className={styles.commitmentButton} onClick={() => setIsModalOpen(true)}>
                  Join High School Ministry
                </button>
                <Link to="/contact-us" className={styles.contactButton}>
                  Contact Ministry Coordinator
                </Link>
              </div>
            </div>
          </div>
        </div>

        <MinistryRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ministryName="High School Ministry"
        />
      </div>
    </>
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
  );
};

export default HighSchoolPage;