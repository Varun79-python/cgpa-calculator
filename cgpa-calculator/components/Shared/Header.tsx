import { useRouter } from 'next/router';
import { useDegreeStore, useHistoryStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';
import ThemeToggle from './ThemeToggle';
import DegreeSwitcher from './DegreeSwitcher';

export default function Header() {
  const router = useRouter();
  const degree = useDegreeStore(s => s.degree);
  const history = useHistoryStore(s => s.history);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <header className="app-header">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="brand" onClick={() => router.push('/')}>
        <div className="brand-mark">
          {DEGREE_CONFIG[degree].shortLabel[0]}
        </div>
        <div className="brand-text">
          <h1><span style={{ color: 'var(--ink)' }}>CGPA</span> <span style={{ color: 'var(--accent)' }}>Calculator</span></h1>
          <p>{label} · SGPA · Percentage</p>
        </div>
      </div>
      <div className="header-actions">
        <DegreeSwitcher />
        <button
          className="icon-btn"
          onClick={() => router.push('/history')}
          title="History"
          aria-label="View history"
          style={{ position: 'relative' }}
        >
          <i className="fa-solid fa-clock-rotate-left" />
          {history.length > 0 && (
            <span style={{
              position: 'absolute', top: '-3px', right: '-3px',
              width: '14px', height: '14px', borderRadius: '50%',
              background: 'var(--accent)', color: 'white',
              fontSize: '0.5rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}>
              {history.length > 9 ? '9+' : history.length}
            </span>
          )}
        </button>
        <button
          className="icon-btn"
          onClick={() => router.push('/download')}
          title="Download app"
          aria-label="Download the app"
        >
          <i className="fa-solid fa-download" />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
