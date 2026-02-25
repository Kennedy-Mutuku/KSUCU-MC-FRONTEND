<<<<<<< HEAD
import React from 'react';
import wananzambeImg from '../../assets/wananzambe.jpg';
import MinistryLayout from '../../components/MinistryLayout';
import { Music, Users, Star, GraduationCap, Clock, Church, Music2, BookOpen, Guitar } from 'lucide-react';
=======
import React, { useEffect, useRef, useState } from 'react';
import styles from './wananzambe.module.css';
import { Link } from 'react-router-dom';
import wanazambeImg from '../../assets/wananzambe.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const WanazambePage: React.FC = () => {
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
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79

const WananzambePage: React.FC = () => {
  return (
<<<<<<< HEAD
    <MinistryLayout
      title="Wananzambe Ministry"
      subtitle="Serve the master authentically, for his glory and honor"
      heroImage={wananzambeImg}
      ministryName="Wanazambe"
      aboutText={
        <>
          <p>
            Wananzambe is the instrumentalists' ministry in KSUCU-MC, dedicated to enhancing worship through music. This ministry consists of skilled musicians who play various instruments to create a powerful and uplifting worship experience.
          </p>
          <p>
            Sound arrangements and music delivery with choir, praise & worship, intercessory and ushering ministries are part of our core responsibilities.
          </p>
        </>
      }
      missionText={
        <p>
          To glorify God through instrumental worship, creating an atmosphere where hearts are lifted and souls are touched by His presence. We strive to support the worship experience through skillful musicianship and devoted hearts.
        </p>
      }
      joinText={
        <p>
          We are ministers and not musicians. Our focus is not performance, but purpose. We serve through our gifts, but our calling goes beyond talent. This ministry is for those who desire to impact lives and grow spiritually.
        </p>
      }
      requirements={[
        "Born-again christian with a heart for worship",
        "Basic instrumental skills (training provided)",
        "Punctuality and reliability for scheduled services",
        "Commitment to regular practice and services",
        "Willingness to grow in faith and musical excellence",
        "Team player attitude and servant's heart"
      ]}
      whatWeDoHeader="We are ministers first. Every action, every preparation, and every moment of service is intentional."
      whatWeDoCards={[
        { icon: <Music size={32} className="text-[#730051]" />, title: "Church Service", description: "Lead instrumental worship during church services." },
        { icon: <Users size={32} className="text-[#730051]" />, title: "Collaborations", description: "Support choir and praise & worship team performances." },
        { icon: <Star size={32} className="text-[#730051]" />, title: "Major Events", description: "Participate in special events and concerts." },
        { icon: <GraduationCap size={32} className="text-[#730051]" />, title: "Music Workshops", description: "Conduct music workshops and mentorship programs." }
      ]}
      ourRole="We don’t serve for recognition — we serve to build, uplift, and transform lives."
      ensureList={[
        "Spiritual atmosphere",
        "Unity & flow",
        "Excellence & preparation",
        "Support, not spotlight"
      ]}
      scheduleCards={[
        { icon: <Clock size={40} className="text-[#730051]" />, title: "Ministry Prayers", time: "Mondays: 5:50 PM – 6:50 PM" },
        { icon: <Church size={40} className="text-[#730051]" />, title: "Ministry Meeting", time: "Tuesdays: 6:50 PM – 8:50 PM" },
        { icon: <Music2 size={40} className="text-[#730051]" />, title: "Pre-practice", time: "Thursdays: 5:00 PM – 6:50 PM" },
        { icon: <BookOpen size={40} className="text-[#730051]" />, title: "Friday Fellowship Preparation", time: "Fridays: 4:30 PM" },
        { icon: <Guitar size={40} className="text-[#730051]" />, title: "Workshop & Training", time: "Saturdays: 5:30 AM – 4:30 PM" },
        { icon: <Church size={40} className="text-[#730051]" />, title: "Sunday Service Preparation", time: "Sunday: 5:00 AM - 7:00 AM" }
      ]}
      philosophyText={
        <>
          <p>
            We approach instrumentation as service, not entertainment. Every note played must align with the mission of the ministry.
          </p>
          <p>
            Skill is important — but character, humility, and spiritual maturity are essential. We believe music should never compete with the message; it should carry it.
          </p>
        </>
      }
      communityImpactText={
        <p>
          Our instrumentalists are committed to continuous growth both spiritually and technically. Through structured rehearsals and mentorship, we refine our skills and strengthen unity.
        </p>
      }
      testimonials={[
        { quote: "I've grown holistically, not just on instruments but in character. I've made friends who've helped me build capacity.", author: "Susan Wangui, Instrumentalist" },
        { quote: "Learning new skills of worship has expanded my ability to serve effectively. It challenged me beyond my comfort zone.", author: "Joshua, Chairperson" },
        { quote: "I am a vessel of influence for God's kingdom courtesy of Wananzambe ministry.", author: "Tonny, Pianist" }
      ]}
      ministryId="wananzambe"
      testimonialTitle="Sons of Asaph"
      joinPath="/wananzambe"
    />
=======
    <>
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${wanazambeImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Wananzambe (Instrumentalists)</h1>
          <p className={styles.subtitle}>Instrumentalists dedicated to worship excellence</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Wananzambe</h2>
            <p>
              Wananzambe is the instrumentalists' ministry of KSUCU-MC, committed to strengthening worship through skilled musicianship and servant leadership. Our team exists to support and elevate the worship experience, creating an atmosphere that leads the congregation into deep and meaningful encounters with God.
            </p>

            <h3>Our Mission</h3>
            <p>
              To glorify God through instrumental worship, creating an atmosphere where hearts are lifted and souls are touched by His presence. We strive to support the worship experience through skillful musicianship and devoted hearts.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">Lead instrumental worship during church services</li>
              <li data-number="02">Support choir and praise & worship team performances</li>
              <li data-number="03">Participate in special events and concerts</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join Wananzambe</h2>
            <p>
              Do you have a heart for worship and musical talents to share? We welcome musicians of all skill levels who are passionate about serving God through instrumental worship.
            </p>
            <p>
              We are looking for:
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>Born-again Christian with a heart for worship</li>
                <li>Basic instrumental skills (training provided for beginners)</li>
                <li>Commitment to regular practice and services</li>
                <li>Willingness to grow in faith and musical excellence</li>
                <li>Team player attitude and servant's heart</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <Link to="/contact-us" className={styles.commitmentButton}>
                Join Wananzambe
              </Link>
              <Link to="/contact-us" className={styles.contactButton}>
                Contact Worship Coordinator
              </Link>
            </div>
          </div>
        </div>

        <MinistryRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ministryName="Wananzambe Ministry"
        />
      </div>
    </>
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
  );
};

export default WananzambePage;