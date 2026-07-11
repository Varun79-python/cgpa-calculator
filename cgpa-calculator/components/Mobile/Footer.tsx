export default function MobileFooter() {
  return (
    <footer className="app-footer">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        {/* Trust Badges */}
        <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', fontSize: 'var(--text-2xs)', color: 'var(--ink-3)' }}>
            <i className="fa-solid fa-shield-halved" /> Data stays on device
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', fontSize: 'var(--text-2xs)', color: 'var(--ink-3)' }}>
            <i className="fa-solid fa-bolt" /> Offline
          </span>
        </div>

        {/* Bottom */}
        <div style={{ textAlign: 'center', paddingTop: 'var(--sp-2)', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.55rem', color: 'var(--ink-4)' }}>
            © 2026 CGPA Calculator · All calculations run locally · No data leaves your device
          </div>
        </div>
      </div>
    </footer>
  );
}
