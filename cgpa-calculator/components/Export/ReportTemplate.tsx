import { useState } from 'react';
import { Subject, CalculationResult } from '@/types';
import PDFGenerator from './PDFGenerator';

export default function ReportTemplate({ result, type, subjects }: { result?: CalculationResult | null; type?: string; subjects?: Subject[] }) {
  const [includeSubjects, setIncludeSubjects] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <div style={{ padding: 'var(--sp-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--sp-3)' }}>Include Sections</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', cursor: 'pointer', fontSize: 'var(--text-xs)', color: 'var(--ink-3)' }}>
          <input type="checkbox" checked={includeSubjects} onChange={(e) => setIncludeSubjects(e.target.checked)} style={{ width: '14px', height: '14px', accentColor: 'var(--ink)' }} />
          Subject-wise breakdown
        </label>
      </div>

      {result && (
        <div style={{ padding: 'var(--sp-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--sp-3)' }}>Preview</div>
          <div style={{ padding: 'var(--sp-4)', background: 'var(--bg)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-4)', marginBottom: 'var(--sp-1)' }}>{type} Result</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.03em' }}>{result.num?.toFixed(2) || '—'}</div>
            {result.pct !== undefined && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginTop: 'var(--sp-1)' }}>{result.pct.toFixed(2)}%</div>}
            {includeSubjects && subjects && subjects.length > 0 && (
              <div style={{ marginTop: 'var(--sp-4)', textAlign: 'left' }}>
                {subjects.filter(s => s.name).map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-2xs)', color: 'var(--ink-3)', padding: 'var(--sp-2) 0', borderBottom: i < subjects.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span>{s.name}</span><span>{s.credits} cr · {s.grade} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <PDFGenerator result={result} type={type} subjects={includeSubjects ? subjects : undefined} />
    </div>
  );
}
