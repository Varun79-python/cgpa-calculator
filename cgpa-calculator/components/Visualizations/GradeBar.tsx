import { Subject } from '@/types';

interface Props {
  subjects: Subject[];
}

export default function GradeBarChart({ subjects }: Props) {
  const valid = subjects.filter(s => {
    const g = parseFloat(s.grade as string);
    return !isNaN(g) && g > 0;
  });

  if (valid.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--ink-4)', fontSize: 'var(--text-xs)' }}>
        No data to display
      </div>
    );
  }

  // Count grades per point value
  const counts: Record<number, number> = {};
  valid.forEach(s => {
    const g = Math.round(parseFloat(s.grade as string));
    counts[g] = (counts[g] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(counts));
  const grades = [10, 9, 8, 7, 6, 5, 0];
  const labels: Record<number, string> = {
    10: 'O', 9: 'A', 8: 'B+', 7: 'C+', 6: 'D', 5: 'E', 0: 'F',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
      {grades.map(g => {
        const count = counts[g] || 0;
        if (count === 0) return null;
        const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;

        return (
          <div key={g} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <div style={{
              width: '28px', fontSize: 'var(--text-2xs)', fontWeight: 600,
              color: 'var(--ink-3)', textAlign: 'right', flexShrink: 0,
              fontFamily: 'var(--font-mono)',
            }}>
              {labels[g]}
            </div>
            <div style={{
              flex: 1, height: '24px', background: 'var(--surface-3)',
              borderRadius: 'var(--radius-sm)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${pct}%`, borderRadius: 'var(--radius-sm)',
                background: g >= 9 ? 'var(--ink)' : g >= 7 ? 'var(--ink-2)' : g >= 5 ? 'var(--ink-3)' : 'var(--ink-4)',
                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${(10 - g) * 40}ms`,
                display: 'flex', alignItems: 'center', paddingLeft: 'var(--sp-2)',
              }}>
                {count > 0 && (
                  <span style={{
                    fontSize: 'var(--text-2xs)', fontWeight: 700,
                    color: pct > 30 ? 'var(--surface)' : 'var(--ink)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {count}
                  </span>
                )}
              </div>
            </div>
            <div style={{
              width: '20px', fontSize: 'var(--text-2xs)', color: 'var(--ink-4)',
              flexShrink: 0,
            }}>
              {count}
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        paddingTop: 'var(--sp-2)', borderTop: '1px solid var(--border)',
        fontSize: 'var(--text-2xs)', color: 'var(--ink-4)',
      }}>
        <span>{valid.length} subjects</span>
        <span>
          Avg {(valid.reduce((sum, s) => sum + parseFloat(s.grade as string), 0) / valid.length).toFixed(1)}
        </span>
      </div>
    </div>
  );
}
