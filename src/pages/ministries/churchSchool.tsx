<<<<<<< HEAD
import React from 'react';
import churchSchoolImg from '../../assets/churchschool.jpg';
import MinistryLayout from '../../components/MinistryLayout';
import { Calendar, Utensils, ClipboardList, Clock, Church, BookOpen } from 'lucide-react';

const ChurchSchoolPage: React.FC = () => {
  return (
    <MinistryLayout
      title="Church School Ministry"
      subtitle="Service to children is service to God"
      heroImage={churchSchoolImg}
      ministryName="Church School Ministry"
      aboutText={
        <>
          <p>
            The Church-School Ministry is dedicated to building a bridge between our church and local schools, fostering relationships that reflect God's love and make a lasting impact on students, teachers, and families. This ministry exists to serve, support, and inspire the next generation by meeting practical needs, encouraging spiritual growth, and sharing the hope of Christ.
          </p>
          <p>
            We operate under a well-defined structure to ensure accountability and efficiency, working closely with the Vice Chair of the KSUCU MC as our overseer.
          </p>
        </>
      }
      missionText={
        <p>
          To nurture children spiritually by teaching them the word of God in a loving, fun and safe environment hence helping them grow in faith, character, obedience and love for others as they discover their identity in Christ.
        </p>
      }
      joinText={
        <p>
          Whether individuals feel called to teaching, prayer, mentorship or support, there is a place for them. Availability, willingness, and a heart for God matter more than perfection.
        </p>
      }
      requirements={[
        "Integrity",
        "Love for children",
        "Responsibility",
        "Humility",
        "Obedience to God"
      ]}
      whatWeDoHeader="Here’s how we serve God through the children"
      whatWeDoCards={[
        { icon: <Calendar size={32} className="text-[#730051]" />, title: "Church Service", description: "The ministry does presentations on Sundays before the Church at least twice a month." },
        { icon: <Utensils size={32} className="text-[#730051]" />, title: "Community", description: "Provides hikes each semester for the children to enjoy themselves and have fun." },
        { icon: <ClipboardList size={32} className="text-[#730051]" />, title: "Major Events", description: "Grounding children in the word of God, prayer and Christian discipline." }
      ]}
      ourRole="We ensure every visitor feels valued and at home."
      ensureList={[
        "Nurturing and guiding children in the ways of God",
        "Ensuring holistic growth - spiritual, moral, emotional and social",
        "Producing spiritually mature believers"
      ]}
      scheduleCards={[
        { icon: <Clock size={40} className="text-[#730051]" />, title: "Ministry meeting", time: "Tuesday: 6:50 PM - 8:00 PM" },
        { icon: <Church size={40} className="text-[#730051]" />, title: "Ministrations", time: "Friday: 8:00 AM - 9:00 PM" },
        { icon: <Calendar size={40} className="text-[#730051]" />, title: "Prayers", time: "Saturday: 6:00 AM - 7:00 AM" },
        { icon: <BookOpen size={40} className="text-[#730051]" />, title: "Sunday School Service", time: "Sunday: 10:00 AM - 12:00 PM" }
      ]}
      philosophyTitle="Our Education Philosophy"
      philosophyText={
        <>
          <p>"Train up a child in the way he should go, and when he is old he will not depart from it." – Proverbs 22:6</p>
          <p>We believe that education is a partnership between school, family, church, and community. By working together, we can provide students with the academic support, life skills, and moral foundation they need to succeed in life.</p>
        </>
      }
      communityImpactText={
        <p>
          Our ministry has touched hundreds of lives through tutoring, mentorship, and support programs. We've seen students improve their grades, gain confidence, and develop positive life goals.
        </p>
      }
      testimonials={[
        { quote: "Teaching children about God's love is a privilege that brings so much joy.", author: "Sarah, Sunday School Teacher" },
        { quote: "Our kids are growing in faith every Sunday. It's beautiful to witness.", author: "James, Ministry Leader" },
        { quote: "Children are our priority because they are the church of today and tomorrow.", author: "Martha, Teacher" }
      ]}
      ministryId="cs"
      testimonialTitle="Transforming Lives Through Education"
    />
=======
import React, { useEffect, useRef, useState } from 'react';
import styles from './churchSchool.module.css';
import { Link } from 'react-router-dom';
import churshSchoolImg from '../../assets/churchschool.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const ChurchSchoolPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${churshSchoolImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Church School Ministry</h1>
          <p className={styles.subtitle}>Serving schools through mentorship, support, and faith</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Church School Ministry</h2>
            <p>
              The Church School Ministry partners with local schools to provide mentorship, academic support, and spiritual encouragement to students. Through consistent engagement, we aim to support character development, strengthen learning, and reflect Christ's love through practical service.
            </p>

            <h3>Our Vision</h3>
            <p>
              To support the educational community through mentorship, academic assistance, and spiritual guidance, contributing positively to students' growth in character and faith.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">After-school tutoring and homework assistance</li>
              <li data-number="02">Mentorship and guidance for students</li>
              <li data-number="03">Teacher support and appreciation initiatives</li>
              <li data-number="04">Spiritual nurture through prayer and biblical encouragement</li>
              <li data-number="05">Character and values development through structured engagement</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join Church School Ministry</h2>
            <p>
              Do you have a heart for guiding and supporting young learners? We welcome students who are willing to invest their time, skills, and faith into mentorship and academic support within local schools.
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>A genuine commitment to Christ</li>
                <li>Respect for children and educational environments</li>
                <li>Willingness to mentor and support students consistently</li>
                <li>Basic academic competence or willingness to assist with tutoring</li>
                <li>Commitment to safeguarding and responsible conduct (background check may be required)</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.commitmentButton} onClick={() => setIsModalOpen(true)}>
                Join Church School Ministry
              </button>
              <Link to="/contact-us" className={styles.contactButton}>
                Contact Coordinator
              </Link>
            </div>
          </div>
        </div>

        <MinistryRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ministryName="Church School Ministry"
        />
      </div>
    </>
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
  );
};

export default ChurchSchoolPage;
