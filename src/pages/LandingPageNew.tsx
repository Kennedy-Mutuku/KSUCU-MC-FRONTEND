import Header from '../components/landing/Header';
import {
  HeroSection,
  WeeklyActivities,
  ForumsSection,
  AboutSection,
  AttendanceSection,
  Footer,
} from '../components/landing';

const LandingPageNew = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Spacer for persistent mobile icon sidebar */}
      <div className="md:hidden w-[52px] fixed top-0 left-0 bottom-0 z-0" />
      <div className="pl-[52px] md:pl-0">
      <HeroSection />

      {/* Call to Action */}
      <section className="py-4 md:py-8 bg-purple-50 border-y border-purple-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-700 font-medium text-base md:text-xl">
            Join a non-denominational Christian student association
          </p>
        </div>
      </section>

      <AttendanceSection />
      <WeeklyActivities />
      <ForumsSection />
      <AboutSection />
      <Footer />
      </div>{/* end pl-[52px] wrapper */}
    </div>
  );
};

export default LandingPageNew;
