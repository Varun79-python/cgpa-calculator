import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';
import Tabs from '@/components/Shared/Tabs';
import BannerCarousel from '@/components/Shared/BannerCarousel';
import HistorySidebar from '@/components/History/HistorySidebar';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

const FEATURES = [
  { icon: 'fa-solid fa-layer-group', label: 'SGPA Calculator', desc: 'Calculate semester GPA with subject-wise grades and credits' },
  { icon: 'fa-solid fa-chart-line', label: 'CGPA Calculator', desc: 'Track cumulative GPA across all semesters' },
  { icon: 'fa-solid fa-arrow-right-arrow-left', label: 'GPA ↔ Percentage', desc: 'Convert between GPA and percentage instantly' },
  { icon: 'fa-solid fa-bullseye', label: 'Goal Predictor', desc: 'Find out what SGPA you need to reach your target' },
  { icon: 'fa-solid fa-file-pdf', label: 'PDF Export', desc: 'Download professional academic reports' },
  { icon: 'fa-solid fa-camera', label: 'OCR Scan', desc: 'Scan marksheet to auto-fill subjects' },
];

const UNIVERSITIES = [
  'UGC CBCS', 'JNTU', 'Anna University', 'VTU', 'Mumbai University',
  'KTU', 'GTU', 'MAKAUT', 'IIT/NIT', 'Custom'
];

export default function Dashboard() {
  const router = useRouter();
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <>
      <Head>
        <title>{label} CGPA Calculator — SGPA · Percentage · GPA</title>
        <meta name="description" content={`Calculate SGPA, CGPA, convert to percentage, predict goals, and export reports — all offline. Free for ${label} students.`} />
      </Head>

      <div className="app">
        <Header />
        <Tabs />

        {/* Banner Carousel */}
        <div className="dash-section">
          <BannerCarousel folder="/banners" interval={4000} />
        </div>

        {/* Features Grid */}
        <div className="dash-section" style={{ borderTop: '1px solid var(--border-solid)' }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--ink-3)',
            marginBottom: 'var(--sp-4)',
            textAlign: 'center',
          }}>
            Everything you need
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--sp-4)',
          }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                onClick={() => {
                  if (f.label.includes('SGPA')) router.push('/calculator/sgpa');
                  else if (f.label.includes('CGPA') && !f.label.includes('GPA ↔')) router.push('/calculator/cgpa');
                  else if (f.label.includes('GPA ↔')) router.push('/calculator/converter');
                  else if (f.label.includes('Goal')) router.push('/predictor');
                  else if (f.label.includes('PDF')) router.push('/export');
                  else if (f.label.includes('OCR')) router.push('/calculator/sgpa');
                }}
                style={{
                  padding: 'var(--sp-5) var(--sp-4)',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-solid)',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--ink-faint)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-solid)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  margin: '0 auto var(--sp-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--ink)',
                  fontSize: '1.1rem',
                }}>
                  <i className={f.icon} />
                </div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                  {f.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--ink-3)', lineHeight: 1.5 }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Universities */}
        <div className="dash-section" style={{ borderTop: '1px solid var(--border-solid)' }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--ink-3)',
            marginBottom: 'var(--sp-4)',
            textAlign: 'center',
          }}>
            Supports all Indian universities
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--sp-2)',
            justifyContent: 'center',
          }}>
            {UNIVERSITIES.map((u, i) => (
              <span key={i} style={{
                padding: '5px 12px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-solid)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.7rem',
                fontWeight: 500,
                color: 'var(--ink)',
              }}>
                {u}
              </span>
            ))}
          </div>
        </div>

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
