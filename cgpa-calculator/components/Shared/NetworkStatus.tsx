import { useState, useEffect } from 'react';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--sp-3)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        padding: 'var(--sp-2) var(--sp-4)',
        borderRadius: 'var(--radius-full)',
        background: isOnline ? 'var(--green)' : 'var(--ink)',
        color: 'white',
        fontSize: 'var(--text-2xs)',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-2)',
        boxShadow: 'var(--shadow-lg)',
        animation: 'toastIn 0.3s var(--ease-spring)',
      }}
      role="status"
      aria-live="polite"
    >
      <i className={`fa-solid ${isOnline ? 'fa-wifi' : 'fa-wifi-slash'}`} />
      {isOnline ? 'Back online' : 'Offline — all calculations still work'}
    </div>
  );
}
