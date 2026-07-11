export default function Footer() {
  return (
    <footer className="app-footer">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span>CGPA Calculator · Free for students</span>
          <span style={{ color: 'var(--ink-4)' }}>
            <a href="https://github.com/Varun79-python/cgpa-calculator" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              <i className="fa-brands fa-github" /> GitHub
            </a>
          </span>
          <span style={{ color: 'var(--ink-4)' }}>
            <i className="fa-solid fa-shield-halved" /> Data stays on your device
          </span>
        </div>
        <div style={{ fontSize: '0.55rem', color: 'var(--ink-5)' }}>
          No data is sent to any server. All calculations run locally in your browser.
        </div>
      </div>
    </footer>
  );
}
