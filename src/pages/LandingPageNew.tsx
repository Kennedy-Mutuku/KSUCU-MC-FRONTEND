import { useState, useEffect } from 'react';
import { getApiUrl } from '../config/environment';
import Header from '../components/landing/Header';
import {
  HeroSection,
  CategorySection,
  WeeklyActivities,
  ForumsSection,
  AboutSection,
  AttendanceSection,
  QuickLinksSidebar,
  Footer,
} from '../components/landing';

// Category data
const boardsItems = [
  { label: 'ICT Board', href: '/boards' },
  { label: 'Editorial Board', href: '/boards' },
  { label: 'Media Production', href: '/boards' },
  { label: 'Communication Board', href: '/boards' },
];

const evangelisticTeamsItems = [
  { label: 'CET - Campus Evangelistic Team', href: '/ets#cet' },
  { label: 'NET - National Evangelistic Team', href: '/ets#net' },
  { label: 'ESET - Estate Evangelistic Team', href: '/ets#eset' },
  { label: 'RIVET - Rural & Interior Village ET', href: '/ets#rivet' },
  { label: 'WESO - World Evangelism Support Org', href: '/ets#weso' },
];

const ministriesItems = [
  { label: 'Ushering and Hospitality', href: '/ministries/ushering' },
  { label: 'Creativity', href: '/ministries/creativity' },
  { label: 'Compassion and Counseling', href: '/ministries/compassion' },
  { label: 'Intercessory', href: '/ministries/intercessory' },
  { label: 'High School', href: '/ministries/highSchool' },
  { label: 'Wananzambe (Instrumentalists)', href: '/ministries/wananzambe' },
  { label: 'Church School', href: '/ministries/churchSchool' },
  { label: 'Praise and Worship', href: '/ministries/praiseAndWorship' },
  { label: 'Choir', href: '/ministries/choir' },
];

const fellowshipsItems = [
  { label: 'Best-P Classes', href: '/fellowshipsandclasses' },
  { label: 'Class Fellowships', href: '/fellowshipsandclasses' },
  { label: 'Sisters Fellowship', href: '/fellowshipsandclasses' },
  { label: 'Brothers Fellowship', href: '/fellowshipsandclasses' },
  { label: 'Discipleship Classes', href: '/fellowshipsandclasses' },
];

const LandingPageNew = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch(getApiUrl('users'), { credentials: 'include' });
        setIsLoggedIn(response.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Call to Action */}
      <section className="py-8 bg-primary-50 border-y border-primary-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-primary-700 font-medium text-lg md:text-xl">
            Join a non-denominational Christian student association
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 text-sm font-medium rounded-full mb-4">
              Explore
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Our Organization
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <CategorySection title="KSUCU-MC Boards" items={boardsItems} />
            <CategorySection title="Evangelistic Teams" items={evangelisticTeamsItems} />
            <CategorySection title="KSUCU-MC Ministries" items={ministriesItems} />
            <CategorySection title="Classes and Fellowships" items={fellowshipsItems} />
          </div>
        </div>
      </section>

      {/* Attendance Section */}
      <AttendanceSection />

      {/* Weekly Activities */}
      <WeeklyActivities />

      {/* Forums Section */}
      <ForumsSection />

      {/* About Section */}
      <AboutSection />

      {/* Quick Links Sidebar (Desktop only) */}
      <QuickLinksSidebar isLoggedIn={isLoggedIn} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPageNew;
