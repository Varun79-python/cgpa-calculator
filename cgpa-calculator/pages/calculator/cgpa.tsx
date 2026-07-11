import Head from 'next/head';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';
import Tabs from '@/components/Shared/Tabs';
import CGPAForm from '@/components/Calculator/CGPAForm';
import HistorySidebar from '@/components/History/HistorySidebar';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

export default function CGPAPage() {
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <>
      <Head>
        <title>CGPA Calculator — {label} GPA Suite</title>
        <meta name="description" content={`Calculate your ${label} Cumulative GPA (CGPA) across all semesters.`} />
      </Head>

      <div className="app">
        <Header />
        <Tabs />
        
        <main className="panel active">
          <CGPAForm />
        </main>

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
