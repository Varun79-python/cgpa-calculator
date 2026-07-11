import { Subject } from '@/types';
import { getGradeLetter } from '@/utils/calculations/sgpaCalculator';

interface Props {
  subjects: Subject[];
}

export default function RadarChartView({ subjects }: Props) {
  const valid = subjects.filter(s => {
    const g = parseFloat(s.grade as string);
    return !isNaN(g) && g > 0 && s.name;
  });

  if (valid.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--ink-4)', fontSize: 'var(--text-xs)' }}>
        No data to display
      </div>
    );
  }

  const max = 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      {valid.map((s, i) => {
        const grade = parseFloat(s.grade as string);
        const letter = getGradeLetter(grade);
        const pct = (grade / max) * 100;
        const shortName = s.name.length > 16 ? s.name.slice(0, 16) + '…' : s.name;

        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <div style={{
              width: '70px', fontSize: 'var(--text-2xs)', color: 'var(--ink-3)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              textAlign: 'right', flexShrink: 0,
            }} title={s.name}>
              {shortName}
            </div>
            <div style={{ flex: 1, height: '20px', background: 'var(--surface-3)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                height: '100%', width: `${pct}%`, borderRadius: 'var(--radius-sm)',
                background: grade >= 9 ? 'var(--ink)' : grade >= 7 ? 'var(--ink-2)' : grade >= 5 ? 'var(--ink-3)' : 'var(--ink-4)',
                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${i * 60}ms`,
              }} />
            </div>
            <div style={{
              width: '48px', textAlign: 'right', fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--ink)',
              fontVariantNumeric: 'tabular-nums', flexShrink: 0,
            }}>
              {letter} {grade}
            </div>
          </div>
        );
      })}
    </div>
  );
}
