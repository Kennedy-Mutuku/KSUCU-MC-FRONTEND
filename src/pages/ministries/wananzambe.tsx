import React from 'react';
import wananzambeImg from '../../assets/wananzambe.jpg';
import MinistryLayout from '../../components/MinistryLayout';
import { Music, Users, Star, GraduationCap, Clock, Church, Music2, BookOpen, Guitar } from 'lucide-react';

const WananzambePage: React.FC = () => {
  return (
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
  );
};

export default WananzambePage;