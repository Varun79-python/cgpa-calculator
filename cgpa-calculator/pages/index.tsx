import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';
import Tabs from '@/components/Shared/Tabs';
import HistorySidebar from '@/components/History/HistorySidebar';
import { useHistoryStore, useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

const ACTIONS = [
  { path: '/calculator/sgpa', icon: 'fa-solid fa-layer-group', label: 'SGPA', desc: 'Semester GPA' },
  { path: '/calculator/cgpa', icon: 'fa-solid fa-chart-line', label: 'CGPA', desc: 'Cumulative GPA' },
  { path: '/calculator/converter', icon: 'fa-solid fa-arrow-right-arrow-left', label: 'Convert', desc: 'GPA ↔ %' },
  { path: '/predictor', icon: 'fa-solid fa-bullseye', label: 'Predict', desc: 'Target Goal' },
  { path: '/export', icon: 'fa-solid fa-file-pdf', label: 'Export', desc: 'PDF Report' },
];

export default function Dashboard() {
  const router = useRouter();
  const history = useHistoryStore(s => s.history);
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  const avg = history.length > 0 ? history.reduce((s, e) => s + e.score, 0) / history.length : 0;
  const best = history.length > 0 ? Math.max(...history.map(e => e.score)) : 0;

  return (
    <>
      <Head>
        <title>{label} CGPA Calculator</title>
        <meta name="description" content={`Calculate SGPA, CGPA, convert to percentage, predict goals, and export reports — all offline.`} />
      </Head>

      <div className="app">
        <Header />
        <Tabs />

        <main id="main-content">
          <div className="hero">
            <div className="hero-tag">Free for all students</div>
            <h2>Your Academic Companion</h2>
            <p>Calculate SGPA, CGPA, convert to percentage, predict goals, and export reports — all offline.</p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => router.push('/calculator/sgpa')}>
                <i className="fa-solid fa-calculator" /> Calculate SGPA
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => router.push('/calculator/cgpa')}>
                <i className="fa-solid fa-chart-line" /> Calculate CGPA
              </button>
            </div>
          </div>

          <div className="panel">
            {history.length > 0 && (
              <div className="stats-row">
                <div className="stat-item">
                  <div className="stat-value">{history.length}</div>
                  <div className="stat-label">Calculations</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{avg.toFixed(2)}</div>
                  <div className="stat-label">Average</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{best.toFixed(2)}</div>
                  <div className="stat-label">Best</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{history.filter(e => e.type === 'SGPA').length}</div>
                  <div className="stat-label">SGPAs</div>
                </div>
              </div>
            )}

            <div className="sec-header">
              <span className="sec-label">
                <span className="sec-icon"><i className="fa-solid fa-bolt" /></span>
                Quick Actions
              </span>
            </div>
            <div className="actions-grid">
              {ACTIONS.map(a => (
                <div key={a.path} className="action-card" onClick={() => router.push(a.path)}>
                  <div className="action-icon"><i className={a.icon} /></div>
                  <div className="action-label">{a.label}</div>
                  <div className="action-desc">{a.desc}</div>
                </div>
              ))}
            </div>

            {history.length > 0 && (
              <div style={{ marginTop: 'var(--sp-6)' }}>
                <div className="sec-header">
                  <span className="sec-label">
                    <span className="sec-icon"><i className="fa-solid fa-clock-rotate-left" /></span>
                    Recent
                  </span>
                </div>
                <div className="history-list">
                  {history.slice(0, 5).map(e => (
                    <div key={e.id} className="history-item" onClick={() => router.push('/history')}>
                      <span className="history-badge">{e.type}</span>
                      <span className="history-score">{e.score.toFixed(2)}</span>
                      {e.subtitle && <span className="history-meta">{e.subtitle}</span>}
                      <span className="history-date">{e.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {history.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon"><i className="fa-solid fa-graduation-cap" /></div>
                <div className="empty-title">Welcome to CGPA Calculator</div>
                <div className="empty-desc">Start by calculating your first SGPA or CGPA</div>
                <button className="btn btn-primary" onClick={() => router.push('/calculator/sgpa')}>
                  <i className="fa-solid fa-calculator" /> Get Started
                </button>
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
