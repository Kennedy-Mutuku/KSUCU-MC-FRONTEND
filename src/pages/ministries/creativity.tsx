<<<<<<< HEAD
import React from 'react';
import creativityImg from '../../assets/creativity.jpg';
import MinistryLayout from '../../components/MinistryLayout';
import { Palette, Theater, Music, Brush, Clock, Users, Heart } from 'lucide-react';

const CreativityPage: React.FC = () => {
  return (
    <MinistryLayout
      title="Creativity Ministry"
      subtitle="Given the skills to serve and perform great things for the Glory of God."
      heroImage={creativityImg}
      ministryName="Creativity Ministry"
      aboutText={
        <>
          <p>
            Creativity Ministry is where ministers Graced with talent use the same to deliver different practical messages and spread the Gospel effectively especially in our Sunday Services (We help the preacher preach).
          </p>
          <p>
            We believe creativity is a reflection of the Creator and a powerful tool to communicate truth, evoke emotion, and build connections. From creating engaging visuals for worship, producing powerful performances, or crafting inspiring content, we strive to use our gifts to draw people closer to God.
          </p>
        </>
      }
      missionText={
        <p>
          Our mission as a ministry is to use the various talents given unto us for God's Glory in the enlightenment of his people in a more interesting way that not only entails humor but also captures the heart and soul. It gives us the motivation that our work slowly brings God's people closer to Him and this is why we depend on Insight From His Holy Spirit for clarity in the effective planning of our ministrations.
        </p>
      }
      joinText={
        <p>
          This is the place of Talent Maturity while returning all glory to God. Everyone has a gift and there's nothing as satisfying as knowing that you're using it in the advancement of the Kingdom of God.
        </p>
      }
      requirements={[
        "Passion for creative expression and artistic excellence",
        "Heart for worship and desire to serve God",
        "Skills in one or more creative disciplines (all levels welcome)",
        "Commitment to collaborative teamwork",
        "Willingness to learn new techniques and technologies",
        "Availability for project deadlines and events"
      ]}
      whatWeDoHeader="Here’s how our Creativity team serves our congregation and the entire Kisii University community."
      whatWeDoCards={[
        { icon: <Palette size={32} className="text-[#730051]" />, title: "Visuals", description: "Visual graphics and designs for church communications" },
        { icon: <Theater size={32} className="text-[#730051]" />, title: "Drama", description: "Drama and theatrical performances" },
        { icon: <Music size={32} className="text-[#730051]" />, title: "Dance", description: "Dance choreography and movement worship" },
        { icon: <Brush size={32} className="text-[#730051]" />, title: "Art", description: "Art installations and decorative displays" }
      ]}
      ourRole="We help the preacher preach and make the gospel interesting and relatable."
      ensureList={[
        "Message alignment & theological accuracy",
        "Practical application of the gospel",
        "Engagement & retention",
        "Spiritual impact & atmosphere preparation"
      ]}
      scheduleCards={[
        { icon: <Clock size={40} className="text-[#730051]" />, title: "Ministry meeting", time: "Tuesday: 6:50 PM - 8:00 PM" },
        { icon: <Users size={40} className="text-[#730051]" />, title: "Rehearsals", time: "Saturday: 6:30 to 9:00 am" },
        { icon: <Heart size={40} className="text-[#730051]" />, title: "Prayers", time: "Tuesday: 1:00 PM - 2:30 PM & 5:00 PM - 6:00 PM" }
      ]}
      philosophyText={
        <>
          <p>We are guided by unfiltered truth, Friendship, Honesty, Unity and Love for one another.</p>
          <p>"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters." – Colossians 3:23</p>
        </>
      }
      communityImpactText={
        <p>
          Our creative works extend beyond church walls to impact the broader community through social media, community events, and collaborative projects that demonstrate God's love and creativity to the world.
        </p>
      }
      testimonials={[
        { quote: "It has helped me cultivate my salvation journey by helping me in consistency and growth. It has shaped my discipline in ministry by putting me on toes about fellowship and has helped me to grow in discipleship  and evangelism", author: "Mitchelle, Member." },
        { quote: "It has taught me to rid off hypocrisy as I can not preach what I do not practice.The ministry has helped me lean more on the Holy Spirit's Leadership rather than my own insight inorder for the Lord to work on His People whilst using me as a vessel of honour", author: "Lynne, Chair to the Creativity Ministry" },
        { quote: "Being part of this team has pushed me to excellence while keeping Christ at the center of my creativity.", author: "- Lisa, Photographer" }
      ]}
      ministryId="creativity"
      testimonialTitle="Creative Testimonies"
    />
=======
import React, { useEffect, useRef, useState } from 'react';
import styles from './creativity.module.css';
import { Link } from 'react-router-dom';
import creativityImg from '../../assets/creativity.jpg';
import MinistryRegistrationModal from '../../components/MinistryRegistrationModal';

const CreativityPage: React.FC = () => {
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
      <div className={styles.heroSection} style={{ '--hero-bg': `url(${creativityImg})` } as React.CSSProperties}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Creativity Ministry</h1>
          <p className={styles.subtitle}>Using drama and storytelling to communicate truth</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.contentSection} ${styles.animate}`} ref={contentRef1}>
          <div className={styles.sectionBlock}>
            <h2>About Creativity Ministry</h2>
            <p>
              The Creativity Ministry uses drama and theatrical expression to communicate biblical truth in relatable and impactful ways. Through skits, stage presentations, and themed productions, we support the preaching of the Word and create moments that help the congregation reflect, understand, and respond.
            </p>

            <h3>Our Vision</h3>
            <p>
              To use drama and creative storytelling as a tool for spiritual reflection, helping students engage with biblical truth in practical and memorable ways.
            </p>
          </div>

          <div className={styles.sectionBlock}>
            <h2>What We Do</h2>
            <ul className={styles.activitiesList}>
              <li data-number="01">Present drama and skits during Sunday services to illustrate sermon messages</li>
              <li data-number="02">Organize themed Creativity Nights featuring stage performances and storytelling</li>
              <li data-number="03">Develop short dramatic pieces that address real-life issues from a biblical perspective</li>
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Join the Creativity Ministry</h2>
            <p>
              Do you have a passion for drama, storytelling, or stage performance? We welcome students who are willing to grow in confidence, teamwork, and biblical understanding while using creativity to serve the Christian Union.
            </p>

            <div className={styles.requirements}>
              <ul>
                <li>A genuine commitment to Christ</li>
                <li>Willingness to learn and participate in rehearsals</li>
                <li>Openness to teamwork and constructive feedback</li>
                <li>Reliability during scheduled presentations</li>
                <li>Desire to grow in confidence and stage discipline</li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.commitmentButton} onClick={() => setIsModalOpen(true)}>
                Join Creativity Ministry
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
          ministryName="Creativity Ministry"
        />
      </div>
    </>
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
  );
};

export default CreativityPage;
