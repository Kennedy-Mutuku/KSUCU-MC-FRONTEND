<<<<<<< HEAD
import React from 'react';
import usheringImg from '../../assets/ushering.jpg';
import MinistryLayout from '../../components/MinistryLayout';
import { Calendar, Utensils, ClipboardList, ShieldCheck, Clock, Church, CalendarDays, BookOpen } from 'lucide-react';

const UsheringPage: React.FC = () => {
  return (
    <MinistryLayout
      title="Ushering and Hospitality Ministry"
      subtitle="Serving people as Jesus Would"
      heroImage={usheringImg}
      ministryName="Ushering"
      aboutText={
        <>
          <p>
            We as ushers we prepare venue for major KSUCU events , preparing meals for guests in the guest room and on other major events such as the AGM. We also organize for Carol Sundays , Holy communion and hymn Sundays( if scheduled by the KSUCU executive committee). We also collect offerings during the KSUCU services.
          </p>
          <p>
            We are governed by three leaders that is the Chief usher , usher in charge and caterer in charge, we also work with the Vice chair of the KSUCU MC as the overseer and the executive committee link. We also have micro families managed by leaders selected by the ushering leaders.
          </p>
        </>
      }
      missionText={
        <p>
          Our activities as therefore service to the people oriented from CU community, to visitors and the entire student fraternity. We collaborate with other spiritual groups in Kisii University to ensure we stay to our mission.
        </p>
      }
      joinText={
        <p>
          If you have a heart for service towards God's people and a friendly smile, then here is your place, we invite you to ushering family a place where we touch hearts and build capacity in service. We invite you to join us in making every worship experience meaningful and memorable. Together, we can help create an environment where God's presence is felt and His people are blessed.
        </p>
      }
      requirements={[
        "Warm, friendly personality and genuine smile",
        "Inline with core values of KSUCU",
        "Attend all meetings and services consecutively",
        "Professional appearance and positive attitude",
        "Ability to remain calm under pressure",
        "Good communication and interpersonal skills"
      ]}
      whatWeDoHeader="Here’s how our Ushering and Hospitality team serves our congregation and the entire Kisii University community."
      whatWeDoCards={[
        { icon: <Calendar size={32} className="text-[#730051]" />, title: "Church Service", description: "We ensure members are comfortable during services" },
        { icon: <Utensils size={32} className="text-[#730051]" />, title: "Community", description: "Ensuring the community get meals during the major KSUCU events." },
        { icon: <ClipboardList size={32} className="text-[#730051]" />, title: "Major Events", description: "Preparing services and major CU events" },
        { icon: <ShieldCheck size={32} className="text-[#730051]" />, title: "Order and Protocol", description: "Ensuring a smooth running of the services by maintaining order." }
      ]}
      ourRole="We ensure every visitor feels valued and at home."
      ensureList={[
        "Warm welcoming atmosphere for members",
        "Welcome of guest speakers",
        "Organized seating",
        "Visitor assistance"
      ]}
      scheduleCards={[
        { icon: <Clock size={40} className="text-[#730051]" />, title: "Ministry meeting", time: "Tuesday: 6:50 PM - 8:00 PM" },
        { icon: <Church size={40} className="text-[#730051]" />, title: "Friday Fellowship", time: "Friday: 5:00 PM - 6:30 PM" },
        { icon: <CalendarDays size={40} className="text-[#730051]" />, title: "Prayers", time: "Saturday: 3:00 PM - 4:40 PM" },
        { icon: <BookOpen size={40} className="text-[#730051]" />, title: "Sunday Service Preparation", time: "Saturday: 4:00 PM" }
      ]}
      philosophyText={
        <>
          <p>
            "Better is one day in your courts than a thousand elsewhere; I would rather be a doorkeeper
            in the house of my God." – Psalm 84:10
          </p>
          <p>
            We believe that serving as an usher is a sacred privilege. Every person who walks through
            our doors carries hopes, fears, and needs. Our role is to be Jesus with skin on - to offer
            the warmth, care, and welcome that reflects God's heart for His people.
          </p>
        </>
      }
      communityImpactText={
        <p>
          We provide comprehensive training covering hospitality excellence, crowd management, emergency
          procedures, and conflict resolution. Regular workshops help our team stay updated on best
          practices and continue growing in their service skills.
        </p>
      }
      testimonials={[
        { quote: "Being an usher has taught that a service to God's people is also a thanksgiving to God, and this has helped to draw closer to God through our meetings where we edify each other. It has helped me to cultivate humility and kindness cause that what ushering is.", author: "Joachim, Head Usher" },
        { quote: "Ushering and hospitality ministry has been of impact in my ministry life. Spiritually, ushering has helped me focus on serving others, grow in humility, and experiencing God in my service. Hospitality is also part of ushering and have learn how to cook varieties and even it has open doors for more connections and friendships", author: "Viviane Odhiambo, Member" },
        { quote: "There's a special joy in being the first smile a person sees when they walk into God's house.", author: "David, Team Member" }
      ]}
      ministryId="ushering"
      testimonialTitle="Hearts of Service"
    />
=======
import React, { useEffect, useRef, useState } from 'react';
import styles from './ushering.module.css';
import { Link } from 'react-router-dom';
import usheringImg from '../../assets/ushering.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const UsheringPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${usheringImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Ushering and Hospitality Ministry</h1>
          <p className={styles.subtitle}>Serving with order, warmth, and responsibility</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Ushering & Hospitality</h2>
            <p>
              The Ushering and Hospitality Ministry supports the smooth and orderly flow of Christian Union services. Through practical service and responsible coordination, we assist attendees, maintain structure during gatherings, and ensure that every service environment remains welcoming and well organized.
            </p>

            <h3>Our Mission</h3>
            <p>
              To serve with integrity and discipline, creating an atmosphere of order and hospitality that supports meaningful worship experiences.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">Assist with seating and provide service information</li>
              <li data-number="02">Manage offering collection during services</li>
              <li data-number="03">Maintain order and assist with crowd coordination</li>
              <li data-number="04">Provide directions and respond to questions</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join the Ushering Team</h2>
            <p>
              Do you have a heart for service and a willingness to support the ministry through practical responsibility? We welcome students who value order, reliability, and teamwork in serving the Christian Union community.
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>Commitment to serving faithfully</li>
                <li>Punctuality and reliability</li>
                <li>Respectful and responsible conduct</li>
                <li>Ability to remain calm and attentive during services</li>
                <li>Willingness to work as part of a coordinated team</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.commitmentButton} onClick={() => setIsModalOpen(true)}>
                Join Ushering Team
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
          ministryName="Ushering and Hospitality Ministry"
        />
      </div>
    </>
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
  );
};

export default UsheringPage;