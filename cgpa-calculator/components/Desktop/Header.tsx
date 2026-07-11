import { useRouter } from 'next/router';
import { useDegreeStore, useHistoryStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';
import ThemeToggle from '@/components/Shared/ThemeToggle';
import DegreeSwitcher from '@/components/Shared/DegreeSwitcher';

export default function DesktopHeader() {
  const router = useRouter();
  const degree = useDegreeStore(s => s.degree);
  const history = useHistoryStore(s => s.history);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <header className="app-header">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="brand" onClick={() => router.push('/')}>
        <div className="brand-mark">
          <img src="/icons/icon-48x48.png" alt="CGPA Calculator" width="32" height="32" style={{ display: 'block', borderRadius: 'var(--radius-md)' }} />
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
          <span style={{ marginLeft: '4px', fontSize: 'var(--text-2xs)' }}>History</span>
          {history.length > 0 && (
            <span style={{
              position: 'absolute', top: '-3px', right: '-3px',
              width: '16px', height: '16px', borderRadius: '50%',
              background: 'var(--accent)', color: 'white',
              fontSize: '0.55rem', fontWeight: 700,
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
          <span style={{ marginLeft: '4px', fontSize: 'var(--text-2xs)' }}>App</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
