import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Responsive/Header';
import Footer from '@/components/Responsive/Footer';
import Tabs from '@/components/Responsive/Tabs';
import HistorySidebar from '@/components/Responsive/HistorySidebar';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';
import { useIsTWA } from '@/hooks/useIsTWA';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const APP_NAME = 'CGPA Calculator';
const APP_URL = 'https://cgpacalculator7.vercel.app';
const SHARE_TEXT = 'Check out this amazing CGPA Calculator app! Calculate SGPA, CGPA, convert to percentage, and more - all offline!';
const APK_URL = '/apk/cgpacalculator.apk';

export default function DownloadPage() {
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;
  const isTWA = useIsTWA();
  const { isMobile } = useBreakpoint();
  const router = useRouter();
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'shared'>('idle');

  useEffect(() => {
    if (isTWA) {
      router.replace('/');
    }
  }, [isTWA, router]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: APP_NAME,
          text: SHARE_TEXT,
          url: APP_URL,
        });
        setShareStatus('shared');
        setTimeout(() => setShareStatus('idle'), 2000);
      } catch (err) {
        // User cancelled or error occurred
        fallbackCopyToClipboard();
      }
    } else {
      fallbackCopyToClipboard();
    }
  };

  const fallbackCopyToClipboard = () => {
    navigator.clipboard.writeText(`${SHARE_TEXT}\n\n${APP_URL}`).then(() => {
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    });
  };

  if (isTWA) return null;

  return (
    <>
      <Head>
        <title>Download & Share — {label} CGPA Calculator</title>
        <meta name="description" content="Download and share the CGPA Calculator app with your friends and classmates." />
      </Head>
      <div className="app">
        <Header />
        <Tabs />
        <main id="main-content" className="panel">
          <div className="sec-header">
            <span className="sec-label">
              <span className="sec-icon"><i className="fa-solid fa-download" /></span>
              Download & Share
            </span>
          </div>

          {/* Download Card - Mobile Only */}
          {isMobile && (
          <div className="card" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-4)' }}>
            <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--sp-4)', color: 'var(--ink)' }}>
              <i className="fa-solid fa-download" style={{ marginRight: '8px', color: 'var(--accent)' }} />
              Download App
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-4)', lineHeight: 1.7, marginBottom: 'var(--sp-5)' }}>
              Get the CGPA Calculator app on your Android device.
              Calculate SGPA, CGPA, and convert to percentage — all offline!
            </p>

            {/* App Info + Download */}
            <div style={{
              background: 'var(--surface-2)',
              borderRadius: '12px',
              padding: 'var(--sp-5)',
              textAlign: 'center',
              marginBottom: 'var(--sp-5)',
              border: '2px solid var(--border)',
            }}>
              <div style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: 'var(--sp-3)' }}>
                <i className="fa-solid fa-graduation-cap" />
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-1)' }}>
                {APP_NAME}
              </div>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)', marginBottom: 'var(--sp-4)' }}>
                {label} · SGPA · CGPA · Percentage
              </div>

              {/* Download Button */}
              <a
                href={APK_URL}
                download
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  padding: 'var(--sp-3) var(--sp-6)',
                  borderRadius: '10px',
                  background: 'var(--accent)',
                  color: 'white',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <i className="fa-solid fa-download" />
                Download APK
              </a>
            </div>
          </div>
          )}

          {/* Share Card */}
          <div className="card" style={{ padding: 'var(--sp-6)' }}>
            <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--sp-4)', color: 'var(--ink)' }}>
              <i className="fa-solid fa-share-nodes" style={{ marginRight: '8px', color: 'var(--accent)' }} />
              Share with Friends
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-4)', lineHeight: 1.7, marginBottom: 'var(--sp-5)' }}>
              Help your classmates discover this free CGPA Calculator.
              Share the app link and let them calculate their grades offline!
            </p>

            {/* Share Button */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--sp-5)' }}>
              <button
                onClick={handleShare}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  padding: 'var(--sp-3) var(--sp-6)',
                  borderRadius: '10px',
                  background: 'var(--accent)',
                  color: 'white',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <i className={shareStatus === 'copied' ? 'fa-solid fa-check' : 'fa-solid fa-share-nodes'} />
                {shareStatus === 'copied' ? 'Link Copied!' : shareStatus === 'shared' ? 'Shared!' : 'Share App'}
              </button>
            </div>

            {/* Share Options */}
            <h3 style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>
              <i className="fa-solid fa-paper-plane" style={{ marginRight: '6px' }} />
              Share via
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 'var(--sp-3)',
            }}>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT}\n\n${APP_URL}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  padding: 'var(--sp-4)',
                  background: 'var(--surface-2)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'var(--ink)',
                  transition: 'all 0.2s ease',
                }}
              >
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.5rem', color: '#25D366' }} />
                <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 500 }}>WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(APP_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  padding: 'var(--sp-4)',
                  background: 'var(--surface-2)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'var(--ink)',
                  transition: 'all 0.2s ease',
                }}
              >
                <i className="fa-brands fa-telegram" style={{ fontSize: '1.5rem', color: '#0088CC' }} />
                <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 500 }}>Telegram</span>
              </a>

              {/* Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(APP_URL)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  padding: 'var(--sp-4)',
                  background: 'var(--surface-2)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'var(--ink)',
                  transition: 'all 0.2s ease',
                }}
              >
                <i className="fa-brands fa-x-twitter" style={{ fontSize: '1.5rem', color: '#000' }} />
                <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 500 }}>Twitter</span>
              </a>

              {/* Copy Link */}
              <button
                onClick={fallbackCopyToClipboard}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  padding: 'var(--sp-4)',
                  background: 'var(--surface-2)',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--ink)',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
              >
                <i className="fa-solid fa-link" style={{ fontSize: '1.5rem', color: 'var(--accent)' }} />
                <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 500 }}>Copy Link</span>
              </button>
            </div>

            {/* Note */}
            <div style={{
              marginTop: 'var(--sp-5)',
              padding: 'var(--sp-3) var(--sp-4)',
              background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
              borderRadius: '8px',
              fontSize: 'var(--text-2xs)',
              color: 'var(--ink-4)',
              lineHeight: 1.6,
            }}>
              <i className="fa-solid fa-shield-halved" style={{ marginRight: '6px', color: 'var(--accent)' }} />
              <strong>Privacy:</strong> This app runs entirely offline.
              No data is collected. All calculations happen on your device.
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <HistorySidebar />
    </>
  );
}
