import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDegreeStore, useHistoryStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';
import ThemeToggle from '@/components/Shared/ThemeToggle';
import DegreeSwitcher from '@/components/Shared/DegreeSwitcher';
import { useIsTWA } from '@/hooks/useIsTWA';

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
      { label: 'Share App', icon: 'fa-solid fa-share-nodes', path: '/download' },
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
  const isTWA = useIsTWA();
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
          {!isTWA && (
            <button
              className="icon-btn"
              onClick={() => router.push('/download')}
              title="Share app"
              aria-label="Share the app"
            >
              <i className="fa-solid fa-share-nodes" />
            </button>
          )}
          <ThemeToggle />

          {/* Hamburger — rightmost */}
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
              background: 'var(--surface)',
              color: 'var(--ink-3)',
              borderColor: 'var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className="fa-solid fa-bars" style={{ fontSize: '0.85rem' }} />
          </button>
        </div>
      </header>

      {/* ─── OVERLAY ─── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 40,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ─── RIGHT SIDE DRAWER (like varunsonline.com) ─── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label="Navigation menu"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '300px',
          maxWidth: '85vw',
          zIndex: 50,
          background: 'var(--bg)',
          borderLeft: '1px solid var(--border-solid)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 0.2s ease, transform 0.3s var(--ease-out)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--sp-3) var(--sp-4)',
          borderBottom: '1px solid var(--border-solid)',
          minHeight: '52px',
        }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>
            <span style={{ color: 'var(--ink)' }}>CGPA</span>{' '}
            <span style={{ color: 'var(--accent)' }}>Calculator</span>
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="icon-btn"
            style={{ width: '28px', height: '28px', padding: 0 }}
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: '0.75rem' }} />
          </button>
        </div>

        {/* Nav groups */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-3) var(--sp-3)' }}>
          {NAV_GROUPS.map((group) => {
            const filteredItems = isTWA
              ? group.items.filter(item => !('path' in item) || item.path !== '/download')
              : group.items;
            return (
              <div key={group.label} style={{ marginBottom: 'var(--sp-4)' }}>
                <div style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--ink-4)',
                  marginBottom: 'var(--sp-1)',
                  padding: 'var(--sp-1) var(--sp-2)',
                }}>
                  {group.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {filteredItems.map((item) => {
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
                          padding: 'var(--sp-2) var(--sp-2)',
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
            );
          })}
        </div>

        {/* Footer */}
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
