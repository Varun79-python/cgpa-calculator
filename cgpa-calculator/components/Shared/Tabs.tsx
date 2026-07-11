import { useRouter } from 'next/router';

const TABS = [
  { id: '/calculator/sgpa', label: 'SGPA', icon: 'fa-solid fa-layer-group', shortLabel: 'SG' },
  { id: '/calculator/cgpa', label: 'CGPA', icon: 'fa-solid fa-chart-line', shortLabel: 'CG' },
  { id: '/calculator/converter', label: 'Convert', icon: 'fa-solid fa-arrow-right-arrow-left', shortLabel: 'CV' },
  { id: '/predictor', label: 'Predict', icon: 'fa-solid fa-bullseye', shortLabel: 'PR' },
];

export default function Tabs() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <nav className="tabs" role="tablist" aria-label="Calculator mode">
      {TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={currentPath === t.id}
          className="tab"
          onClick={() => router.push(t.id)}
        >
          <i className={t.icon} aria-hidden="true" />
          <span className="tab-text">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
