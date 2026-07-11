import dynamic from 'next/dynamic';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const MobileHeader = dynamic(() => import('@/components/Mobile/Header'), { ssr: false });
const DesktopHeader = dynamic(() => import('@/components/Desktop/Header'), { ssr: false });

export default function Header() {
  const { isMobile } = useBreakpoint();
  return isMobile ? <MobileHeader /> : <DesktopHeader />;
}
