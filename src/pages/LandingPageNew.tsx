import Header from '../components/landing/Header';
import {
  HeroSection,
  CategorySection,
  WeeklyActivities,
  ForumsSection,
  AboutSection,
  AttendanceSection,
  Footer,
} from '../components/landing';
import { organizationSections } from '../data/navigationData';

const LandingPageNew = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />

      {/* Call to Action */}
      <section className="py-4 md:py-8 bg-purple-50 border-y border-purple-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-700 font-medium text-base md:text-xl">
            Join a non-denominational Christian student association
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-6 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-3 md:mb-10">
            <span className="inline-block px-3 py-1 bg-purple-100 text-[#730051] text-sm font-medium rounded-full mb-1 md:mb-4">
              Explore
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-gray-800">
              Our Organization
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {organizationSections.map((section) => (
              <CategorySection
                key={section.title}
                title={section.title}
                items={section.items}
              />
            ))}
          </div>
        </div>
      </section>

      <AttendanceSection />
      <WeeklyActivities />
      <ForumsSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default LandingPageNew;
