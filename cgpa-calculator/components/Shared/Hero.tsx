import { useRouter } from 'next/router';

export default function Hero() {
  const router = useRouter();

  return (
    <div className="hero">
      <div className="hero-actions">
        <button className="hero-btn-primary" onClick={() => router.push('/calculator/sgpa')}>
          <i className="fa-solid fa-calculator" />
          <span>Calculate SGPA</span>
        </button>
        <button className="hero-btn-secondary" onClick={() => router.push('/calculator/cgpa')}>
          <i className="fa-solid fa-chart-line" />
          <span>Calculate CGPA</span>
        </button>
      </div>
    </div>
  );
}
