<<<<<<< HEAD
import React from 'react';
import intercessoryImg from '../../assets/intersesory.jpg';
import MinistryLayout from '../../components/MinistryLayout';
import { Users, User, Activity, GraduationCap, Clock, Heart, Users2 } from 'lucide-react';

const IntercessoryPage: React.FC = () => {
  return (
    <MinistryLayout
      title="Intercessory Ministry"
      subtitle="Acts 6:4- But we will give ourselves continually to prayers and to the ministry of the word."
      heroImage={intercessoryImg}
      ministryName="Intercessory Ministry"
      aboutText={
        <>
          <p>
            The Intercessory Ministry is dedicated to standing in the gap through prayer, seeking God's heart, and lifting the needs of others before Him. Rooted in faith and compassion, this ministry strives to align with God's will and bring hope, healing, and transformation through the power of prayer.
          </p>
          <p>
            We believe in the importance of interceding for individuals, families, communities, and nations, trusting in the promises of God to hear and answer our petitions.
          </p>
        </>
      }
      missionText={
        <p>
          To be a house of prayer for all nations, interceding for the needs of our church, community, and world. We seek to build a bridge between heaven and earth through persistent, faithful prayer.
        </p>
      }
      joinText={
        <p>
          To those interested in joining, we really welcome them and ensure them that they will experience a growth in their salvation life.
        </p>
      }
      requirements={[
        "Heart for prayer and seeking God's presence",
        "Commitment to confidentiality and sensitivity",
        "Regular participation in prayer meetings",
        "Willingness to pray for others",
        "Desire to grow in spiritual maturity",
        "Availability for emergency prayer needs"
      ]}
      whatWeDoHeader="Here’s how our Intercessory Ministry serves the KSUCU community."
      whatWeDoCards={[
        { icon: <Users size={32} className="text-[#730051]" />, title: "Corporate Prayer", description: "Corporate prayer sessions and group prayer meetings." },
        { icon: <User size={32} className="text-[#730051]" />, title: "Individual Prayer", description: "Handling individual prayer requests and follow-ups." },
        { icon: <Activity size={32} className="text-[#730051]" />, title: "Prayer Chain", description: "24/7 prayer chain for urgent and emergency needs." },
        { icon: <GraduationCap size={32} className="text-[#730051]" />, title: "Training", description: "Training in prayer principles and spiritual warfare." }
      ]}
      ourRole="Standing in the gap between God and people."
      ensureList={[
        "Petition prayer",
        "Supplication prayer",
        "Prayer of thanksgiving",
        "Prayer of confession",
        "Prayer of worship"
      ]}
      scheduleCards={[
        { icon: <Clock size={40} className="text-[#730051]" />, title: "Ministry meeting", time: "Tuesday: 6:50 PM - 8:50 PM" },
        { icon: <Heart size={40} className="text-[#730051]" />, title: "Prayer and fasting", time: "Friday: 1:00 PM - 2:00 PM & 5:00 PM - 6:00 PM" },
        { icon: <Users2 size={40} className="text-[#730051]" />, title: "Prayers", time: "Separate sessions for ladies and gents" }
      ]}
      philosophyText={
        <>
          <p>
            "The prayer of a righteous person is powerful and effective." – James 5:16
          </p>
          <p>
            We believe prayer is both a privilege and a responsibility. It's our direct line of communication with our Heavenly Father and the means by which His will is accomplished on earth.
          </p>
        </>
      }
      communityImpactText={
        <p>
          Through intercession, we partner with God in His work of transformation and redemption within the university and the broader community.
        </p>
      }
      testimonials={[
        { quote: "Intercession is the engine of the church. Seeing God answer our prayers is the greatest reward.", author: "Moses, Team Member" },
        { quote: "It has help me to build a consistent bible reading habits. There is growth in my prayer life. The ministry has link me to people that l walk with them", author: "Sammy, Intercessor" },
        { quote: "Spiritual life it has helped me a lot in my personal devotion life(prayer) i am exposed to prayerful men and women of God they have impacted me a lot. Socially I have made new friends who are very beneficial to me both spiritually and mentally", author: "Emily Awour, Intercessor" },
      ]}
      ministryId="intercessory"
      testimonialTitle="Testimonies of God’s Faithfulness"
    />
=======
import React, { useEffect, useRef, useState } from 'react';
import styles from './intercessory.module.css';
import { Link } from 'react-router-dom';
import intercesorryImg from '../../assets/intersesory.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const IntercessoryPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${intercesorryImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Intercessory Ministry</h1>
          <p className={styles.subtitle}>Standing in the gap through prayer</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Intercessory Ministry</h2>
            <p>
              The Intercessory Ministry is dedicated to standing in the gap through intentional and faithful prayer. We lift the needs of individuals, the Christian Union, and the wider community before God, seeking His will and trusting His promises. Through disciplined intercession, we create spiritual covering, support others in times of challenge, and celebrate answered prayer together.
            </p>

            <h3>Our Mission</h3>
            <p>
              To be a house of prayer within the Christian Union, faithfully interceding for the church, the campus, and the wider community. We seek to build a consistent culture of prayer that aligns with God’s heart and purposes.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">Hold corporate prayer meetings</li>
              <li data-number="02">Receive and intercede over individual prayer requests</li>
              <li data-number="03">Organize fasting and prayer gatherings</li>
              <li data-number="04">Provide training and guidance in biblical intercession</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join the Intercessory Team</h2>
            <p>
              Do you have a burden for prayer and a desire to stand in the gap for others? We welcome committed individuals who are willing to grow in spiritual discipline and faithful intercession.
            </p>
            <p>
              We are looking for:
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>A genuine commitment to prayer</li>
                <li>Spiritual maturity and confidentiality</li>
                <li>Consistent participation in meetings</li>
                <li>Willingness to pray faithfully for others</li>
                <li>Desire to grow in biblical understanding of prayer</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <Link to="/contact-us" className={styles.commitmentButton}>
                Join Prayer Team
              </Link>
              <Link to="/contact-us" className={styles.contactButton}>
                Submit Prayer Request
              </Link>
            </div>
          </div>
        </div>

        <MinistryRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ministryName="Intercessory Ministry"
        />
      </div>
    </>
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
  );
};

export default IntercessoryPage;