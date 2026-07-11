import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

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

export default function MobileFooter() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on backdrop click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <footer className="app-footer">
      {/* Trust Badges + Hamburger row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--sp-3)',
      }}>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', fontSize: 'var(--text-2xs)', color: 'var(--ink-3)' }}>
            <i className="fa-solid fa-shield-halved" /> Data stays on device
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', fontSize: 'var(--text-2xs)', color: 'var(--ink-3)' }}>
            <i className="fa-solid fa-bolt" /> Offline
          </span>
        </div>

        {/* Hamburger trigger */}
        <button
          ref={triggerRef}
          onClick={() => setOpen(o => !o)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            width: '34px',
            height: '34px',
            border: '1px solid var(--border-solid)',
            borderRadius: 'var(--radius-md)',
            background: open ? 'var(--accent)' : 'var(--surface)',
            color: open ? '#FFFFFF' : 'var(--ink-3)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
        >
          <span style={{ display: 'block', width: '14px', height: '2px', borderRadius: '1px', background: 'currentColor', transition: 'all 0.15s ease', transform: open ? 'translateY(5px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: '14px', height: '2px', borderRadius: '1px', background: 'currentColor', transition: 'opacity 0.15s ease', opacity: open ? 0 : 1 }} />
          <span style={{ display: 'block', width: '14px', height: '2px', borderRadius: '1px', background: 'currentColor', transition: 'all 0.15s ease', transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {/* Bottom copyright */}
      <div style={{ textAlign: 'center', marginTop: 'var(--sp-2)', paddingTop: 'var(--sp-2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.55rem', color: 'var(--ink-4)' }}>
          © 2026 CGPA Calculator · No data leaves your device
        </div>
      </div>

      {/* ─── DRAWER OVERLAY ─── */}
      {open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 40,
        }} onClick={() => setOpen(false)} />
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
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
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
            onClick={() => setOpen(false)}
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
                        setOpen(false);
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
    </footer>
  );
}
