import Head from 'next/head';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';
import Tabs from '@/components/Shared/Tabs';
import GoalPredictor from '@/components/Calculator/GoalPredictor';
import HistorySidebar from '@/components/History/HistorySidebar';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

export default function PredictorPage() {
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <>
      <Head>
        <title>CGPA Goal Predictor — {label} GPA Suite</title>
        <meta name="description" content={`Predict the SGPA you need to achieve your target CGPA for ${label} students.`} />
      </Head>

      <div className="app">
        <Header />
        <Tabs />
        
        <main className="panel active">
          <GoalPredictor />
        </main>

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
