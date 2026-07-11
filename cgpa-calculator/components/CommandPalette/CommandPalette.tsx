import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useUIStore } from '@/store/useStore';

interface Command { id: string; label: string; icon: string; action: () => void; keys?: string[]; }

export default function CommandPalette() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();

  const commands: Command[] = [
    { id: 'sgpa', label: 'Calculate SGPA', icon: 'fa-solid fa-layer-group', action: () => router.push('/calculator/sgpa'), keys: ['sgpa', 'semester'] },
    { id: 'cgpa', label: 'Calculate CGPA', icon: 'fa-solid fa-chart-line', action: () => router.push('/calculator/cgpa'), keys: ['cgpa', 'cumulative'] },
    { id: 'convert', label: 'Convert GPA ↔ %', icon: 'fa-solid fa-arrow-right-arrow-left', action: () => router.push('/calculator/converter'), keys: ['convert', 'percentage'] },
    { id: 'predict', label: 'Predict Target', icon: 'fa-solid fa-bullseye', action: () => router.push('/predictor'), keys: ['predict', 'goal'] },
    { id: 'history', label: 'View History', icon: 'fa-solid fa-clock-rotate-left', action: () => router.push('/history'), keys: ['history'] },
    { id: 'export', label: 'Export PDF', icon: 'fa-solid fa-file-pdf', action: () => router.push('/export'), keys: ['export', 'pdf'] },
    { id: 'home', label: 'Dashboard', icon: 'fa-solid fa-house', action: () => router.push('/'), keys: ['home', 'dashboard'] },
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') { e.preventDefault(); setCommandPaletteOpen(!commandPaletteOpen); setQuery(''); setSelected(0); }
      if (e.key === 'Escape' && commandPaletteOpen) { setCommandPaletteOpen(false); setQuery(''); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => { if (commandPaletteOpen) setTimeout(() => inputRef.current?.focus(), 50); }, [commandPaletteOpen]);

  const filtered = query ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || c.keys?.some(k => k.includes(query.toLowerCase()))) : commands;

  const execute = useCallback((cmd: Command) => { cmd.action(); setCommandPaletteOpen(false); setQuery(''); }, [setCommandPaletteOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) { e.preventDefault(); execute(filtered[selected]); }
  };

  if (!commandPaletteOpen) return null;

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 999 }} onClick={() => setCommandPaletteOpen(false)} />
      <div style={{ position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '420px', zIndex: 1000 }} role="dialog" aria-label="Command palette">
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-2xl)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--ink-4)', fontSize: '0.8rem' }} />
            <input ref={inputRef} type="text" placeholder="Type a command..." value={query} onChange={(e) => { setQuery(e.target.value); setSelected(0); }} onKeyDown={handleKeyDown}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--ink)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)' }} />
            <kbd style={{ padding: '2px 6px', borderRadius: 'var(--radius-xs)', fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-mono)', background: 'var(--surface-2)', border: '1px solid var(--border-solid)', color: 'var(--ink-5)' }}>ESC</kbd>
          </div>
          <div style={{ maxHeight: '260px', overflowY: 'auto', padding: 'var(--sp-1)' }}>
            {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--ink-5)', fontSize: 'var(--text-xs)' }}>No commands found</div>}
            {filtered.map((cmd, i) => (
              <button key={cmd.id} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: '8px var(--sp-3)',
                borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: i === selected ? 'var(--surface-2)' : 'transparent', color: i === selected ? 'var(--ink)' : 'var(--ink-3)',
                transition: 'background 0.1s ease',
              }} onClick={() => execute(cmd)} onMouseEnter={() => setSelected(i)}>
                <i className={cmd.icon} style={{ width: '16px', textAlign: 'center', fontSize: '0.75rem' }} />
                <span>{cmd.label}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-4)', padding: 'var(--sp-2) var(--sp-4)', borderTop: '1px solid var(--border)', fontSize: 'var(--text-2xs)', color: 'var(--ink-5)' }}>
            <span><kbd style={{ padding: '1px 4px', borderRadius: '3px', background: 'var(--surface-2)' }}>↑↓</kbd> Navigate</span>
            <span><kbd style={{ padding: '1px 4px', borderRadius: '3px', background: 'var(--surface-2)' }}>↵</kbd> Select</span>
            <span><kbd style={{ padding: '1px 4px', borderRadius: '3px', background: 'var(--surface-2)' }}>Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </>
  );
}
