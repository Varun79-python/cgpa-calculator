import Head from 'next/head';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';
import Tabs from '@/components/Shared/Tabs';
import Converter from '@/components/Calculator/Converter';
import HistorySidebar from '@/components/History/HistorySidebar';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

export default function ConverterPage() {
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <>
      <Head>
        <title>GPA ↔ Percentage Converter — {label} GPA Suite</title>
        <meta name="description" content={`Convert ${label} CGPA/SGPA to percentage and vice versa with multiple university formulas.`} />
      </Head>

      <div className="app">
        <Header />
        <Tabs />
        
        <main className="panel active">
          <Converter />
        </main>

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
