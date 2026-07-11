import { useState, useEffect, useCallback } from 'react';
import { useHistoryStore, useUIStore } from '@/store/useStore';
import { showToast } from '@/components/Shared/Toast';

interface HistorySidebarProps {
  onRestore?: (entry: any) => void;
}

export default function HistorySidebar({ onRestore }: HistorySidebarProps) {
  const { history, deleteEntry, clearAll } = useHistoryStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'h') {
        e.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [sidebarOpen, setSidebarOpen]);

  const filtered = searchQuery
    ? history.filter(e =>
        e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.score.toString().includes(searchQuery) ||
        (e.subtitle && e.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : history;

  const handleClearAll = useCallback(() => {
    if (confirm('Clear all history?')) {
      clearAll();
      showToast('History cleared', 'info');
    }
  }, [clearAll]);

  const handleDelete = useCallback((id: string) => {
    const entry = history.find(e => e.id === id);
    deleteEntry(id);
    showToast('Entry deleted', 'info', () => {
      if (entry) useHistoryStore.getState().addEntry(entry);
    });
  }, [history, deleteEntry]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cgpa-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('History exported as JSON', 'success');
  }, [history]);

  return (
    <>
      {/* Toggle button */}
      <button
        className="fixed top-4 right-4 z-40 w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-mid)] hover:text-[var(--ink)] transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        title="History (Ctrl+Shift+H)"
        aria-label="Toggle history sidebar"
      >
        <i className="fa-solid fa-clock-rotate-left" />
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-[var(--violet)] text-white text-[10px] font-bold">
            {history.length}
          </span>
        )}
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-[var(--bg)] border-l border-[var(--border)] transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <h3 className="font-semibold flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-[var(--violet)]" />
              History
            </h3>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <>
                  <button onClick={handleExport} className="p-2 rounded-lg hover:bg-[var(--surface2)] text-[var(--ink-mid)]" title="Export JSON">
                    <i className="fa-solid fa-download" />
                  </button>
                  <button onClick={handleClearAll} className="p-2 rounded-lg hover:bg-[var(--surface2)] text-[var(--red)]" title="Clear all">
                    <i className="fa-solid fa-trash-can" />
                  </button>
                </>
              )}
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-[var(--surface2)] text-[var(--ink-mid)]">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-[var(--border)]">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] text-sm" />
              <input
                type="text"
                placeholder="Search history…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--ink)] outline-none"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-[var(--ink-faint)]">
                <i className="fa-solid fa-book-open text-3xl mb-3 opacity-50" />
                <p className="text-sm">No saved results yet.</p>
                <p className="text-xs">Calculations save automatically.</p>
              </div>
            ) : (
              filtered.map(entry => (
                <div
                  key={entry.id}
                  className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] hover:border-[var(--violet)]/30 cursor-pointer transition-all group relative"
                  onClick={() => {
                    onRestore?.(entry);
                    setSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--violet)]">
                      {entry.type}
                    </span>
                    <span className="text-[10px] text-[var(--ink-faint)]">{entry.date}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[var(--ink)]">{entry.score.toFixed(2)}</span>
                    {entry.percentage !== undefined && (
                      <span className="text-sm text-[var(--ink-mid)]">{entry.percentage.toFixed(2)}%</span>
                    )}
                  </div>
                  {entry.subtitle && (
                    <div className="text-xs text-[var(--ink-faint)] mt-1">{entry.subtitle}</div>
                  )}
                  <button
                    className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[var(--surface3)] text-[var(--ink-faint)] hover:text-[var(--red)] transition-all"
                    onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                    title="Delete"
                  >
                    <i className="fa-solid fa-xmark text-xs" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[var(--border)] text-[10px] text-[var(--ink-faint)] flex justify-between">
            <span>Auto-saved locally</span>
            <span>{history.length} entries</span>
          </div>
        </div>
      </aside>
    </>
  );
}
