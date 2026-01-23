import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onScrollToContent?: () => void;
}

const HeroSection = ({ onScrollToContent }: HeroSectionProps) => {
  const handleScroll = () => {
    if (onScrollToContent) {
      onScrollToContent();
    } else {
      window.scrollTo({
        top: window.innerHeight - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-300 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 border border-white/20">
          Kisii University Main Campus
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Christian Union
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          A non-denominational Christian student association committed to discipleship,
          evangelism, and building a community of faith.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/signUp"
            className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Join Us Today
          </a>
          <a
            href="#about"
            className="px-8 py-3 border-2 border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={handleScroll}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce cursor-pointer"
        aria-label="Scroll to content"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};

export default HeroSection;
