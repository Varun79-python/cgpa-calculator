import Head from 'next/head';
import { useState, useCallback } from 'react';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';
import Tabs from '@/components/Shared/Tabs';
import HistorySidebar from '@/components/History/HistorySidebar';
import { useHistoryStore, useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';
import { showToast } from '@/components/Shared/Toast';

export default function HistoryPage() {
  const { history, deleteEntry, clearAll } = useHistoryStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filtered = history.filter(e => {
    const matchSearch = !search || e.type.toLowerCase().includes(search.toLowerCase()) || e.score.toString().includes(search) || (e.subtitle?.toLowerCase().includes(search.toLowerCase()));
    const matchType = filter === 'ALL' || e.type === filter;
    return matchSearch && matchType;
  });

  return (
    <>
      <Head><title>History — {DEGREE_CONFIG[useDegreeStore.getState().degree].label} CGPA Calculator</title></Head>
      <div className="app">
        <Header />
        <Tabs />
        <main id="main-content" className="panel">
          <div className="sec-header">
            <span className="sec-label">
              <span className="sec-icon"><i className="fa-solid fa-clock-rotate-left" /></span>
              History ({filtered.length})
            </span>
            <div className="sec-actions">
              <button className="btn btn-sm" onClick={() => { const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `gpa-history-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url); showToast('Exported', 'success'); }}>
                <i className="fa-solid fa-download" />
              </button>
              {history.length > 0 && (
                <button className="btn btn-sm" onClick={() => { if (confirm('Clear all?')) { clearAll(); showToast('Cleared', 'info'); } }}>
                  <i className="fa-solid fa-trash-can" />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input" style={{ flex: 1, minWidth: '140px' }} />
            <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
              {['ALL', 'SGPA', 'CGPA', 'CONVERTER', 'PREDICTOR'].map(t => (
                <button key={t} onClick={() => setFilter(t)} className="btn btn-sm" style={{
                  background: filter === t ? 'var(--ink)' : 'var(--surface)',
                  color: filter === t ? 'var(--surface)' : 'var(--ink-3)',
                  borderColor: filter === t ? 'var(--ink)' : 'var(--border-solid)',
                  textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 'var(--text-2xs)',
                }}>{t === 'ALL' ? 'All' : t}</button>
              ))}
            </div>
          </div>

          <div style={{ maxHeight: '55vh', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><i className="fa-solid fa-book-open" /></div>
                <div className="empty-title">No history found</div>
                <div className="empty-desc">Your calculations will appear here</div>
              </div>
            ) : (
              <div className="history-list">
                {filtered.map(e => (
                  <div key={e.id} className="history-item" style={{ cursor: 'default' }}>
                    <span className="history-badge">{e.type}</span>
                    <span className="history-score">{e.score.toFixed(2)}</span>
                    {e.percentage !== undefined && <span className="history-meta">{e.percentage.toFixed(1)}%</span>}
                    {e.subtitle && <span className="history-meta">{e.subtitle}</span>}
                    <span className="history-date">{e.date}</span>
                    <button className="rm-btn" onClick={() => { deleteEntry(e.id); showToast('Deleted', 'info'); }}>
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
      <HistorySidebar />
    </>
  );
}
