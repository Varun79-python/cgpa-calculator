import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { ToastContainer } from '@/components/Shared/Toast';
import { useThemeStore, applyThemeClass } from '@/store/useStore';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  // Apply saved theme on mount
  useEffect(() => {
    const theme = useThemeStore.getState().theme;
    applyThemeClass(theme);
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}
