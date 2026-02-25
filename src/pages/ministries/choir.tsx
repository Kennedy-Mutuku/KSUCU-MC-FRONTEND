<<<<<<< HEAD
import React from 'react';
=======
import React, { useEffect, useRef, useState } from 'react';
import styles from './choir.module.css';
import { Link } from 'react-router-dom';
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
import choirImg from '../../assets/choir.jpg';
import MinistryLayout from '../../components/MinistryLayout';
import { Mic2, Music, Piano, BookOpen, Clock, Church, Calendar } from 'lucide-react';

const ChoirPage: React.FC = () => {
<<<<<<< HEAD
  return (
    <MinistryLayout
      title="Choir Ministry"
      subtitle="Voices united in harmony to glorify God"
      heroImage={choirImg}
      ministryName="Choir"
      aboutText={
        <>
          <p>
            The Choir Ministry in KSUCU-MC is a vibrant team of dedicated vocalists committed to leading the congregation in worship through song. With a passion for glorifying God through music, the choir blends voices in harmony to create a powerful and uplifting worship atmosphere.
          </p>
          <p>
            Through practice, prayer, and dedication, they minister to the hearts of many, drawing people closer to God with every song they sing. Our choir serves as a vessel for God's love and grace, touching lives through the beauty of unified worship.
          </p>
        </>
      }
      missionText={
        <p>
          To worship God through the gift of music, creating harmonious melodies that lift spirits, inspire faith, and bring glory to our Heavenly Father. We believe in the transformative power of music to heal, encourage, and unite God's people.
        </p>
      }
      joinText={
        <p>
          Whether you're an experienced vocalist or someone who simply loves to sing, our choir welcomes all who have a heart for worship and a desire to serve God through music. We provide training and support to help you grow in your musical gifts.
        </p>
      }
      requirements={[
        "Love for Jesus Christ and desire to worship Him",
        "Willingness to learn and improve vocal skills",
        "Commitment to regular rehearsals and performances",
        "Team spirit and cooperative attitude",
        "Basic reading ability (music reading helpful but not required)"
      ]}
      whatWeDoHeader="Here’s how our Choir team serves our congregation and the entire Kisii University community."
      whatWeDoCards={[
        { icon: <Mic2 size={32} className="text-[#730051]" />, title: "Sunday Worship", description: "Leading the congregation in praise and worship during Sunday services." },
        { icon: <Music size={32} className="text-[#730051]" />, title: "Special Ministrations", description: "Performing special songs during major events and carol services." },
        { icon: <Piano size={32} className="text-[#730051]" />, title: "Musical Training", description: "Developing vocal skills and musical understanding within the team." },
        { icon: <BookOpen size={32} className="text-[#730051]" />, title: "Spiritual Growth", description: "Regular Bible study and prayer sessions together as a ministry." }
      ]}
      ourRole="We lead the congregation in corporate worship and provide special musical ministrations."
      ensureList={[
        "Spirit-filled worship environment",
        "Musical excellence and preparation",
        "Unity and spiritual growth among members",
        "Alignment with KSUCU core values"
      ]}
      scheduleCards={[
        { icon: <Clock size={40} className="text-[#730051]" />, title: "Ministry meeting", time: "Tuesday: 6:50 PM - 8:00 PM" },
        { icon: <Church size={40} className="text-[#730051]" />, title: "Rehearsals", time: "Friday & Saturday: Various times" },
        { icon: <Calendar size={40} className="text-[#730051]" />, title: "Prayers", time: "Saturday: 3:00 PM - 4:30 PM" }
      ]}
      philosophyText={
        <>
          <p>
            "Sing to the Lord a new song; sing to the Lord, all the earth." – Psalm 96:1
          </p>
          <p>
            We believe that music is a powerful tool for evangelism and edification. Our ministry is focused on magnifying the name of Jesus and helping others connect with Him through the power of song.
          </p>
        </>
      }
      communityImpactText={
        <p>
          Our choir reaches out to the community through musical events and collaborations, sharing the love of Christ and the joy of the gospel through every performance.
        </p>
      }
      testimonials={[
        { quote: "Choir has enabled me build my courage, and always in the ministry of prayer because most of the time i have been leading. It has enabled me to understand the personalities of people. Still trusting God for growth", author: "Faith Lechuta, Choir Member" },
        { quote: "As a choir member i have gained alot like in spiritual life there is a great improvement especially on my prayer life. When I'm there I just feeling loved, the people really have been blessed with the fruit of the Spirit", author: "Stella, Choir Member" },
        { quote: "There is nothing more satisfying than seeing people touched by God through the songs we sing.", author: "Sarah, Choir Member" }
      ]}
      ministryId="choir"
      joinPath="/choir"
      testimonialTitle="Voices of Joy"
    />
=======
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${choirImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Choir Ministry</h1>
          <p className={styles.subtitle}>Voices united in harmony to glorify God</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Choir Ministry</h2>
            <p>
              The Choir Ministry is a dedicated team of student vocalists committed to glorifying God through unified, disciplined singing. Through rehearsed harmony and heartfelt worship, we seek to support the spiritual life of the Christian Union and serve the campus community with excellence.
            </p>

            <h3>Our Mission</h3>
            <p>
              To honor God through coordinated vocal excellence, using music to encourage faith, strengthen unity, and support the worship life of the Christian Union.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">Perform special musical presentations and concerts</li>
              <li data-number="02">Support community outreach through musical ministry</li>
              <li data-number="03">Collaborate with other ministries for combined worship</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join Our Choir</h2>
            <p>
              Do you have a passion for singing and a desire to use your voice in service to God? We welcome students who are willing to grow in vocal skill, discipline, and spiritual maturity while serving through music.
            </p>
            <p>
              We are looking for:
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>A genuine commitment to Christ</li>
                <li>Willingness to develop vocal ability</li>
                <li>Consistent attendance at rehearsals and ministry activities</li>
                <li>Team spirit and humility</li>
                <li>Openness to correction and growth</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <Link to="/contact-us" className={styles.commitmentButton}>
                Join Choir
              </Link>
              <Link to="/contact-us" className={styles.contactButton}>
                Contact Overseer
              </Link>
            </div>
          </div>
        </div>

        <MinistryRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ministryName="Choir Ministry"
        />
      </div>
    </>
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
  );
};

export default ChoirPage;