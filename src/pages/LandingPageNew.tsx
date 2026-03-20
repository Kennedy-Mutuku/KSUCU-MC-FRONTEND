import {
  HeroSection,
  WeeklyActivities,
  ForumsSection,
  AboutSection,
} from '../components/landing';
import LiveAttendanceBanner from '../components/landing/LiveAttendanceBanner';

const LandingPageNew = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        <HeroSection />

        {/* Call to Action */}
        <section className="py-4 md:py-8 bg-purple-50 border-y border-purple-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-700 font-medium text-base md:text-xl">
              Join a non-denominational Christian student association
            </p>
          </div>
        </section>

        {/* Live Attendance Sessions — appears only when sessions are active */}
        <LiveAttendanceBanner />

        <WeeklyActivities />
        <ForumsSection />
        <AboutSection />
      </div>
    </div>
  );
};

export default LandingPageNew;
