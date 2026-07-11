import Head from 'next/head';
import Header from '@/components/Responsive/Header';
import Footer from '@/components/Responsive/Footer';
import Tabs from '@/components/Responsive/Tabs';
import CGPAForm from '@/components/Calculator/CGPAForm';
import HistorySidebar from '@/components/Responsive/HistorySidebar';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

export default function CGPAPage() {
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <>
      <Head>
        <title>CGPA Calculator — {label} CGPA Calculator</title>
        <meta name="description" content={`Calculate your ${label} Cumulative GPA (CGPA) across all semesters.`} />
      </Head>

      <div className="app">
        <Header />
        <Tabs />
        
        <main id="main-content">
          <CGPAForm />
        </main>

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
