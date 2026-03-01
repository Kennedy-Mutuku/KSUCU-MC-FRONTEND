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
      whatWeDoHeader="Here's how our Creativity team serves our congregation and the entire Kisii University community."
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
  );
};

export default CreativityPage;
