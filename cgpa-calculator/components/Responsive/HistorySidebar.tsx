import dynamic from 'next/dynamic';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const MobileHistorySidebar = dynamic(() => import('@/components/Mobile/HistorySidebar'), { ssr: false });
const DesktopHistorySidebar = dynamic(() => import('@/components/Desktop/HistorySidebar'), { ssr: false });

export default function HistorySidebar() {
  const { isMobile } = useBreakpoint();
  return isMobile ? <MobileHistorySidebar /> : <DesktopHistorySidebar />;
}
