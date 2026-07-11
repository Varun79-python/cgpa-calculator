import Head from 'next/head';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';
import Tabs from '@/components/Shared/Tabs';
import SGPAForm from '@/components/Calculator/SGPAForm';
import HistorySidebar from '@/components/History/HistorySidebar';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

export default function SGPAPage() {
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <>
      <Head>
        <title>SGPA Calculator — {label} GPA Suite</title>
        <meta name="description" content={`Calculate your ${label} Semester GPA (SGPA) with subject-wise grades and credits. Upload marksheet screenshots to auto-fill.`} />
      </Head>

      <div className="app">
        <Header />
        <Tabs />
        
        <main id="main-content">
          <SGPAForm />
        </main>

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
