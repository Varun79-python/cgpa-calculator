import { useState } from 'react';
import { Subject, CalculationResult } from '@/types';
import PDFGenerator from './PDFGenerator';

interface ReportTemplateProps {
  result?: CalculationResult | null;
  type?: string;
  subjects?: Subject[];
}

export default function ReportTemplate({ result, type, subjects }: ReportTemplateProps) {
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSubjects, setIncludeSubjects] = useState(true);

  return (
    <div className="space-y-6">
      <div className="sec-head">
        <div className="sec-title">
          <span className="sec-icon"><i className="fa-solid fa-file-lines" /></span>
          <span>Report Customization</span>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
        <h4 className="text-sm font-semibold mb-4">Include Sections</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSubjects}
              onChange={(e) => setIncludeSubjects(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border)]"
            />
            <span className="text-sm text-[var(--ink-mid)]">Subject-wise breakdown</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border)]"
            />
            <span className="text-sm text-[var(--ink-mid)]">Grade distribution chart</span>
          </label>
        </div>
      </div>

      {/* Preview */}
      {result && (
        <div className="p-6 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
          <h4 className="text-sm font-semibold mb-4">Preview</h4>
          <div className="p-4 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-[var(--ink-mid)] mb-1">
                {type} Result
              </div>
              <div className="text-3xl font-bold text-[var(--violet)]">
                {result.num?.toFixed(2) || '—'}
              </div>
              {result.pct !== undefined && (
                <div className="text-sm text-[var(--ink-mid)] mt-1">
                  {result.pct.toFixed(2)}%
                </div>
              )}
            </div>
            {includeSubjects && subjects && subjects.length > 0 && (
              <div className="mt-4 space-y-1">
                {subjects.filter(s => s.name).map((s, i) => (
                  <div key={i} className="flex justify-between text-xs text-[var(--ink-mid)] py-1 border-b border-[var(--border)] last:border-0">
                    <span>{s.name}</span>
                    <span>{s.credits} cr · {s.grade} pts</span>
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
