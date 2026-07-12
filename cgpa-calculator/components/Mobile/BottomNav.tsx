import { useRouter } from 'next/router';

export default function BottomNav() {
  const router = useRouter();

  return (
    <nav className="mobile-bottom-nav">
      <button
        className="bottom-nav-item"
        onClick={() => router.push('/')}
        aria-label="Go to home"
      >
        <i className="fa-solid fa-house" style={{ fontSize: '1.1rem' }} />
        <span className="bottom-nav-label">Home</span>
      </button>
    </nav>
  );
}
