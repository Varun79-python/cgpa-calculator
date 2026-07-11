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
        <div className="tabs-marquee-content">
          {TABS.map((t) => (
            <TabButton key={t.id} tab={t} currentPath={currentPath} router={router} />
          ))}
        </div>
        <div className="tabs-marquee-content" aria-hidden="true">
          {TABS.map((t) => (
            <TabButton key={`dup-${t.id}`} tab={t} currentPath={currentPath} router={router} />
          ))}
        </div>
      </div>
    </div>
  );
}
