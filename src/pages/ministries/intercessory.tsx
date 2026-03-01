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
      whatWeDoHeader="Here's how our Intercessory Ministry serves the KSUCU community."
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
      testimonialTitle="Testimonies of God's Faithfulness"
    />
  );
};

export default IntercessoryPage;
