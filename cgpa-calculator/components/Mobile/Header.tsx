import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDegreeStore, useHistoryStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';
import ThemeToggle from '@/components/Shared/ThemeToggle';
import DegreeSwitcher from '@/components/Shared/DegreeSwitcher';

const NAV_GROUPS = [
  {
    label: 'Calculators',
    items: [
      { label: 'SGPA Calculator', icon: 'fa-solid fa-layer-group', path: '/calculator/sgpa' },
      { label: 'CGPA Calculator', icon: 'fa-solid fa-chart-line', path: '/calculator/cgpa' },
      { label: 'GPA to Percentage', icon: 'fa-solid fa-arrow-right-arrow-left', path: '/calculator/converter' },
      { label: 'Goal Predictor', icon: 'fa-solid fa-bullseye', path: '/predictor' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'History', icon: 'fa-solid fa-clock-rotate-left', path: '/history' },
      { label: 'Export PDF', icon: 'fa-solid fa-file-pdf', path: '/export' },
      { label: 'Download App', icon: 'fa-solid fa-download', path: '/download' },
    ],
  },
  {
    label: 'Support',
    items: [
      { label: 'Report a Bug', icon: 'fa-solid fa-bug', path: '/report-bug', accent: true },
      { label: 'Contact Admin', icon: 'fa-solid fa-envelope', href: 'mailto:supplecostadmin@gmail.com' },
    ],
  },
];

export default function MobileHeader() {
  const router = useRouter();
  const degree = useDegreeStore(s => s.degree);
  const history = useHistoryStore(s => s.history);
  const label = DEGREE_CONFIG[degree].label;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on backdrop click
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen]);

  // Close on Escape
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [drawerOpen]);

  return (
    <>
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
          {/* Hamburger trigger */}
          <button
            ref={triggerRef}
            onClick={() => setDrawerOpen(o => !o)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            className="icon-btn"
            style={{
              width: '34px',
              height: '34px',
              padding: 0,
              background: drawerOpen ? 'var(--accent)' : 'var(--surface)',
              color: drawerOpen ? '#FFFFFF' : 'var(--ink-3)',
              borderColor: drawerOpen ? 'var(--accent)' : 'var(--border)',
            }}
          >
            <span style={{ display: 'block', width: '14px', height: '2px', borderRadius: '1px', background: 'currentColor', transition: 'all 0.15s ease', transform: drawerOpen ? 'translateY(5px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: '14px', height: '2px', borderRadius: '1px', background: 'currentColor', transition: 'opacity 0.15s ease', opacity: drawerOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '14px', height: '2px', borderRadius: '1px', background: 'currentColor', transition: 'all 0.15s ease', transform: drawerOpen ? 'translateY(-5px) rotate(-45deg)' : 'none' }} />
          </button>

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

      {/* ─── DRAWER OVERLAY ─── */}
      {drawerOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 40,
        }} onClick={() => setDrawerOpen(false)} />
      )}

      {/* ─── DRAWER ─── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label="Navigation menu"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          transform: drawerOpen ? 'translateY(0)' : 'translateY(100%)',
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          width: '100%',
          maxHeight: '75vh',
          zIndex: 50,
          background: 'var(--bg)',
          borderTop: '1px solid var(--border-solid)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          boxShadow: 'var(--shadow-2xl)',
          transition: 'opacity 0.2s ease, transform 0.3s var(--ease-out)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-2) 0 var(--sp-1)' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--surface-4)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--sp-2) var(--sp-4) var(--sp-3)',
          borderBottom: '1px solid var(--border-solid)',
        }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)' }}>
            <span style={{ color: 'var(--ink)' }}>CGPA</span>{' '}
            <span style={{ color: 'var(--accent)' }}>Calculator</span>
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="icon-btn"
            style={{ width: '28px', height: '28px' }}
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: '0.7rem' }} />
          </button>
        </div>

        {/* Nav groups */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-3) var(--sp-4)' }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} style={{ marginBottom: 'var(--sp-4)' }}>
              <div style={{
                fontSize: '0.6rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--ink-4)',
                marginBottom: 'var(--sp-2)',
              }}>
                {group.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {group.items.map((item) => {
                  const isAccent = 'accent' in item && item.accent;
                  const isExternal = 'href' in item;
                  return (
                    <a
                      key={item.label}
                      onClick={() => {
                        setDrawerOpen(false);
                        if (isExternal && 'href' in item) {
                          window.location.href = item.href;
                        } else if ('path' in item) {
                          router.push(item.path);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        padding: 'var(--sp-2) var(--sp-3)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: isAccent ? 600 : 500,
                        color: isAccent ? 'var(--accent)' : 'var(--ink)',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <i className={item.icon} style={{
                        width: '20px',
                        textAlign: 'center',
                        fontSize: '0.7rem',
                        color: isAccent ? 'var(--accent)' : 'var(--ink-4)',
                      }} />
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          padding: 'var(--sp-3) var(--sp-4)',
          borderTop: '1px solid var(--border-solid)',
          fontSize: '0.55rem',
          color: 'var(--ink-5)',
          textAlign: 'center',
        }}>
          All calculations run locally on your device
        </div>
      </div>
    </>
  );
}
