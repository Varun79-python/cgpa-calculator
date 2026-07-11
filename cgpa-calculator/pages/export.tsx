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
  const [selectedEntry, setSelectedEntry] = useState<string>('latest');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [type, setType] = useState('GPA');
  const [subjects, setSubjects] = useState<Subject[] | undefined>(undefined);

  useEffect(() => {
    if (selectedEntry === 'latest' && history.length > 0) {
      const entry = history[0];
      setResult({ num: entry.score, pct: entry.percentage, meta: entry.subtitle });
      setType(entry.type);
      setSubjects(undefined);
    } else if (selectedEntry !== 'latest') {
      const entry = history.find(e => e.id === selectedEntry);
      if (entry) {
        setResult({ num: entry.score, pct: entry.percentage, meta: entry.subtitle });
        setType(entry.type);
        setSubjects(entry.subjects);
      }
    } else {
      setResult(null);
      setType('GPA');
      setSubjects(undefined);
    }
  }, [selectedEntry, history]);

  return (
    <>
      <Head>
        <title>Export PDF Report — {label} GPA Suite</title>
        <meta name="description" content={`Generate a professional PDF academic report for ${label} students.`} />
      </Head>

      <div className="app">
        <Header />
        <Tabs />
        
        <main className="panel active space-y-6">
          <div className="sec-head">
            <div className="sec-title">
              <span className="sec-icon"><i className="fa-solid fa-file-pdf" /></span>
              <span>Export Academic Report</span>
            </div>
          </div>

          {/* Select entry to export */}
          {history.length > 0 && (
            <div className="p-4 bg-[var(--surface)] border border-[var(--border)]">
              <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ink-mid)] mb-2">
                Select Calculation to Export
              </label>
              <select
                value={selectedEntry}
                onChange={(e) => setSelectedEntry(e.target.value)}
                className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--ink)] text-sm"
              >
                <option value="latest">Latest Calculation</option>
                {history.map(entry => (
                  <option key={entry.id} value={entry.id}>
                    {entry.type}: {entry.score.toFixed(2)} — {entry.date}
                  </option>
                ))}
              </select>
            </div>
          )}

          {result ? (
            <ReportTemplate result={result} type={type} subjects={subjects} />
          ) : (
            <div className="text-center py-12 text-[var(--ink-faint)]">
              <i className="fa-solid fa-file-pdf text-4xl mb-3 opacity-50" />
              <p>No calculations yet. Calculate something first, then come back to export.</p>
            </div>
          )}
        </main>

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
