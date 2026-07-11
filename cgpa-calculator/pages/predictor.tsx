import Head from 'next/head';
import Header from '@/components/Responsive/Header';
import Footer from '@/components/Responsive/Footer';
import Tabs from '@/components/Responsive/Tabs';
import GoalPredictor from '@/components/Calculator/GoalPredictor';
import HistorySidebar from '@/components/Responsive/HistorySidebar';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

export default function PredictorPage() {
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <>
      <Head><title>Predictor — {label} CGPA Calculator</title></Head>
      <div className="app">
        <Header />
        <Tabs />
        <main id="main-content"><GoalPredictor /></main>
        <Footer />
      </div>
      <HistorySidebar />
    </>
  );
}
