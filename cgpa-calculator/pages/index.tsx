import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';
import Tabs from '@/components/Shared/Tabs';
import HistorySidebar from '@/components/History/HistorySidebar';
import { useHistoryStore, useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

const QUICK_ACTIONS = [
  { path: '/calculator/sgpa', icon: 'fa-solid fa-layer-group', label: 'SGPA', desc: 'Calculate Semester GPA' },
  { path: '/calculator/cgpa', icon: 'fa-solid fa-chart-line', label: 'CGPA', desc: 'Cumulative GPA' },
  { path: '/calculator/converter', icon: 'fa-solid fa-arrow-right-arrow-left', label: 'Convert', desc: 'GPA ↔ Percentage' },
  { path: '/predictor', icon: 'fa-solid fa-bullseye', label: 'Predict', desc: 'Target GPA Goal' },
  { path: '/export', icon: 'fa-solid fa-file-pdf', label: 'Export', desc: 'PDF Report' },
];

export default function Dashboard() {
  const router = useRouter();
  const history = useHistoryStore(s => s.history);
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  const avgScore = history.length > 0
    ? history.reduce((s, e) => s + e.score, 0) / history.length
    : 0;

  return (
    <>
      <Head>
        <title>{label} GPA Suite — CGPA · SGPA · Percentage Calculator</title>
        <meta name="description" content={`Free ${label} CGPA, SGPA and Percentage calculator with OCR, PDF export, and more.`} />
      </Head>

      <div className="app">
        <Header />
        <Tabs />

        <main className="panel active space-y-6">
          {/* Hero */}
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">
              Your Academic Companion
            </h2>
            <p className="text-sm text-[var(--ink-mid)] max-w-md mx-auto">
              Calculate SGPA, CGPA, convert to percentage, predict goals, scan marksheets, and export reports — all offline.
            </p>
          </div>

          {/* Stats */}
          {history.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-[var(--surface)] border border-[var(--border)] text-center">
                <div className="text-xs uppercase tracking-wider text-[var(--ink-mid)] mb-1">Total</div>
                <div className="text-2xl font-bold text-[var(--ink)]">{history.length}</div>
                <div className="text-[10px] text-[var(--ink-faint)]">Calculations</div>
              </div>
              <div className="p-4 bg-[var(--surface)] border border-[var(--border)] text-center">
                <div className="text-xs uppercase tracking-wider text-[var(--ink-mid)] mb-1">Average</div>
                <div className="text-2xl font-bold text-[var(--ink)]">{avgScore.toFixed(2)}</div>
                <div className="text-[10px] text-[var(--ink-faint)]">Score</div>
              </div>
              <div className="p-4 bg-[var(--surface)] border border-[var(--border)] text-center">
                <div className="text-xs uppercase tracking-wider text-[var(--ink-mid)] mb-1">SGPA</div>
                <div className="text-2xl font-bold text-[var(--ink)]">
                  {history.filter(e => e.type === 'SGPA').length}
                </div>
                <div className="text-[10px] text-[var(--ink-faint)]">Calculated</div>
              </div>
              <div className="p-4 bg-[var(--surface)] border border-[var(--border)] text-center">
                <div className="text-xs uppercase tracking-wider text-[var(--ink-mid)] mb-1">CGPA</div>
                <div className="text-2xl font-bold text-[var(--ink)]">
                  {history.filter(e => e.type === 'CGPA').length}
                </div>
                <div className="text-[10px] text-[var(--ink-faint)]">Calculated</div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink)] mb-4 flex items-center gap-2">
              <i className="fa-solid fa-bolt text-[var(--ink-mid)]" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <div
                  key={action.path}
                  className="p-4 bg-[var(--surface)] border border-[var(--border)] cursor-pointer hover:bg-[var(--surface2)] text-center"
                  onClick={() => router.push(action.path)}
                >
                  <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2 bg-[var(--surface2)] text-[var(--ink-mid)]">
                    <i className={action.icon} />
                  </div>
                  <div className="font-semibold text-sm text-[var(--ink)]">{action.label}</div>
                  <div className="text-[10px] text-[var(--ink-faint)] mt-0.5">{action.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent History */}
          {history.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-[var(--ink-mid)]" />
                Recent Calculations
              </h3>
              <div className="space-y-2">
                {history.slice(0, 5).map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] cursor-pointer hover:bg-[var(--surface2)]"
                    onClick={() => router.push('/history')}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2 py-1 text-[var(--ink-mid)] bg-[var(--surface2)]">
                        {entry.type}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-[var(--ink)]">{entry.score.toFixed(2)}</div>
                        {entry.subtitle && <div className="text-[10px] text-[var(--ink-faint)]">{entry.subtitle}</div>}
                      </div>
                    </div>
                    <div className="text-[10px] text-[var(--ink-faint)]">{entry.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
