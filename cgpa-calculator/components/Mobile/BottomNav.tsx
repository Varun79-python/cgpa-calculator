import { useRouter } from 'next/router';

const NAV_ITEMS = [
  { path: '/calculator/sgpa', icon: 'fa-solid fa-layer-group', label: 'SGPA' },
  { path: '/calculator/cgpa', icon: 'fa-solid fa-chart-line', label: 'CGPA' },
  { path: '/', icon: 'fa-solid fa-house', label: 'Home' },
  { path: '/history', icon: 'fa-solid fa-clock-rotate-left', label: 'History' },
  { path: '/export', icon: 'fa-solid fa-file-pdf', label: 'Export' },
];

export default function BottomNav() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <nav className="mobile-bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.path}
          className={`bottom-nav-item ${currentPath === item.path ? 'active' : ''}`}
          onClick={() => router.push(item.path)}
          aria-label={item.label}
        >
          <i className={item.icon} style={{ fontSize: '1rem' }} />
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
