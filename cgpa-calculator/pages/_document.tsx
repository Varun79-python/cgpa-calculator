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
          <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
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
          <meta name="theme-color" content="#000000" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="CGPA Calculator — SGPA · Percentage · GPA" />
          <meta property="og:description" content="Calculate SGPA, CGPA, convert to percentage, predict goals, and export reports — all offline." />
          <meta property="og:site_name" content="CGPA Calculator" />

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
                  "OCR Marksheet Scanner",
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
