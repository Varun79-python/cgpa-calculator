import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';

const TABS = [
  { id: '/calculator/sgpa', label: 'SGPA', icon: 'fa-solid fa-layer-group' },
  { id: '/calculator/cgpa', label: 'CGPA', icon: 'fa-solid fa-chart-line' },
  { id: '/calculator/converter', label: 'Convert', icon: 'fa-solid fa-arrow-right-arrow-left' },
  { id: '/predictor', label: 'Predict', icon: 'fa-solid fa-bullseye' },
  { id: '/history', label: 'History', icon: 'fa-solid fa-clock-rotate-left' },
  { id: '/export', label: 'Export', icon: 'fa-solid fa-file-pdf' },
];

function TabButton({ tab, currentPath, router }: { tab: typeof TABS[0]; currentPath: string; router: any }) {
  return (
    <button
      role="tab"
      aria-selected={currentPath === tab.id}
      className={`tab ${currentPath === tab.id ? 'active' : ''}`}
      onClick={() => router.push(tab.id)}
    >
      <i className={tab.icon} aria-hidden="true" />
      <span className="tab-label">{tab.label}</span>
    </button>
  );
}

export default function MobileTabs() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [isPaused, setIsPaused] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => {
      if (containerRef.current && contentRef.current) {
        setOverflows(contentRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`tabs-marquee${overflows ? '' : ' tabs-marquee--static'}`}
      onMouseEnter={() => overflows && setIsPaused(true)}
      onMouseLeave={() => overflows && setIsPaused(false)}
    >
      <div className={`tabs-marquee-track ${isPaused ? 'paused' : ''}`}>
        <div className="tabs-marquee-content" ref={contentRef}>
          {TABS.map((t) => (
            <TabButton key={t.id} tab={t} currentPath={currentPath} router={router} />
          ))}
        </div>
        {overflows && (
          <div className="tabs-marquee-content" aria-hidden="true">
            {TABS.map((t) => (
              <TabButton key={`dup-${t.id}`} tab={t} currentPath={currentPath} router={router} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
