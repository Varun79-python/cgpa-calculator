import { useRouter } from 'next/router';

const TABS = [
  { id: '/calculator/sgpa', label: 'SGPA Calculator', icon: 'fa-solid fa-layer-group' },
  { id: '/calculator/cgpa', label: 'CGPA Calculator', icon: 'fa-solid fa-chart-line' },
  { id: '/calculator/converter', label: 'GPA ↔ Percentage', icon: 'fa-solid fa-arrow-right-arrow-left' },
  { id: '/predictor', label: 'Goal Predictor', icon: 'fa-solid fa-bullseye' },
  { id: '/history', label: 'History', icon: 'fa-solid fa-clock-rotate-left' },
  { id: '/export', label: 'Export PDF', icon: 'fa-solid fa-file-pdf' },
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

export default function DesktopTabs() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className="tabs-marquee">
      <div className="tabs-marquee-track">
        <div className="tabs-marquee-content" style={{ gap: 'var(--sp-1)' }}>
          {TABS.map((t) => (
            <TabButton key={t.id} tab={t} currentPath={currentPath} router={router} />
          ))}
        </div>
        <div className="tabs-marquee-content" style={{ gap: 'var(--sp-1)' }} aria-hidden="true">
          {TABS.map((t) => (
            <TabButton key={`dup-${t.id}`} tab={t} currentPath={currentPath} router={router} />
          ))}
        </div>
      </div>
    </div>
  );
}
