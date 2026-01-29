// useScrollAnimation.ts
import { useEffect, useRef } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Custom hook to add scroll-based animations to elements
 * @param options - Intersection Observer options
 * @returns ref to attach to the element you want to animate
 */
export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observerOptions: IntersectionObserverInit = {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Animate child elements with stagger
          const children = entry.target.querySelectorAll(
            '.service-card, .schedule-card, .testimonial, .instrument, .activitiesList li, .requirements ul li, .scheduleItem'
          );
          
          children.forEach((child) => {
            child.classList.add('visible');
          });
        }
      });
    }, observerOptions);

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options.threshold, options.rootMargin]);

  return elementRef;
};

export default useScrollAnimation;