import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';
import Tabs from '@/components/Shared/Tabs';
import ReportTemplate from '@/components/Export/ReportTemplate';
import HistorySidebar from '@/components/History/HistorySidebar';
import { useHistoryStore, useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';
import { CalculationResult, Subject } from '@/types';

export default function ExportPage() {
  const { history } = useHistoryStore();
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;
  const [selectedEntry, setSelectedEntry] = useState('latest');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [type, setType] = useState('GPA');
  const [subjects, setSubjects] = useState<Subject[] | undefined>(undefined);

  useEffect(() => {
    if (selectedEntry === 'latest' && history.length > 0) {
      const e = history[0];
      setResult({ num: e.score, pct: e.percentage, meta: e.subtitle });
      setType(e.type); setSubjects(undefined);
    } else if (selectedEntry !== 'latest') {
      const e = history.find(x => x.id === selectedEntry);
      if (e) { setResult({ num: e.score, pct: e.percentage, meta: e.subtitle }); setType(e.type); setSubjects(e.subjects); }
    } else { setResult(null); setType('GPA'); setSubjects(undefined); }
  }, [selectedEntry, history]);

  return (
    <>
      <Head><title>Export — {label} GPA Suite</title></Head>
      <div className="app">
        <Header />
        <Tabs />
        <main id="main-content" className="panel">
          <div className="sec-header">
            <span className="sec-label">
              <span className="sec-icon"><i className="fa-solid fa-file-pdf" /></span>
              Export Report
            </span>
          </div>

          {history.length > 0 && (
            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-4)', marginBottom: 'var(--sp-2)' }}>Select Calculation</label>
              <select value={selectedEntry} onChange={(e) => setSelectedEntry(e.target.value)} className="input">
                <option value="latest">Latest Calculation</option>
                {history.map(e => <option key={e.id} value={e.id}>{e.type}: {e.score.toFixed(2)} — {e.date}</option>)}
              </select>
            </div>
          )}

          {result ? <ReportTemplate result={result} type={type} subjects={subjects} /> : (
            <div className="empty-state">
              <div className="empty-icon"><i className="fa-solid fa-file-pdf" /></div>
              <div className="empty-title">No calculations yet</div>
              <div className="empty-desc">Calculate something first, then export.</div>
            </div>
          )}
        </main>
        <Footer />
      </div>
      <HistorySidebar />
    </>
  );
}
