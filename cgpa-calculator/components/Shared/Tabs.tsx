import { useRouter } from 'next/router';
import { useState } from 'react';

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

  return (
    <div
      className="tabs-marquee"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`tabs-marquee-track ${isPaused ? 'paused' : ''}`}>
        {/* First set */}
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={currentPath === t.id}
            className={`tab ${currentPath === t.id ? 'active' : ''}`}
            onClick={() => router.push(t.id)}
          >
            <i className={t.icon} aria-hidden="true" />
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
        {/* Duplicate sets for seamless loop */}
        {TABS.map((t) => (
          <button
            key={`dup1-${t.id}`}
            role="tab"
            aria-selected={currentPath === t.id}
            className={`tab ${currentPath === t.id ? 'active' : ''}`}
            onClick={() => router.push(t.id)}
          >
            <i className={t.icon} aria-hidden="true" />
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
        {TABS.map((t) => (
          <button
            key={`dup2-${t.id}`}
            role="tab"
            aria-selected={currentPath === t.id}
            className={`tab ${currentPath === t.id ? 'active' : ''}`}
            onClick={() => router.push(t.id)}
          >
            <i className={t.icon} aria-hidden="true" />
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
