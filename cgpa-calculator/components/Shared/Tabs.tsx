import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const TABS = [
  { id: '/calculator/sgpa', label: 'SGPA', icon: 'fa-solid fa-layer-group' },
  { id: '/calculator/cgpa', label: 'CGPA', icon: 'fa-solid fa-chart-line' },
  { id: '/calculator/converter', label: 'Convert', icon: 'fa-solid fa-arrow-right-arrow-left' },
  { id: '/predictor', label: 'Predict', icon: 'fa-solid fa-bullseye' },
  { id: '/history', label: 'History', icon: 'fa-solid fa-clock-rotate-left' },
  { id: '/export', label: 'Export', icon: 'fa-solid fa-file-pdf' },
];

export default function Tabs() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Touch/mouse drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Auto-scroll marquee
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollPos = el.scrollLeft;
    const speed = 0.5;

    const animate = () => {
      if (!isPaused && !isDragging) {
        scrollPos += speed;
        // Reset to start when we've scrolled through one set
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      } else {
        scrollPos = el.scrollLeft;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, isDragging]);

  return (
    <div
      className="tabs-marquee"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={scrollRef}
        className="tabs-marquee-track"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* First set */}
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={currentPath === t.id}
            className={`tab ${currentPath === t.id ? 'active' : ''}`}
            onClick={() => router.push(t.id)}
            tabIndex={currentPath === t.id ? 0 : -1}
          >
            <i className={t.icon} aria-hidden="true" />
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
        {/* Duplicate set for seamless loop */}
        {TABS.map((t) => (
          <button
            key={`dup-${t.id}`}
            role="tab"
            aria-selected={currentPath === t.id}
            className={`tab ${currentPath === t.id ? 'active' : ''}`}
            onClick={() => router.push(t.id)}
            tabIndex={-1}
          >
            <i className={t.icon} aria-hidden="true" />
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
