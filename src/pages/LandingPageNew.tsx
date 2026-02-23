import {
  HeroSection,
  WeeklyActivities,
  ForumsSection,
  AboutSection,
  Footer,
} from '../components/landing';

const LandingPageNew = () => {

  return (
    <div className="min-h-screen bg-gray-50">
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

        <WeeklyActivities />
        <ForumsSection />
        <AboutSection />
        <Footer />
      </div>{/* end pl-[52px] wrapper */}
    </div>
  );
};

export default LandingPageNew;
