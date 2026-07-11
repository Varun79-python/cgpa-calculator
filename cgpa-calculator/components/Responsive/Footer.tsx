import dynamic from 'next/dynamic';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const MobileFooter = dynamic(() => import('@/components/Mobile/Footer'), { ssr: false });
const DesktopFooter = dynamic(() => import('@/components/Desktop/Footer'), { ssr: false });

export default function Footer() {
  const { isMobile } = useBreakpoint();
  return isMobile ? <MobileFooter /> : <DesktopFooter />;
}
