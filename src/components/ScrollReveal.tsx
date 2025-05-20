import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, threshold = 0.1 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible');
        }
      },
      {
        threshold,
        rootMargin: '50px',
      }
    );

    const current = ref.current;

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [threshold]);

  return (
    <div ref={ref} data-scroll>
      {children}
    </div>
  );
};

export default ScrollReveal;