// src/components/Reveal.tsx
import React, { useEffect, useRef, useState } from 'react';

type RevealVariant = 'fadeUp' | 'fadeIn' | 'zoomIn' | 'blurRise';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const Reveal: React.FC<{
  variant?: RevealVariant;
  delay?: number;
  once?: boolean;
  children: React.ReactNode;
}> = ({ variant = 'fadeUp', delay = 0, once = true, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return setShow(true);
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          if (once) obs.unobserve(el);
        } else if (!once) {
          setShow(false);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  const base =
    'transition-all duration-700 ease-[cubic-bezier(0.2,0.65,0.2,1)] will-change-transform';

  const hidden: Record<RevealVariant, React.CSSProperties> = {
    fadeUp: { opacity: 0, transform: 'translateY(12px)' },
    fadeIn: { opacity: 0, transform: 'translateY(0)' },
    zoomIn: { opacity: 0, transform: 'scale(0.98)' },
    blurRise: {
      opacity: 0,
      transform: 'translateY(10px)',
      filter: 'blur(6px)',
    },
  };
  const shown: Record<RevealVariant, React.CSSProperties> = {
    fadeUp: { opacity: 1, transform: 'translateY(0)' },
    fadeIn: { opacity: 1, transform: 'none' },
    zoomIn: { opacity: 1, transform: 'scale(1)' },
    blurRise: { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
  };

  const style: React.CSSProperties = {
    transitionDelay: `${delay}ms`,
    ...(show ? shown[variant] : hidden[variant]),
  };

  return (
    <div ref={ref} className={base} style={style}>
      {children}
    </div>
  );
};
