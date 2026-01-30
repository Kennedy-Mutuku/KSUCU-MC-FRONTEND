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
  const [previousSlide, setPreviousSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        setPreviousSlide(prev);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1200);
        return (prev + 1) % slides.length;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setPreviousSlide(currentSlide);
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 1200);
  };

  return (
    <section className="relative h-[40vh] min-h-[250px] md:h-screen md:min-h-[600px] overflow-hidden bg-black">
      {/* Background Images with Smooth Crossfade */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        const isPrevious = index === previousSlide && isAnimating;

        return (
          <div
            key={index}
            className="absolute inset-0"
            style={{
              opacity: isActive ? 1 : isPrevious ? 1 : 0,
              zIndex: isActive ? 2 : isPrevious ? 1 : 0,
              transition: isActive ? 'opacity 1.2s ease-in-out' : 'opacity 0.8s ease-in-out 0.4s',
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              style={{
                transform: isActive ? 'scale(1)' : 'scale(1.05)',
                transition: 'transform 6s ease-out',
              }}
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
          </div>
        );
      })}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-10 md:justify-center md:pb-0 px-4 md:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="mb-3 md:mb-8">
            <span className="inline-block px-4 py-1.5 md:px-5 md:py-2.5 bg-white/90 backdrop-blur-md rounded-full text-[#730051] text-sm md:text-lg font-semibold border-2 border-[#730051] shadow-lg">
              Kisii University Main Campus
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-2 md:mb-6 leading-tight tracking-tight"
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)' }}
          >
            Christian Union
          </h1>

          {/* Dynamic Subtitle based on current slide */}
          <div className="mb-4 md:mb-10 relative h-14 md:h-24">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  opacity: index === currentSlide ? 1 : 0,
                  transform: index === currentSlide ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                  pointerEvents: index === currentSlide ? 'auto' : 'none',
                }}
              >
                <p
                  className="text-lg md:text-3xl lg:text-4xl text-white font-semibold mb-1 md:mb-3"
                  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 0, 0, 0.4)' }}
                >
                  {slide.title}
                </p>
                <p
                  className="text-sm md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
                  style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 0, 0, 0.3)' }}
                >
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-row gap-3 md:gap-4 justify-center items-center">
            <a
              href="/signUp"
              className="px-6 py-2.5 md:px-10 md:py-4 bg-[#730051] text-white text-sm md:text-lg font-semibold rounded-full hover:bg-[#5a0040] transition-all duration-300 hover:-translate-y-1 border-2 border-white/40"
              style={{ boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)' }}
            >
              Join Us Today
            </a>
            <a
              href="#about"
              className="px-6 py-2.5 md:px-10 md:py-4 bg-white/90 backdrop-blur-md text-[#730051] text-sm md:text-lg font-semibold rounded-full hover:bg-white transition-all duration-300 border-2 border-[#730051]"
              style={{ boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)' }}
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-2 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-500 outline-none focus:outline-none ${
                index === currentSlide
                  ? 'bg-white scale-110'
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
