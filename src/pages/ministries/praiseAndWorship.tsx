<<<<<<< HEAD
import React from 'react';
import praiseAndWorshipImg from '../../assets/praise-and-worship.jpg';
import MinistryLayout from '../../components/MinistryLayout';
import { Music, Piano, Mic2, Heart, Clock, Church, Calendar, Users as UsersIcon } from 'lucide-react';

const PraiseAndWorshipPage: React.FC = () => {
  return (
    <MinistryLayout
      title="Praise and Worship Ministry"
      subtitle="Where Jesus is Lord"
      heroImage={praiseAndWorshipImg}
      ministryName="Praise and Worship"
      aboutText={
        <>
          <p>
            Praise and worship is a vibrant key ministry in KSUCU-MC that is mandated to lead the church in heartfelt intense worship in songs with accompaniment of Instruments for power packed encounter, experience with God.
          </p>
          <p>
            We advocate for True worship of Worshipping the Father in Spirit and Truth (John 4:23-25) to mentor worship leaders in the ministry and as the church at large.
          </p>
        </>
      }
      missionText={
        <p>
          To create an atmosphere of warmth, welcome, and worship excellence that allows every person who enters our church to feel the love of God and experience His presence.
        </p>
      }
      joinText={
        <p>
          Worship begins from your heart, therefore willingness and sincerity is key to encourage you for that desire and gift in singing or playing Instruments. The ministry gives you a ground to grow in word, prayer and skillfully in music.
        </p>
      }
      requirements={[
        "Have a personal relationship with Jesus Christ",
        "Heart of worship and leading others into God’s presence",
        "Music ability /gift in vocals (voice) or instruments",
        "Professional appearance and positive attitude",
        "Consistency to team practices, activities and church services",
        "Discipline"
      ]}
      whatWeDoHeader="Here’s how our Praise and Worship team serves our congregation every Sunday."
      whatWeDoCards={[
        { icon: <Music size={32} className="text-[#730051]" />, title: "Leading Worship", description: "Guiding the congregation into meaningful praise and heartfelt worship during services." },
        { icon: <Piano size={32} className="text-[#730051]" />, title: "Instrumental Excellence", description: "Creating a spirit-filled atmosphere through skillful and disciplined instrumentation." },
        { icon: <Mic2 size={32} className="text-[#730051]" />, title: "Vocal Ministry", description: "Ministering through song with unity, harmony, and spiritual sensitivity." },
        { icon: <Heart size={32} className="text-[#730051]" />, title: "Spiritual Preparation", description: "Engaging in prayer, rehearsals, and intentional preparation before every service." }
      ]}
      ourRole="We create an atmosphere of warmth, welcome and excellence that allows the congregation to experience God's presence."
      ensureList={[
        "Spiritual atmosphere",
        "Unity in the congregation",
        "Alignment with the message",
        "Spiritual engagement"
      ]}
      scheduleCards={[
        { icon: <Clock size={40} className="text-[#730051]" />, title: "Rehearsals", time: "Saturday: 2:00 PM - 5:00 PM TCG2" },
        { icon: <Church size={40} className="text-[#730051]" />, title: "Friday Fellowship Rehearsals", time: "Friday: 5:00 PM - 6:30 PM Sagini Hall" },
        { icon: <Calendar size={40} className="text-[#730051]" />, title: "Ministry Prayers", time: "Thursday: 5:50 PM - 6:50 PM" },
        { icon: <UsersIcon size={40} className="text-[#730051]" />, title: "Ministry Meeting", time: "Tuesday: 6:50 PM - 8:50 PM" }
      ]}
      philosophyText={
        <>
          <p>
            Psalm 150:6(NIV) - Let everything that has breath praise the Lord. Praise the Lord.
          </p>
          <p>
            We advocate for true worship and therefore we believe worship is an opportunity and responsibility to Worship God for Who He is and what He has done.
          </p>
        </>
      }
      communityImpactText={
        <p>
          Our Praise and Worship team is committed to continuous growth both spiritually and musically. Through structured rehearsals and mentorship, we develop excellence and sensitivity in ministry.
        </p>
      }
      testimonials={[
        { quote: "The unity and love in this ministry reflects God's heart for His people. It's truly a family.", author: "Ruth, Vocalist" },
        { quote: "Worship is personal from the heart and it's never on our terms but on God’s terms . Worship is not about singing but about my heart. And have seen growth in music both skills and understanding to magnify who God i", author: "Amos Opicho, Worship Leader" },
        { quote: "Through this team, I've grown not just as a musician, but as a worshipper who seeks God's heart.", author: "Peter, Guitarist" }
      ]}
      joinPath="/p&w"
      ministryId="pw"
      testimonialTitle="Hearts Transformed Through Worship"
    />
=======
import React, { useEffect, useRef, useState } from 'react';
import styles from './praiseAndWorship.module.css';
import { Link } from 'react-router-dom';
import praiseAndWorshipImg from '../../assets/praise-and-worship.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const PraiseAndWorshipPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${praiseAndWorshipImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Praise & Worship Ministry</h1>
          <p className={styles.subtitle}>Leading hearts into God’s presence through authentic worship</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Praise & Worship</h2>
            <p>
              We lead the community in sincere worship that points people to God. Our focus is creating space where students encounter Him, understand His love, and respond with faith and devotion.
            </p>

            <h3>Our Vision</h3>
            <p>
              To cultivate a culture of worship that shapes lives, strengthens faith, and reflects Christ across campus.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">Lead powerful corporate worship during Sunday services and Friday Fellowships</li>
              <li data-number="02">Participate in community outreach through worship</li>
              <li data-number="03">Lead worship during retreats and conferences</li>
              <li data-number="04">Develop disciplined, skilled worship leaders and musicians</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join Our Worship Team</h2>
            <p>
              Ready to use your voice, instrument, or leadership for something eternal? We are building a team of people who love Jesus and value excellence in worship.
            </p>
            <p>
              We are looking for:
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>A visible and growing relationship with Jesus</li>
                <li>A lifestyle that reflects integrity and spiritual maturity</li>
                <li>Musical or vocal ability with willingness to train seriously</li>
                <li>Commitment to rehearsals, services, and team accountability</li>
                <li>Humility, discipline, and hunger for growth</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <Link to="/contact-us" className={styles.commitmentButton}>
                Join Worship Team
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
          ministryName="Praise and Worship Ministry"
        />
      </div>
    </>
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
  );
};

export default PraiseAndWorshipPage;