import { useState, useEffect, useCallback } from 'react';
import { useHistoryStore, useUIStore } from '@/store/useStore';
import { showToast } from '@/components/Shared/Toast';

export default function DesktopHistorySidebar() {
  const { history, deleteEntry, clearAll } = useHistoryStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [search, setSearch] = useState('');

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

  const filtered = search
    ? history.filter(e => e.type.toLowerCase().includes(search.toLowerCase()) || e.score.toString().includes(search) || e.subtitle?.toLowerCase().includes(search.toLowerCase()))
    : history;

  return (
    <>
      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }} onClick={() => setSidebarOpen(false)} />}

      <aside style={{
        position: 'fixed', top: '50%', right: sidebarOpen ? 'var(--sp-5)' : '-400px',
        transform: 'translateY(-50%)',
        width: '340px', maxHeight: '80vh',
        zIndex: 50,
        background: 'var(--bg)', border: '1px solid var(--border-solid)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-2xl)',
        transition: 'right 0.3s var(--ease-out), opacity 0.2s ease',
        opacity: sidebarOpen ? 1 : 0,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-solid)' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>History</span>
          <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
            {history.length > 0 && <button className="icon-btn" style={{ width: '28px', height: '28px' }} onClick={() => { clearAll(); showToast('Cleared', 'info'); }} title="Clear all"><i className="fa-solid fa-trash-can" style={{ fontSize: '0.65rem' }} /></button>}
            <button className="icon-btn" style={{ width: '28px', height: '28px' }} onClick={() => setSidebarOpen(false)}><i className="fa-solid fa-xmark" style={{ fontSize: '0.7rem' }} /></button>
          </div>
        </div>

        <div style={{ padding: 'var(--sp-3)', borderBottom: '1px solid var(--border-solid)' }}>
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input" style={{ height: '34px', fontSize: 'var(--text-xs)' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-3)' }}>
          {filtered.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--sp-8) var(--sp-4)' }}>
              <div className="empty-icon" style={{ width: '40px', height: '40px', fontSize: 'var(--text-sm)' }}><i className="fa-solid fa-book-open" /></div>
              <div className="empty-title" style={{ fontSize: 'var(--text-xs)' }}>No saved results</div>
            </div>
          ) : (
            <div className="history-list">
              {filtered.map(e => (
                <div key={e.id} className="history-item" style={{ cursor: 'default', padding: 'var(--sp-3)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)', marginBottom: '2px' }}>
                      <span className="history-badge" style={{ minWidth: 'auto', padding: '1px 6px' }}>{e.type}</span>
                      <span className="history-score" style={{ fontSize: 'var(--text-sm)' }}>{e.score.toFixed(2)}</span>
                    </div>
                    {e.subtitle && <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.subtitle}</div>}
                  </div>
                  <button className="rm-btn" onClick={() => { deleteEntry(e.id); showToast('Deleted', 'info'); }} style={{ opacity: 0.5 }}><i className="fa-solid fa-xmark" style={{ fontSize: '0.6rem' }} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: 'var(--sp-3)', borderTop: '1px solid var(--border-solid)', fontSize: 'var(--text-2xs)', color: 'var(--ink-5)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Auto-saved</span>
          <span>{history.length} entries</span>
        </div>
      </aside>
    </>
  );
}
