import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const STATS = [
  { value: '50K+', label: 'Students', icon: 'fa-solid fa-users' },
  { value: '11', label: 'Universities', icon: 'fa-solid fa-building-columns' },
  { value: '100%', label: 'Offline', icon: 'fa-solid fa-wifi-slash' },
  { value: '4.9', label: 'Rating', icon: 'fa-solid fa-star' },
];

const FEATURES = [
  { icon: 'fa-solid fa-calculator', label: 'SGPA Calculator', desc: 'Semester-wise' },
  { icon: 'fa-solid fa-chart-line', label: 'CGPA Tracker', desc: 'Cumulative' },
  { icon: 'fa-solid fa-arrow-right-arrow-left', label: 'GPA ↔ %', desc: 'Instant convert' },
  { icon: 'fa-solid fa-bullseye', label: 'Goal Predictor', desc: 'Plan ahead' },
  { icon: 'fa-solid fa-file-pdf', label: 'PDF Export', desc: 'Print ready' },
  { icon: 'fa-solid fa-camera', label: 'OCR Scan', desc: 'Auto-fill' },
];

export default function Hero() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="hero-container">
      {/* Animated Background */}
      <div className="hero-bg">
        <div className="hero-aurora" />
        <div className="hero-grid" />
        <div className="hero-glow" />
      </div>

      {/* Main Content */}
      <div className="hero-content">
        {/* Badge */}
        <div className="hero-badge">
          <i className="fa-solid fa-sparkles" />
          <span>Trusted by 50,000+ Students</span>
        </div>

        {/* Heading */}
        <h1 className="hero-title">
          <span className="hero-title-line">Calculate.</span>
          <span className="hero-title-line hero-title-accent">Track.</span>
          <span className="hero-title-line">Achieve.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          The most advanced CGPA calculator for Indian universities.
          <br />
          <span style={{ color: 'var(--ink-4)' }}>
            JNTU · Anna · VTU · Mumbai · KTU · GTU · IIT/NIT
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta">
          <button className="hero-btn-primary" onClick={() => router.push('/calculator/sgpa')}>
            <i className="fa-solid fa-calculator" />
            <span>Calculate SGPA</span>
            <i className="fa-solid fa-arrow-right hero-btn-arrow" />
          </button>
          <button className="hero-btn-secondary" onClick={() => router.push('/calculator/cgpa')}>
            <i className="fa-solid fa-chart-line" />
            <span>Calculate CGPA</span>
          </button>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          {STATS.map((stat, i) => (
            <div key={i} className="hero-stat">
              <i className={stat.icon} />
              <span className="hero-stat-value">{stat.value}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="hero-features">
          {FEATURES.map((f, i) => (
            <div key={i} className="hero-feature-card">
              <div className="hero-feature-icon">
                <i className={f.icon} />
              </div>
              <div className="hero-feature-text">
                <div className="hero-feature-label">{f.label}</div>
                <div className="hero-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span>Scroll to explore</span>
        </div>
      </div>
    </div>
  );
}
