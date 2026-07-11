import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useUIStore } from '@/store/useStore';
import { showToast } from '@/components/Shared/Toast';

interface Command {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  keys?: string[];
}

export default function CommandPalette() {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();

  const commands: Command[] = [
    { id: 'sgpa', label: 'Calculate SGPA', icon: 'fa-solid fa-layer-group', action: () => router.push('/calculator/sgpa'), keys: ['sgpa', 'semester'] },
    { id: 'cgpa', label: 'Calculate CGPA', icon: 'fa-solid fa-chart-line', action: () => router.push('/calculator/cgpa'), keys: ['cgpa', 'cumulative'] },
    { id: 'convert', label: 'Convert GPA ↔ Percentage', icon: 'fa-solid fa-arrow-right-arrow-left', action: () => router.push('/calculator/converter'), keys: ['convert', 'percentage'] },
    { id: 'predict', label: 'Predict Target CGPA', icon: 'fa-solid fa-bullseye', action: () => router.push('/predictor'), keys: ['predict', 'goal', 'target'] },
    { id: 'ocr', label: 'OCR — Scan Marksheet', icon: 'fa-solid fa-camera', action: () => router.push('/ocr'), keys: ['ocr', 'scan', 'image', 'upload'] },
    { id: 'history', label: 'View History', icon: 'fa-solid fa-clock-rotate-left', action: () => router.push('/history'), keys: ['history', 'past'] },
    { id: 'export', label: 'Export PDF Report', icon: 'fa-solid fa-file-pdf', action: () => router.push('/export'), keys: ['export', 'pdf', 'report'] },
    { id: 'dashboard', label: 'Go to Dashboard', icon: 'fa-solid fa-house', action: () => router.push('/'), keys: ['home', 'dashboard', 'main'] },
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
        setQuery('');
        setSelectedIdx(0);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const filtered = query
    ? commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.keys?.some(k => k.toLowerCase().includes(query.toLowerCase()))
      )
    : commands;

  const execute = useCallback((cmd: Command) => {
    cmd.action();
    setCommandPaletteOpen(false);
    setQuery('');
  }, [setCommandPaletteOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[selectedIdx]) {
      e.preventDefault();
      execute(filtered[selectedIdx]);
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]" onClick={() => setCommandPaletteOpen(false)} />
      
      {/* Palette */}
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[1000]" role="dialog" aria-label="Command palette">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
            <i className="fa-solid fa-magnifying-glass text-[var(--ink-faint)]" />
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-[var(--ink)] text-base placeholder:text-[var(--ink-faint)]"
              placeholder="Type a command or search…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
              onKeyDown={handleKeyDown}
            />
            <kbd className="px-2 py-1 rounded text-[10px] font-mono bg-[var(--surface2)] border border-[var(--border)] text-[var(--ink-faint)]">ESC</kbd>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto p-2">
            {filtered.length === 0 && (
              <div className="text-center py-8 text-[var(--ink-faint)] text-sm">
                No commands found
              </div>
            )}
            {filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  i === selectedIdx
                    ? 'bg-[var(--violet-soft)] text-[var(--violet)]'
                    : 'text-[var(--ink-mid)] hover:bg-[var(--surface2)]'
                }`}
                onClick={() => execute(cmd)}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <i className={`${cmd.icon} w-5 text-center`} />
                <span>{cmd.label}</span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex gap-4 p-3 border-t border-[var(--border)] text-[10px] text-[var(--ink-faint)]">
            <span><kbd className="px-1 rounded bg-[var(--surface2)]">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 rounded bg-[var(--surface2)]">↵</kbd> Select</span>
            <span><kbd className="px-1 rounded bg-[var(--surface2)]">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </>
  );
}
