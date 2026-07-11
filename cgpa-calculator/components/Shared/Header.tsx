import { useRouter } from 'next/router';
import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';
import ThemeToggle from './ThemeToggle';
import DegreeSwitcher from './DegreeSwitcher';

export default function Header() {
  const router = useRouter();
  const degree = useDegreeStore(s => s.degree);
  const label = DEGREE_CONFIG[degree].label;

  return (
    <header className="app-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-9 h-9 flex items-center justify-center bg-[var(--ink)] text-[var(--bg)] font-bold text-sm">
            {DEGREE_CONFIG[degree].shortLabel[0]}
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--ink)]">{label} GPA Suite</h1>
            <p className="text-xs text-[var(--ink-mid)]">CGPA · SGPA · Percentage Calculator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DegreeSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
