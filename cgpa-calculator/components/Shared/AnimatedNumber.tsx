'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value?: number;
  decimals?: number;
  duration?: number;
}

export default function AnimatedNumber({
  value = 0,
  decimals = 2,
  duration = 600,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = prev.current;
    const end = value;
    const t0 = performance.now();

    const tick = (now: number) => {
      const elapsed = now - t0;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) raf.current = requestAnimationFrame(tick);
      else prev.current = end;
    };

    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value, duration]);

  return (
    <span className="result-number">
      {display.toFixed(decimals)}
    </span>
  );
}
