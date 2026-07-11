import { useState, useRef, useEffect } from 'react';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG, DEGREE_ORDER } from '@/config/constants';

const DEGREE_ICONS: Record<string, string> = {
  diploma: 'fa-solid fa-graduation-cap',
  degree:  'fa-solid fa-scroll',
  btech:   'fa-solid fa-microchip',
  mtech:   'fa-solid fa-flask',
};

export default function DegreeSwitcher() {
  const degree = useDegreeStore(s => s.degree);
  const cycleDegree = useDegreeStore(s => s.cycleDegree);
  const setDegree = useDegreeStore(s => s.setDegree);
  const current = DEGREE_CONFIG[degree];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="icon-btn"
        onClick={() => setOpen(!open)}
        title={`Switch degree — currently ${current.label}`}
        aria-label={`Degree: ${current.label}`}
      >
        <i className={DEGREE_ICONS[degree]} />
        <span>{current.shortLabel}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: '4px',
          width: '180px', background: 'var(--surface)', border: '1px solid var(--border-solid)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
          zIndex: 50, overflow: 'hidden',
        }}>
          {DEGREE_ORDER.map(d => {
            const cfg = DEGREE_CONFIG[d];
            const active = d === degree;
            return (
              <button
                key={d}
                onClick={() => { setDegree(d); setOpen(false); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 12px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: 'var(--text-xs)', border: 'none', cursor: 'pointer',
                  background: active ? 'var(--surface-2)' : 'transparent',
                  color: active ? 'var(--ink)' : 'var(--ink-3)',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <i className={DEGREE_ICONS[d]} style={{ fontSize: '0.7rem', width: '14px', textAlign: 'center' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: active ? 600 : 500, fontSize: 'var(--text-xs)' }}>{cfg.label}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--ink-4)' }}>{cfg.description}</div>
                </div>
                {active && <i className="fa-solid fa-check" style={{ fontSize: '0.65rem', color: 'var(--ink)' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
