import Head from 'next/head';
import { useState } from 'react';
import Header from '@/components/Responsive/Header';
import Footer from '@/components/Responsive/Footer';
import Tabs from '@/components/Responsive/Tabs';
import HistorySidebar from '@/components/Responsive/HistorySidebar';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

const APK_URL = '/apk/cgpa-calculator-v1.0.0.apk';
const APK_SIZE = '~4 MB';
const APP_VERSION = '1.0.0';

export default function DownloadPage() {
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;
  const [installMethod, setInstallMethod] = useState<'pwa' | 'apk'>('pwa');

  return (
    <>
      <Head>
        <title>Download — {label} CGPA Calculator</title>
        <meta name="description" content="Download the CGPA Calculator app for Android. Install as PWA or download the APK for offline use." />
      </Head>
      <div className="app">
        <Header />
        <Tabs />
        <main id="main-content" className="panel">
          <div className="sec-header">
            <span className="sec-label">
              <span className="sec-icon"><i className="fa-solid fa-download" /></span>
              Download App
            </span>
          </div>

          {/* Install Method Toggle */}
          <div style={{
            display: 'flex',
            gap: 'var(--sp-2)',
            marginBottom: 'var(--sp-6)',
            background: 'var(--surface-2)',
            borderRadius: '12px',
            padding: '4px',
          }}>
            <button
              onClick={() => setInstallMethod('pwa')}
              style={{
                flex: 1,
                padding: 'var(--sp-3) var(--sp-4)',
                border: 'none',
                borderRadius: '10px',
                background: installMethod === 'pwa' ? 'var(--accent)' : 'transparent',
                color: installMethod === 'pwa' ? 'white' : 'var(--ink-3)',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fa-solid fa-browser" style={{ marginRight: '6px' }} />
              Install PWA
            </button>
            <button
              onClick={() => setInstallMethod('apk')}
              style={{
                flex: 1,
                padding: 'var(--sp-3) var(--sp-4)',
                border: 'none',
                borderRadius: '10px',
                background: installMethod === 'apk' ? 'var(--accent)' : 'transparent',
                color: installMethod === 'apk' ? 'white' : 'var(--ink-3)',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fa-brands fa-android" style={{ marginRight: '6px' }} />
              Android APK
            </button>
          </div>

          {installMethod === 'pwa' ? (
            /* ─── PWA Install Instructions ─── */
            <div className="card" style={{ padding: 'var(--sp-6)' }}>
              <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--sp-4)', color: 'var(--ink)' }}>
                <i className="fa-solid fa-browser" style={{ marginRight: '8px', color: 'var(--accent)' }} />
                Install as Progressive Web App
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-4)', lineHeight: 1.7, marginBottom: 'var(--sp-5)' }}>
                The app works entirely offline once installed. No Play Store required.
                Your data stays on your device.
              </p>

              {/* Android */}
              <div style={{ marginBottom: 'var(--sp-5)' }}>
                <h3 style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>
                  <i className="fa-brands fa-android" style={{ marginRight: '6px' }} /> Android (Chrome)
                </h3>
                <ol style={{
                  fontSize: 'var(--text-xs)', color: 'var(--ink-4)', lineHeight: 2.2,
                  margin: 0, paddingLeft: '20px',
                }}>
                  <li>Open <strong>cgpa-calculator.vercel.app</strong> in Chrome</li>
                  <li>Tap the <strong>⋮</strong> menu (top-right)</li>
                  <li>Tap <strong>&quot;Add to Home screen&quot;</strong> or <strong>&quot;Install app&quot;</strong></li>
                  <li>Tap <strong>Install</strong> — the app will appear on your home screen</li>
                </ol>
              </div>

              {/* iOS */}
              <div>
                <h3 style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>
                  <i className="fa-brands fa-apple" style={{ marginRight: '6px' }} /> iOS (Safari)
                </h3>
                <ol style={{
                  fontSize: 'var(--text-xs)', color: 'var(--ink-4)', lineHeight: 2.2,
                  margin: 0, paddingLeft: '20px',
                }}>
                  <li>Open <strong>cgpa-calculator.vercel.app</strong> in Safari</li>
                  <li>Tap the <strong>Share</strong> icon <i className="fa-solid fa-square-arrow-up" /></li>
                  <li>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></li>
                  <li>Tap <strong>Add</strong> — the app will appear on your home screen</li>
                </ol>
              </div>
            </div>
          ) : (
            /* ─── APK Download ─── */
            <div className="card" style={{ padding: 'var(--sp-6)' }}>
              <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--sp-4)', color: 'var(--ink)' }}>
                <i className="fa-brands fa-android" style={{ marginRight: '8px', color: 'var(--accent)' }} />
                Android APK Download
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-4)', lineHeight: 1.7, marginBottom: 'var(--sp-5)' }}>
                Download the APK file and sideload it on your Android device.
                Works offline, no internet required after installation.
              </p>

              {/* Download Card */}
              <div style={{
                background: 'var(--surface-2)',
                borderRadius: '12px',
                padding: 'var(--sp-5)',
                textAlign: 'center',
                marginBottom: 'var(--sp-5)',
                border: '2px dashed var(--border)',
              }}>
                <div style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: 'var(--sp-3)' }}>
                  <i className="fa-brands fa-android" />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-1)' }}>
                  CGPA Calculator v{APP_VERSION}
                </div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-4)', marginBottom: 'var(--sp-4)' }}>
                  {APK_SIZE} · Android 5.0+ · Trusted Web Activity
                </div>
                <a
                  href={APK_URL}
                  download
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    padding: 'var(--sp-3) var(--sp-6)',
                    borderRadius: '10px',
                    background: 'var(--accent)',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <i className="fa-solid fa-download" />
                  Download APK ({APK_SIZE})
                </a>
              </div>

              {/* Install Instructions */}
              <h3 style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>
                How to install the APK
              </h3>
              <ol style={{
                fontSize: 'var(--text-xs)', color: 'var(--ink-4)', lineHeight: 2.2,
                margin: 0, paddingLeft: '20px',
              }}>
                <li>Download the APK file above to your Android device</li>
                <li>Open <strong>Settings → Security</strong> and enable <strong>&quot;Install from unknown apps&quot;</strong></li>
                <li>Open the downloaded APK file from your file manager or Downloads</li>
                <li>Tap <strong>Install</strong> — the app will appear in your app drawer</li>
                <li>Open the app — it works fully offline!</li>
              </ol>

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
                <strong>Privacy:</strong> This APK wraps the web app in a Trusted Web Activity.
                No data is collected. All calculations run locally on your device.
              </div>
            </div>
          )}

          {/* Features comparison */}
          <div className="card" style={{ padding: 'var(--sp-5)', marginTop: 'var(--sp-4)' }}>
            <h3 style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>
              <i className="fa-solid fa-circle-check" style={{ marginRight: '6px', color: 'var(--accent)' }} />
              Both versions include
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 'var(--sp-2)',
            }}>
              {[
                'SGPA Calculator',
                'CGPA Calculator',
                'GPA to Percentage',
                'Goal Predictor',
                'PDF Export',
                'Calculation History',
                'Upload Result',
                'Offline Support',
                'Dark Mode',
                '11 University Systems',
              ].map(f => (
                <div key={f} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  fontSize: 'var(--text-2xs)',
                  color: 'var(--ink-4)',
                  padding: 'var(--sp-1) 0',
                }}>
                  <i className="fa-solid fa-check" style={{ color: 'var(--accent)', fontSize: '0.6rem' }} />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <HistorySidebar />
    </>
  );
}
