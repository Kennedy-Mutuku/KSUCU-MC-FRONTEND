import React from 'react';
import highSchoolImg from '../../assets/high-school.jpg';
import MinistryLayout from '../../components/MinistryLayout';
import { MessageCircle, UserPlus, Megaphone, BookOpen, Clock, Heart } from 'lucide-react';

const HighSchoolPage: React.FC = () => {
  return (
    <MinistryLayout
      title="High School Ministry"
      subtitle="Declare his glory among the nations, his marvelous deeds among all peoples."
      heroImage={highSchoolImg}
      ministryName="High School Ministry"
      aboutText={
        <>
          <p>
            The High School Ministry is a vibrant community where students can grow in their faith, build lasting friendships, and discover their purpose in Christ. We are passionate about equipping the next generation to navigate the challenges of high school with confidence, grounded in God's Word and His love.
          </p>
          <p>
            Through engaging worship, relevant teaching, small group discussions, and fun activities, we create an environment where students feel welcomed, valued, and empowered.
          </p>
        </>
      }
      missionText={
        <p>
          To faithfully Minister to high school students through Evangelism, Discipleship, Mentorship and Christian Fellowship, nurturing them into Godly individuals prepared for life and Faith.
        </p>
      }
      joinText={
        <p>
          We invite all who are interested in winning souls and showing the way of Christ to students to join our mission. Yee to the schools and declare His glory!
        </p>
      }
      requirements={[
        "Respect",
        "Integrity",
        "Team work",
        "Courage",
        "Excellence"
      ]}
      whatWeDoHeader="Here's how our High School team serves our congregation and the entire Kisii University community."
      whatWeDoCards={[
        { icon: <MessageCircle size={32} className="text-[#730051]" />, title: "Counselling", description: "Respect student confidentiality during counselling or personal sharing." },
        { icon: <UserPlus size={32} className="text-[#730051]" />, title: "Discipleship", description: "Share sensitive issues only with leaders or overseer where necessary." },
        { icon: <Megaphone size={32} className="text-[#730051]" />, title: "Evangelism", description: "Empower students to lead and share the gospel, Salvation, and Identity in Christ." },
        { icon: <BookOpen size={32} className="text-[#730051]" />, title: "Teaching", description: "All teachings must align with KSUCU Statement of Faith." }
      ]}
      ourRole="To raise up a generation of young leaders who are passionate about Jesus, equipped with His Word, and committed to making a positive impact in their world."
      ensureList={[
        "Maintain discipline, punctuality and Unity during school visits.",
        "Members must exhibit Christian Character ( 1 Timothy 4:12 )",
        "Dress modestly and professionally during outreach.",
        "Members must be willing to share their faith and testimonies."
      ]}
      scheduleCards={[
        { icon: <Clock size={40} className="text-[#730051]" />, title: "Ministry meeting", time: "Tuesday: 6:50 PM - 8:00 PM" },
        { icon: <Heart size={40} className="text-[#730051]" />, title: "Prayer and fasting", time: "Saturday: 5:00 PM - 6:30 PM" }
      ]}
      philosophyText={
        <p>
          Self driven and ministry commitment. Our activities are many and exhausting; one needs to be prepared mentally & physically.
        </p>
      }
      communityImpactText={
        <p>
          Nurturing Godly individuals prepared for life and faith through authentic fellowship and mentorship.
        </p>
      }
      testimonials={[
        { quote: "Church school is one of greatest ministries which has made me to grow my Resilience, strength. It has taught me on how to deal with different kinds of kids boosting my emotional intelligence", author: "Catherine, Member" },
        { quote: "Seeing a struggling student finally understand a concept and smile with confidence - that's what this ministry is about.", author: "Patricia, Tutor" },
        { quote: "This ministry has shown me that education is not just about academics, but about building character and hope.", author: "David, Mentor" }
      ]}
      ministryId="hs"
      testimonialTitle="Student Voices"
    />
  );
};

export default HighSchoolPage;
