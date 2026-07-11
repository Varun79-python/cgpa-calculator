import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';
import Tabs from '@/components/Shared/Tabs';
import Banner from '@/components/Shared/Banner';
import Hero from '@/components/Shared/Hero';
import HistorySidebar from '@/components/History/HistorySidebar';
import { useHistoryStore, useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

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
        <title>{label} CGPA Calculator — SGPA · Percentage · GPA</title>
        <meta name="description" content={`Calculate SGPA, CGPA, convert to percentage, predict goals, and export reports — all offline. Free for ${label} students.`} />
      </Head>

      <div className="app" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
        <Header />
        <Tabs />

        {/* Premium Hero */}
        <Hero />

        {/* Banner */}
        <div style={{ padding: 'var(--sp-4)' }}>
          <Banner src="/banner.jpg" alt="CGPA Calculator — Calculate SGPA, CGPA, Percentage" />
        </div>

        {/* Content */}
        <div className="panel">
          {history.length > 0 && (
            <>
              <div className="sec-header">
                <span className="sec-label">
                  <span className="sec-icon"><i className="fa-solid fa-chart-simple" /></span>
                  Your Stats
                </span>
              </div>
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
            </>
          )}

          {history.length > 0 && (
            <div style={{ marginTop: 'var(--sp-5)' }}>
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

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
