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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = history.filter(e => {
    const matchesSearch = !searchQuery || 
      e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.score.toString().includes(searchQuery) ||
      (e.subtitle && e.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'ALL' || e.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleBulkDelete = useCallback(() => {
    const count = selectedIds.size;
    selectedIds.forEach(id => deleteEntry(id));
    setSelectedIds(new Set());
    showToast(`Deleted ${count} entries`, 'info');
  }, [selectedIds, deleteEntry]);

  const handleClearAll = useCallback(() => {
    if (confirm('Clear all history? This cannot be undone.')) {
      clearAll();
      showToast('All history cleared', 'info');
    }
  }, [clearAll]);

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

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (Array.isArray(data)) {
            data.forEach((entry: any) => {
              useHistoryStore.getState().addEntry(entry);
            });
            showToast(`Imported ${data.length} entries`, 'success');
          }
        } catch {
          showToast('Invalid JSON file', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  return (
    <>
      <Head>
        <title>History — {DEGREE_CONFIG[useDegreeStore.getState().degree].label} GPA Suite</title>
        <meta name="description" content="View your calculation history." />
      </Head>

      <div className="app">
        <Header />
        <Tabs />
        
        <main className="panel active">
          <div className="sec-head">
            <div className="sec-title">
              <span className="sec-icon"><i className="fa-solid fa-clock-rotate-left" /></span>
              <span>Calculation History ({filtered.length})</span>
            </div>
            <div className="sec-actions">
              <button className="btn text-xs" onClick={handleExport}><i className="fa-solid fa-download" /> Export</button>
              <button className="btn text-xs" onClick={handleImport}><i className="fa-solid fa-upload" /> Import</button>
              {history.length > 0 && (
                <button className="btn text-xs" onClick={handleClearAll}><i className="fa-solid fa-trash-can" /> Clear All</button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] text-sm" />
                <input
                  type="text"
                  placeholder="Search history…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--ink)] outline-none"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--ink)] outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="SGPA">SGPA</option>
              <option value="CGPA">CGPA</option>
              <option value="CONVERTER">Converter</option>
              <option value="PREDICTOR">Predictor</option>
            </select>
            {selectedIds.size > 0 && (
              <button className="btn text-xs" onClick={handleBulkDelete}>
                <i className="fa-solid fa-trash-can" /> Delete {selectedIds.size}
              </button>
            )}
          </div>

          {/* List */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-[var(--ink-faint)]">
                <i className="fa-solid fa-book-open text-3xl mb-3 opacity-50" />
                <p className="text-sm">No history found</p>
              </div>
            ) : (
              filtered.map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 p-3 bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface2)] cursor-pointer"
                  onClick={() => toggleSelect(entry.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(entry.id)}
                    onChange={() => toggleSelect(entry.id)}
                    className="w-4 h-4"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-xs font-bold px-2 py-1 bg-[var(--surface2)] text-[var(--ink-mid)]">
                    {entry.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-[var(--ink)]">{entry.score.toFixed(2)}</span>
                      {entry.percentage !== undefined && (
                        <span className="text-xs text-[var(--ink-mid)]">{entry.percentage.toFixed(2)}%</span>
                      )}
                    </div>
                    {entry.subtitle && (
                      <div className="text-[10px] text-[var(--ink-faint)] truncate">{entry.subtitle}</div>
                    )}
                  </div>
                  <div className="text-[10px] text-[var(--ink-faint)]">{entry.date}</div>
                  <button
                    className="p-1.5 hover:bg-[var(--surface3)] text-[var(--ink-faint)] hover:text-[var(--ink)]"
                    onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); showToast('Entry deleted', 'info'); }}
                  >
                    <i className="fa-solid fa-xmark text-xs" />
                  </button>
                </div>
              ))
            )}
          </div>
        </main>

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
