import myPhoto from '../assets/KSUCU logo updated.png';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './OtherCommittees.css';
import { FaYoutube, FaInstagram, FaXTwitter, FaTiktok, FaFacebook, FaWhatsapp } from "react-icons/fa6";
import { 
  FaPrayingHands, 
  FaSeedling, 
  FaBrain, 
  FaHandsHelping, 
  FaBookOpen, 
  FaGlobeAfrica, 
  FaMusic, 
  FaCalculator, 
  FaChartLine, 
  FaTasks, 
  FaUserGraduate, 
  FaUserTie 
} from "react-icons/fa";
const OtherCommittees = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [quicklinksActive, setQuicklinksActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const toggleQuicklinks = () => {
    setQuicklinksActive(!quicklinksActive);
  };

  const committees = [
    {
      icon: <FaPrayingHands style={{ color: '#00c6ff' }} />,
      title: 'Prayer Committee',
      led: 'Prayer Coordinator with Intercessory Chairperson as Secretary, plus up to 8 members.',
      responsibilities: 'Establishes and manages prayer points, organizes prayer meetings and vigils, mobilizes members for intercession, and promotes corporate prayer and fasting initiatives.'
    },
    {
      icon: <FaSeedling style={{ color: '#00c6ff' }} />,
      title: 'Discipleship Committee',
      led: 'Discipleship Coordinator with 8 other members from the discipleship class.',
      responsibilities: 'Coordinates new believer follow-up, develops personal devotion habits, organizes baptism training, and manages discipleship classes for spiritual growth.'
    },
    {
      icon: <FaBrain style={{ color: '#00c6ff' }}/>,
      title: 'Christian Minds Committee',
      led: 'KSUCU-MC Chairperson (Overseer) with chair, secretary, treasurer, and 5+ members.',
      responsibilities: 'Equips members with life skills for campus and beyond, promotes leadership development, advocates on student issues, and integrates faith with academics.'
    },
    {
      icon: <FaHandsHelping style={{ color: '#00c6ff' }} />,
      title: 'BEST-P Committee',
      led: 'Bible Study Coordinator with chair, secretary, and 6 members.',
      responsibilities: 'Trains members in Bible exposition and self-study, develops thorough students of God\'s Word, and equips believers for effective ministry.'
    },
    {
      icon: <FaBookOpen style={{ color: '#00c6ff' }} />,
      title: 'Bible Study Committee',
      led: 'Bible Study Coordinator with BEST-P leaders, class fellowship leaders, and 4 members.',
      responsibilities: 'Develops semester study guides, organizes and manages study groups, trains group leaders, and coordinates Bible study weekends and events.'
    },
    {
      icon: <FaGlobeAfrica style={{ color: '#00c6ff' }}/>,
      title: 'Missions Committee',
      led: 'Missions Coordinator with chair, welfare in-charge, high school leader, discipleship in-charge, treasurer, outreach leader, and compassion representative.',
      responsibilities: 'Coordinates up to two missions per year outside campus, organizes high school ministry, handles mission follow-up, and identifies outreach opportunities.'
    },
    {
      icon: <FaMusic style={{ color: '#00c6ff' }} />,
      title: 'Worship Committee',
      led: 'Worship Coordinator with choir leader, praise leader, publicity secretary, instrumentalist leader, prayer coordinator, and 3 members.',
      responsibilities: 'Organizes Friday and Sunday services, coordinates worship meetings and conferences, provides ministry training, and advises on choir matters.'
    },
    {
      icon: <FaCalculator style={{ color: '#00c6ff' }}/>,
      title: 'Accounts Committee',
      led: 'KSUCU-MC Treasurer with chair and 7 members with accounting skills (max 9 total).',
      responsibilities: 'Maintains financial records, prepares financial statements, manages asset register, and recommends asset disposal when necessary.'
    },
    {
      icon: <FaChartLine style={{ color: '#00c6ff' }}/>,
      title: 'Development Committee',
      led: 'Appointed chair with treasurer, instrumentalist secretary, usher in-charge, ICT chair, and others (min 9 members).',
      responsibilities: 'Mobilizes funds for asset improvement, coordinates with strategic plan oversight, and advises on development projects.'
    },
    {
      icon: <FaTasks style={{ color: '#00c6ff' }} />,
      title: 'Strategic Plan Oversight Committee',
      led: 'KSUCU-MC Chairperson with chair, secretary, development chair, FOCUS staff, and others (min 9 members).',
      responsibilities: 'Harmonizes FOCUS and KSUCU-MC strategic plans, oversees implementation, advises on Ministry Annual Plans, and coordinates with development committee.'
    },
    {
      icon: <FaUserGraduate style={{ color: '#00c6ff' }} />,
      title: 'Orientation Committee',
      led: 'Discipleship Coordinator with 11 members including ICT board representatives and discipleship committee.',
      responsibilities: 'Runs the Anza Fit Program, welcomes first-year students, introduces them to union activities and ministries, and registers them in the database.'
    },
    {
      icon: <FaUserTie style={{ color: '#00c6ff' }} />,
      title: 'Elders Committee',
      led: '8 active finalists, finalists\' class leaders (ex-officio), and one third-year representative.',
      responsibilities: 'Links finalists to Associates Fellowship, prepares them for post-campus life, mobilizes participation in farewell activities, and coordinates fund mobilization.'
    }
  ];

  return (
    <div className="other-committees-page">
      {/* Page Content */}
      <div className="page-content">
        {/* Hero Section */}
        <div className="hero">
          <h1>Other Committees</h1>
          <p>Specialized teams serving specific areas of ministry and operations</p>
        </div>

        {/* Main Content */}
        <div className="container">
          <div className="committees-grid">
            {committees.map((committee, index) => (
              <div key={index} className="committee-card">
                <div className="committee-icon">
                  {committee.icon}
                </div>
                <h3>{committee.title}</h3>
                <p><strong>Led by:</strong> {committee.led}</p>
                <p><strong>Responsibilities:</strong> {committee.responsibilities}</p>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="back-section">
            <Link to="/" className="back-button">
              <i className="fas fa-arrow-left"></i>
              <span>Back to Main Page</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OtherCommittees;
