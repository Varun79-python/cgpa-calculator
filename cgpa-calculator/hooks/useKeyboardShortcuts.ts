import { useEffect } from 'react';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  handler: (e: KeyboardEvent) => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = (e.target as HTMLElement)?.tagName === 'INPUT' || 
                      (e.target as HTMLElement)?.tagName === 'TEXTAREA' ||
                      (e.target as HTMLElement)?.isContentEditable;

      for (const shortcut of shortcuts) {
        const ctrlOrMeta = shortcut.ctrl || shortcut.meta;
        const matchesCtrl = ctrlOrMeta ? (e.ctrlKey || e.metaKey) : !(e.ctrlKey || e.metaKey);
        const matchesShift = shortcut.shift ? e.shiftKey : !e.shiftKey;

        if (e.key.toLowerCase() === shortcut.key.toLowerCase() && matchesCtrl && matchesShift) {
          // Don't trigger shortcuts when typing in inputs (unless special)
          if (isInput && !['Escape', 'Enter'].includes(e.key)) continue;
          e.preventDefault();
          shortcut.handler(e);
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

export function useCtrlP(handler: () => void) {
  useKeyboardShortcuts([
    { key: 'p', ctrl: true, handler },
  ]);
}

export function useEscape(handler: () => void) {
  useKeyboardShortcuts([
    { key: 'Escape', handler },
  ]);
}
