import { useState, useEffect } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const BREAKPOINTS = {
  mobile: 0,
  tablet: 600,
  desktop: 1024,
} as const;

function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

export function useBreakpoint(): {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
} {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') {
      return { breakpoint: 'mobile' as Breakpoint, width: 375 };
    }
    const w = window.innerWidth;
    return { breakpoint: getBreakpoint(w), width: w };
  });

  useEffect(() => {
    let raf: number;

    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = window.innerWidth;
        const bp = getBreakpoint(w);
        setState(prev => (prev.breakpoint === bp && prev.width === w) ? prev : { breakpoint: bp, width: w });
      });
    };

    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
      cancelAnimationFrame(raf);
    };
  }, []);

  return {
    ...state,
    isMobile: state.breakpoint === 'mobile',
    isTablet: state.breakpoint === 'tablet',
    isDesktop: state.breakpoint === 'desktop',
  };
}
