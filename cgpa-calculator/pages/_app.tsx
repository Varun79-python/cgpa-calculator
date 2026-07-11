import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer } from '@/components/Shared/Toast';
import CommandPalette from '@/components/CommandPalette/CommandPalette';
import NetworkStatus from '@/components/Shared/NetworkStatus';
import ErrorBoundary from '@/components/Shared/ErrorBoundary';
import { useThemeStore, applyThemeClass } from '@/store/useStore';
import '@/styles/shared.css';
import '@/styles/mobile.css';
import '@/styles/desktop.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayComponent, setDisplayComponent] = useState(false);

  useEffect(() => {
    const theme = useThemeStore.getState().theme;
    applyThemeClass(theme);
    setDisplayComponent(true);
  }, []);

  useEffect(() => {
    const onStart = () => setIsTransitioning(true);
    const onEnd = () => setTimeout(() => setIsTransitioning(false), 50);
    router.events.on('routeChangeStart', onStart);
    router.events.on('routeChangeComplete', onEnd);
    router.events.on('routeChangeError', onEnd);
    return () => {
      router.events.off('routeChangeStart', onStart);
      router.events.off('routeChangeComplete', onEnd);
      router.events.off('routeChangeError', onEnd);
    };
  }, [router]);

  return (
    <ErrorBoundary>
      <div
        className={`page-transition ${isTransitioning ? 'page-exit' : 'page-enter'}`}
        style={{ minHeight: '100vh', opacity: displayComponent ? 1 : 0, transition: 'opacity 0.2s ease' }}
      >
        <Component {...pageProps} />
        <ToastContainer />
        <CommandPalette />
        <NetworkStatus />
      </div>
    </ErrorBoundary>
  );
}
