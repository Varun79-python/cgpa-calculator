import { useRouter } from 'next/router';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="app-footer">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>

        {/* Trust Badges */}
        <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', fontSize: 'var(--text-2xs)', color: 'var(--ink-3)' }}>
            <i className="fa-solid fa-shield-halved" /> Data stays on your device
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', fontSize: 'var(--text-2xs)', color: 'var(--ink-3)' }}>
            <i className="fa-solid fa-bolt" /> Works offline
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', fontSize: 'var(--text-2xs)', color: 'var(--ink-3)' }}>
            <i className="fa-solid fa-check-circle" /> 11 university systems
          </span>
        </div>

        {/* Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--sp-4)',
          textAlign: 'center',
        }}>
          {/* Calculators */}
          <div>
            <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Calculators
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              <a onClick={() => router.push('/calculator/sgpa')} style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)', cursor: 'pointer' }}>SGPA Calculator</a>
              <a onClick={() => router.push('/calculator/cgpa')} style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)', cursor: 'pointer' }}>CGPA Calculator</a>
              <a onClick={() => router.push('/calculator/converter')} style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)', cursor: 'pointer' }}>GPA to %</a>
              <a onClick={() => router.push('/predictor')} style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)', cursor: 'pointer' }}>Predict CGPA</a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Tools
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              <a onClick={() => router.push('/history')} style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)', cursor: 'pointer' }}>History</a>
              <a onClick={() => router.push('/export')} style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)', cursor: 'pointer' }}>Export PDF</a>
              <a href="https://github.com/Varun79-python/cgpa-calculator" target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)', textDecoration: 'none' }}>
                <i className="fa-brands fa-github" /> GitHub
              </a>
            </div>
          </div>

          {/* University */}
          <div>
            <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Supported
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)' }}>JNTU / JNTUH</span>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)' }}>Anna University</span>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)' }}>VTU / GTU / KTU</span>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)' }}>IIT / NIT / BITS</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ textAlign: 'center', paddingTop: 'var(--sp-3)', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)' }}>
            © 2026 CGPA Calculator · All calculations run locally · No data leaves your device
          </div>
        </div>
      </div>
    </footer>
  );
}
