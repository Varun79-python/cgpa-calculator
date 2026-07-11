import dynamic from 'next/dynamic';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const MobileTabs = dynamic(() => import('@/components/Mobile/Tabs'), { ssr: false });
const DesktopTabs = dynamic(() => import('@/components/Desktop/Tabs'), { ssr: false });

export default function Tabs() {
  const { isMobile } = useBreakpoint();
  return isMobile ? <MobileTabs /> : <DesktopTabs />;
}
