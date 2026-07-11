import Head from 'next/head';
import Header from '@/components/Responsive/Header';
import Footer from '@/components/Responsive/Footer';
import Tabs from '@/components/Responsive/Tabs';
import Converter from '@/components/Calculator/Converter';
import HistorySidebar from '@/components/Responsive/HistorySidebar';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

export default function ConverterPage() {
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <>
      <Head>
        <title>GPA ↔ Percentage Converter — {label} CGPA Calculator</title>
        <meta name="description" content={`Convert ${label} CGPA/SGPA to percentage and vice versa with multiple university formulas.`} />
      </Head>

      <div className="app">
        <Header />
        <Tabs />
        
        <main id="main-content">
          <Converter />
        </main>

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
