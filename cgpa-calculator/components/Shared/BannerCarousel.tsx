import { useState, useEffect, useRef, useCallback } from 'react';

interface BannerCarouselProps {
  folder?: string;
  interval?: number;
}

export default function BannerCarousel({ folder = '/banners', interval = 4500 }: BannerCarouselProps) {
  const [banners, setBanners] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-discover banners from the folder
  useEffect(() => {
    const tryBanners: string[] = [];
    const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    let checked = 0;

    for (let i = 1; i <= 20; i++) {
      extensions.forEach(ext => {
        const path = `${folder}/banner-${i}${ext}`;
        const img = new Image();
        img.onload = () => {
          tryBanners.push(path);
          checked++;
          if (checked >= 20 * extensions.length) {
            setBanners([...tryBanners].sort());
          }
        };
        img.onerror = () => {
          checked++;
          if (checked >= 20 * extensions.length) {
            setBanners([...tryBanners].sort());
          }
        };
        img.src = path;
      });
    }
  }, [folder]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(prev => (prev + 1) % banners.length);
    // Allow next transition after animation completes
    setTimeout(() => setIsTransitioning(false), 700);
  }, [banners.length, isTransitioning]);

  // Auto-advance timer
  useEffect(() => {
    if (banners.length <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(goToNext, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length, interval, isPaused, goToNext]);

  if (banners.length === 0) return null;
  if (banners.length === 1) {
    return (
      <div className="banner-carousel" style={{ width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
        <div className="banner-carousel-track" style={{ width: '100%', overflow: 'hidden' }}>
          <div style={{ width: '100%' }}>
            <img
              src={banners[0]}
              alt="Banner"
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="banner-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="banner-carousel-track" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {banners.map((src, i) => {
          const isActive = i === current;
          return (
            <div
              key={src}
              className="banner-carousel-slide"
              style={{
                position: isActive ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1)' : 'scale(1.02)',
                transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
                zIndex: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <img
                src={src}
                alt={`Banner ${i + 1}`}
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
          );
        })}
      </div>
      {/* Dot indicators */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 2,
      }}>
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrent(i);
                setTimeout(() => setIsTransitioning(false), 700);
              }
            }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              background: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'background 0.3s ease, transform 0.3s ease',
              transform: i === current ? 'scale(1.3)' : 'scale(1)',
              padding: 0,
            }}
            aria-label={`Go to banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
