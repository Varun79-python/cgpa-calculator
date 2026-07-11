import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Dark mode flash prevention — runs before paint */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var theme = localStorage.getItem('cgpa-theme-mode');
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  if (theme === 'dark') {
                    root.classList.add('dark');
                  } else if (theme === 'system' || !theme) {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      root.classList.add('dark');
                    }
                  }
                })();
              `,
            }}
          />

          <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
          <link rel="icon" href="/icons/icon-48x48.png" sizes="48x48" type="image/png" />
          <link rel="icon" href="/icons/icon-192x192.png" sizes="192x192" type="image/png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&family=Outfit:wght@700;800&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <meta name="description" content="Calculate SGPA, CGPA, convert to percentage, predict goals, and export reports — all offline. Free for Diploma, Degree, B.Tech & M.Tech students." />
          <meta name="theme-color" content="#059669" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="CGPA Calc" />
          <meta name="application-name" content="CGPA Calc" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="CGPA Calculator — SGPA · Percentage · GPA" />
          <meta property="og:description" content="Calculate SGPA, CGPA, convert to percentage, predict goals, and export reports — all offline." />
          <meta property="og:site_name" content="CGPA Calculator" />
          <meta property="og:url" content="https://cgpa-calculator.vercel.app" />
          <meta property="og:image" content="/icons/icon-512x512.png" />
          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="CGPA Calculator — SGPA · Percentage · GPA" />
          <meta name="twitter:description" content="Calculate SGPA, CGPA, convert to percentage, predict goals, and export reports — all offline." />

          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "CGPA Calculator",
                "url": "https://cgpa-calculator.vercel.app",
                "description": "Calculate SGPA, CGPA, convert to percentage, predict goals, and export reports — all offline. Free for Diploma, Degree, B.Tech & M.Tech students.",
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "All",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "INR"
                },
                "featureList": [
                  "SGPA Calculator",
                  "CGPA Calculator",
                  "GPA to Percentage Converter",
                  "CGPA Goal Predictor",
                  "PDF Report Export",
                  "Upload Result Scanner",
                  "Offline Support"
                ]
              })
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
