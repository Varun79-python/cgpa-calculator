import { useRouter } from 'next/router';

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

  return (
    <nav className="tabs" role="tablist" aria-label="Navigation">
      {TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={currentPath === t.id}
          className="tab"
          onClick={() => router.push(t.id)}
          tabIndex={currentPath === t.id ? 0 : -1}
        >
          <i className={t.icon} aria-hidden="true" />
          <span className="tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
