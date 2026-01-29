import Header from '../components/landing/Header';
import {
  HeroSection,
  CategorySection,
  WeeklyActivities,
  ForumsSection,
  AboutSection,
  AttendanceSection,
  QuickLinksButton,
  Footer,
} from '../components/landing';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />

      {/* Call to Action */}
      <section className="py-8 bg-purple-50 border-y border-purple-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-700 font-medium text-lg md:text-xl">
            Join a non-denominational Christian student association
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-purple-100 text-[#730051] text-sm font-medium rounded-full mb-4">
              Explore
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
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

      <AttendanceSection />
      <WeeklyActivities />
      <ForumsSection />
      <AboutSection />
      <Footer />
      <QuickLinksButton />
    </div>
  );
};

export default LandingPageNew;
