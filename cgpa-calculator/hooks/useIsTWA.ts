import { useState, useEffect } from 'react';

function detectTWA(): boolean {
  if (typeof document === 'undefined') return false;
  // TWA sets referrer to android-app://<package>
  if (document.referrer?.startsWith('android-app://')) return true;
  // Standalone display-mode set by TWA
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  return false;
}

export function useIsTWA(): boolean {
  const [isTWA, setIsTWA] = useState(false);

  useEffect(() => {
    setIsTWA(detectTWA());
  }, []);

  return isTWA;
}
