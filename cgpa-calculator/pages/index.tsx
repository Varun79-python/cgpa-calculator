import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Shared/Header';
import Footer from '@/components/Shared/Footer';
import Tabs from '@/components/Shared/Tabs';
import Banner from '@/components/Shared/Banner';
import Hero from '@/components/Shared/Hero';
import HistorySidebar from '@/components/History/HistorySidebar';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

export default function Dashboard() {
  const router = useRouter();
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <>
      <Head>
        <title>{label} CGPA Calculator — SGPA · Percentage · GPA</title>
        <meta name="description" content={`Calculate SGPA, CGPA, convert to percentage, predict goals, and export reports — all offline. Free for ${label} students.`} />
      </Head>

      <div className="app" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
        <Header />
        <Tabs />
        <Hero />

        <div style={{ padding: 'var(--sp-4)' }}>
          <Banner src="/banner.svg" alt="CGPA Calculator — Calculate SGPA, CGPA, Percentage" />
        </div>

        <Footer />
      </div>

      <HistorySidebar />
    </>
  );
}
