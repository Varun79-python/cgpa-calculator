import { useState } from 'react';

interface BannerProps {
  src?: string;
  alt?: string;
}

export default function Banner({ src = '/banner.jpg', alt = 'CGPA Calculator Banner' }: BannerProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Don't render if image fails to load
  if (error) return null;

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-2)',
      display: loaded ? 'block' : 'none',
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
