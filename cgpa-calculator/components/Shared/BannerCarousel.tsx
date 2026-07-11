import { useState, useEffect, useCallback } from 'react';

interface BannerCarouselProps {
  folder?: string;
  interval?: number;
}

export default function BannerCarousel({ folder = '/banners', interval = 4000 }: BannerCarouselProps) {
  const [banners, setBanners] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-discover banners from the folder
  useEffect(() => {
    const tryBanners: string[] = [];
    const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    let found = 0;
    let checked = 0;

    // Try banner-1 through banner-20
    for (let i = 1; i <= 20; i++) {
      extensions.forEach(ext => {
        const path = `${folder}/banner-${i}${ext}`;
        const img = new Image();
        img.onload = () => {
          tryBanners.push(path);
          found++;
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

  // Auto-rotate
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, interval);

    return () => clearInterval(timer);
  }, [banners.length, interval, isPaused]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const goNext = useCallback(() => {
    setCurrent(prev => (prev + 1) % banners.length);
  }, [banners.length]);

  const goPrev = useCallback(() => {
    setCurrent(prev => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div
      className="banner-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner Image */}
      <div className="banner-carousel-track">
        {banners.map((src, i) => (
          <div
            key={src}
            className={`banner-carousel-slide ${i === current ? 'active' : ''}`}
          >
            <img src={src} alt={`Banner ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button className="banner-carousel-prev" onClick={goPrev} aria-label="Previous banner">
            <i className="fa-solid fa-chevron-left" />
          </button>
          <button className="banner-carousel-next" onClick={goNext} aria-label="Next banner">
            <i className="fa-solid fa-chevron-right" />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="banner-carousel-dots">
          {banners.map((_, i) => (
            <button
              key={i}
              className={`banner-carousel-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
