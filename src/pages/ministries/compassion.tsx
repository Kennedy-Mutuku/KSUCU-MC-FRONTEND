import React from 'react';
import { Link } from 'react-router-dom';
import compassionImg from '../../assets/compassion.jpg';
import MinistryLayout from '../../components/MinistryLayout';
import styles from '../../styles/ministryPage.module.css';
import { Heart, HandHelping, GraduationCap, Users, Clock, Church } from 'lucide-react';

const CompassionPage: React.FC = () => {
  return (
    <MinistryLayout
      title="Compassion and Counselling Ministry"
      subtitle="Speak out, Get reached, We care."
      heroImage={compassionImg}
      ministryName="Compassion and Counselling Ministry"
      heroActions={
        <div className={styles.heroActionButtons}>
          <Link to="/compassion-counseling" className={styles.commitmentButton}>
            Give support to the ministry
          </Link>
        </div>
      }
      aboutText={
        <>
          <p>
            The Compassion and Counseling Ministry is dedicated to being the hands and feet of Jesus, reaching out to those in need with love, care, and practical support. Rooted in God's call to serve others, we strive to meet the physical, emotional, and spiritual needs of individuals and families in our church and community.
          </p>
          <p>
            Our mission is to bring hope to the hurting, comfort to the brokenhearted, and help to those facing life's challenges. Whether through food assistance, clothing drives, hospital visits, crisis care, or prayer, we are committed to demonstrating the love of Christ in tangible ways.
          </p>
        </>
      }
      missionText={
        <>
          <p>
            To serve others with empathy, care, and spiritual guidance guided by the example of Jesus Christ as the Ultimate model of compassion.
          </p>
          <p>
            Speak out, Get reached, We care.
          </p>
        </>
      }
      joinText={
        <p>
          From 1 Peter 3:8 we are reminded that we should be compassionate, love one another and be humble. Therefore I would like to welcome you all to the ministry which will nurture you. It's a family where we grow, bond, help and share our joys and hardships. Welcome all!
        </p>
      }
      requirements={[
        "A member of Christian Union",
        "Should be willing to join the ministry",
        "Commitment",
        "Confidence",
        "Should be familiar with the scriptures",
        "Participate in CU activities"
      ]}
      whatWeDoHeader="Here's how our Compassion and Counselling team serves our congregation and the entire Kisii University community."
      whatWeDoCards={[
        { icon: <Users size={32} className="text-[#730051]" />, title: "Church Community", description: "It serves the CU by providing help to the members of the CU that reach out when in need." },
        { icon: <Heart size={32} className="text-[#730051]" />, title: "Members", description: "It nurtures its members to become compassionate members in this self centered generation." },
        { icon: <GraduationCap size={32} className="text-[#730051]" />, title: "Training", description: "The ministry conducts detailed trainings on counseling and compassion to its members." },
        { icon: <HandHelping size={32} className="text-[#730051]" />, title: "Bonding", description: "The ministry has bonding sessions for its members." }
      ]}
      ourRole="We ensure everyone feels heard, supported, and cared for."
      ensureList={[
        "Warm welcoming atmosphere for members",
        "Welcome of guest speakers",
        "Organized seating",
        "Visitor assistance"
      ]}
      scheduleCards={[
        { icon: <Clock size={40} className="text-[#730051]" />, title: "Ministry meeting", time: "Tuesday: 6:50 PM - 8:00 PM" },
        { icon: <Church size={40} className="text-[#730051]" />, title: "Ministry Prayers", time: "Saturday: 6:30 PM - 7:30 PM" }
      ]}
      philosophyText={
        <>
          <p>
            The core philosophy of this Ministry is rooted in Christ's love and the call to serve others with empathy, care, and spiritual guidance. This ministry's philosophy is guided by the example of Jesus Christ as the Ultimate model of compassion.
          </p>
          <p>
            They guide our activities by actively looking for those who need help, giving them a safe place to talk, and continuing to support them.
          </p>
        </>
      }
      communityImpactText={
        <p>
          Through partnerships with local organizations, schools, and community leaders, we extend our reach to serve more families and individuals. Our goal is not just to provide temporary relief, but to offer hope and resources that lead to lasting positive change.
        </p>
      }
      testimonials={[
        { quote: "Through this ministry, I've learned that serving others is not just about giving, but about receiving God's love in return.", author: "Martha, Volunteer Coordinator" },
        { quote: "Being part of Compassion and Counseling Ministry has opened my eyes to the needs around us and the joy of making a difference.", author: "James, Food Bank Volunteer" },
        { quote: "This ministry has shown me that small acts of kindness can change lives.", author: "Kevin, Volunteer" }
      ]}
      ministryId="compassion"
      testimonialTitle="Lives Touched by Compassion"
    />
  );
};

export default CompassionPage;
