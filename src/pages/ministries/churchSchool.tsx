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
      whatWeDoHeader="Here's how we serve God through the children"
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
  );
};

export default ChurchSchoolPage;
