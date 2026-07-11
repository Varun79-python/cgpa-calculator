import { Subject } from '@/types';

interface PerformanceMetricsProps {
  subjects: Subject[];
}

export default function PerformanceMetrics({ subjects }: PerformanceMetricsProps) {
  const validGrades = subjects
    .map(s => parseFloat(s.grade as string))
    .filter(g => !isNaN(g) && g > 0);

  if (validGrades.length === 0) return null;

  const max = Math.max(...validGrades);
  const min = Math.min(...validGrades);
  const avg = validGrades.reduce((a, b) => a + b, 0) / validGrades.length;
  const totalCredits = subjects
    .map(s => parseFloat(s.credits as string))
    .filter(c => !isNaN(c) && c > 0)
    .reduce((a, b) => a + b, 0);

  const metrics = [
    { label: 'Average Grade', value: avg.toFixed(2), color: 'var(--violet)' },
    { label: 'Highest Grade', value: max.toFixed(2), color: 'var(--green)' },
    { label: 'Lowest Grade', value: min.toFixed(2), color: 'var(--red)' },
    { label: 'Total Credits', value: totalCredits.toString(), color: 'var(--cyan)' },
    { label: 'Subjects', value: validGrades.length.toString(), color: 'var(--gold)' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {metrics.map(m => (
        <div
          key={m.label}
          className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-center"
        >
          <div className="text-xs uppercase tracking-wider text-[var(--ink-mid)] mb-1">{m.label}</div>
          <div className="text-xl font-bold" style={{ color: m.color }}>{m.value}</div>
        </div>
      ))}
    </div>
  );
}
