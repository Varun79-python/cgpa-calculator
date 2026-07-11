import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Page Not Found — CGPA Calculator</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAFAFA',
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: '20px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 24px',
            borderRadius: '16px',
            background: '#6366F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 800,
            fontFamily: "'Outfit', sans-serif",
          }}>
            404
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0A0A0A', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Page not found
          </h1>
          <p style={{ fontSize: '14px', color: '#71717A', marginBottom: '24px', lineHeight: 1.6 }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '10px 24px',
              background: '#6366F1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
