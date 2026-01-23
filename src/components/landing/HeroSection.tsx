import { useState, useEffect } from 'react';

// Import community images
import gentsImg from '../../assets/gents.jpg';
import ladiesImg from '../../assets/ladies.jpg';
import amptheatreImg from '../../assets/amptheatre.jpg';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    image: gentsImg,
    title: 'Brothers Fellowship',
    subtitle: 'Growing together in faith and brotherhood',
  },
  {
    image: ladiesImg,
    title: 'Sisters Fellowship',
    subtitle: 'United in Christ, empowering one another',
  },
  {
    image: amptheatreImg,
    title: 'Worship & Prayer',
    subtitle: 'Encountering God together as a community',
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background Images with Transition */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="mb-8">
            <span className="inline-block px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full text-[#730051] text-base md:text-lg font-semibold border-2 border-[#730051] shadow-lg">
              Kisii University Main Campus
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)' }}
          >
            Christian Union
          </h1>

          {/* Dynamic Subtitle based on current slide */}
          <div className="mb-10">
            <p
              className="text-2xl md:text-3xl lg:text-4xl text-white font-semibold mb-3 transition-opacity duration-500"
              style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 0, 0, 0.4)' }}
            >
              {slides[currentSlide].title}
            </p>
            <p
              className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
              style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 0, 0, 0.3)' }}
            >
              {slides[currentSlide].subtitle}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/signUp"
              className="px-10 py-4 bg-[#730051] text-white text-lg font-semibold rounded-full hover:bg-[#5a0040] transition-all duration-300 hover:-translate-y-1 border-2 border-white/40"
              style={{ boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)' }}
            >
              Join Us Today
            </a>
            <a
              href="#about"
              className="px-10 py-4 bg-white/90 backdrop-blur-md text-[#730051] text-lg font-semibold rounded-full hover:bg-white transition-all duration-300 border-2 border-[#730051]"
              style={{ boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)' }}
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 outline-none focus:outline-none ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
