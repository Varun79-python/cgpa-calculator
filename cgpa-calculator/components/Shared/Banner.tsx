import { useState } from 'react';

interface BannerProps {
  src?: string;
  alt?: string;
}

export default function Banner({ src = '/banner.svg', alt = 'CGPA Calculator Banner' }: BannerProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      borderRadius: 'var(--radius-xl)',
      background: 'linear-gradient(135deg, #050510, #0A0A2E)',
      display: loaded ? 'block' : 'none',
      boxShadow: 'var(--shadow-xl)',
    }}>
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}
