import { useRouter } from 'next/router';

const TABS = [
  { id: '/calculator/sgpa', label: 'SGPA Calculator', icon: 'fa-solid fa-layer-group' },
  { id: '/calculator/cgpa', label: 'CGPA Calculator', icon: 'fa-solid fa-chart-line' },
  { id: '/calculator/converter', label: 'GPA ↔ Percentage', icon: 'fa-solid fa-arrow-right-arrow-left' },
  { id: '/predictor', label: 'Goal Predictor', icon: 'fa-solid fa-bullseye' },
  { id: '/history', label: 'History', icon: 'fa-solid fa-clock-rotate-left' },
  { id: '/export', label: 'Export PDF', icon: 'fa-solid fa-file-pdf' },
];

export default function DesktopTabs() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className="tabs-marquee tabs-marquee--static">
      <div className="tabs-marquee-track" style={{ width: '100%', justifyContent: 'center' }}>
        <div className="tabs-marquee-content" style={{ gap: 'var(--sp-1)' }}>
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
        </div>
      </div>
    </div>
  );
}
