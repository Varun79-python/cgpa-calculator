import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';

export default function Footer() {
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <footer role="contentinfo">
      <span>{label} CGPA · SGPA · Percentage Calculator</span>
      <span className="dot">·</span>
      <span>Free for all students</span>
      <span className="dot">·</span>
      <span>Open source</span>
    </footer>
  );
}
