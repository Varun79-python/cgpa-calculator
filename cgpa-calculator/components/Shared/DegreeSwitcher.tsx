import { useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG, DEGREE_ORDER } from '@/config/constants';

const DEGREE_META: Record<string, { icon: string }> = {
  diploma: { icon: 'fa-solid fa-graduation-cap' },
  degree:  { icon: 'fa-solid fa-scroll' },
  btech:   { icon: 'fa-solid fa-microchip' },
  mtech:   { icon: 'fa-solid fa-flask' },
};

export default function DegreeSwitcher() {
  const degree = useDegreeStore(s => s.degree);
  const cycleDegree = useDegreeStore(s => s.cycleDegree);
  const setDegree = useDegreeStore(s => s.setDegree);
  const current = DEGREE_CONFIG[degree];
  const meta = DEGREE_META[degree] || DEGREE_META.btech;

  return (
    <div className="relative group">
      <button
        onClick={cycleDegree}
        className="flex items-center gap-2 px-3 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-mid)] hover:text-[var(--ink)] text-sm"
        title={`Switch degree — currently ${current.label} (${current.years} years, ${current.semesters} semesters)`}
        aria-label={`Degree: ${current.label}. Click to switch.`}
      >
        <i className={meta.icon} />
        <span className="hidden sm:inline text-xs font-semibold">{current.shortLabel}</span>
        <span className="text-[10px] text-[var(--ink-faint)] hidden md:inline">{current.semesters} sem</span>
      </button>

      {/* Quick-access dropdown on hover */}
      <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--surface)] border border-[var(--border)] shadow-lg z-50 hidden group-hover:block">
        {DEGREE_ORDER.map(d => {
          const cfg = DEGREE_CONFIG[d];
          const active = d === degree;
          return (
            <button
              key={d}
              onClick={() => setDegree(d)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-3 ${
                active ? 'bg-[var(--surface2)] text-[var(--ink)]' : 'text-[var(--ink-mid)] hover:bg-[var(--surface2)] hover:text-[var(--ink)]'
              }`}
            >
              <i className={DEGREE_META[d].icon} />
              <div className="flex-1">
                <div className="font-medium">{cfg.label}</div>
                <div className="text-[10px] text-[var(--ink-faint)]">{cfg.description}</div>
              </div>
              {active && <i className="fa-solid fa-check text-[var(--ink)]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
