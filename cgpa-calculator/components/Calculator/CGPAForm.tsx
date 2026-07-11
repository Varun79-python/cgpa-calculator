import { useState, useEffect, useCallback } from 'react';
import { CalculationResult } from '@/types';
import { calculateCGPA } from '@/utils/calculations/cgpaCalculator';
import { useHistoryStore, useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';
import { showToast } from '@/components/Shared/Toast';
import AnimatedNumber from '@/components/Shared/AnimatedNumber';

export default function CGPAForm() {
  const degree = useDegreeStore(s => s.degree);
  const semCount = DEGREE_CONFIG[degree].semesters;
  const [vals, setVals] = useState<string[]>(Array(semCount).fill(''));
  const [result, setResult] = useState<CalculationResult | null>(null);
  const addEntry = useHistoryStore(s => s.addEntry);

  useEffect(() => { setVals(Array(semCount).fill('')); setResult(null); }, [semCount]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cgpa-cg-inputs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === semCount) setVals(parsed);
      }
    } catch {}
  }, [semCount]);

  useEffect(() => { try { localStorage.setItem('cgpa-cg-inputs', JSON.stringify(vals)); } catch {} }, [vals]);

  const validate = useCallback((v: string) => {
    if (!v) return true;
    const x = parseFloat(v);
    return !(isNaN(x) || x < 0 || x > 10);
  }, []);

  const handleChange = useCallback((i: number, v: string) => {
    if (!validate(v)) return;
    setVals(prev => { const n = [...prev]; n[i] = v; return n; });
    setResult(null);
  }, [validate]);

  const handleCalc = useCallback(() => {
    const semesters = vals.map((v, i) => ({ semester: i + 1, sgpa: v }));
    const res = calculateCGPA(semesters);
    if (res) {
      setResult(res);
      addEntry({ type: 'CGPA', score: res.num, percentage: res.pct, subtitle: `${vals.filter(v => v && parseFloat(v) > 0).length} semesters` });
      showToast(`CGPA: ${res.num.toFixed(2)}`, 'success');
    }
  }, [vals, addEntry]);

  const handleReset = useCallback(() => { setVals(Array(semCount).fill('')); setResult(null); }, [semCount]);

  const getTier = (score: number) => {
    if (score >= 9.0) return 'excellent';
    if (score >= 8.0) return 'great';
    if (score >= 7.0) return 'good';
    if (score >= 6.0) return 'average';
    return 'below';
  };

  const getBadgeText = (tier: string) => {
    switch (tier) {
      case 'excellent': return 'Excellent';
      case 'great': return 'Great';
      case 'good': return 'Good';
      case 'average': return 'Average';
      default: return 'Keep going';
    }
  };

  return (
    <div className="panel">
      <div className="sec-header">
        <span className="sec-label">
          <span className="sec-icon"><i className="fa-solid fa-chart-line" /></span>
          Enter SGPA per semester
        </span>
      </div>

      <div className="sem-grid">
        {Array.from({ length: semCount }, (_, i) => (
          <div className={`sem-card${vals[i] && parseFloat(vals[i]) > 0 ? ' filled' : ''}`} key={i}>
            <label>Sem {i + 1}</label>
            <input id={`cg-sem-${i}`} type="number" min="0" max="10" step="0.01" placeholder="—" value={vals[i]} onChange={(e) => handleChange(i, e.target.value)} className={!validate(vals[i]) && vals[i] ? 'invalid' : ''} aria-label={`Semester ${i + 1} SGPA`} />
          </div>
        ))}
      </div>

      <div className="btn-row">
        <button className="btn btn-primary" onClick={handleCalc}>
          <i className="fa-solid fa-calculator" /> Calculate CGPA
        </button>
        <button className="btn" onClick={handleReset}>
          <i className="fa-solid fa-rotate-left" /> Reset
        </button>
      </div>

      <div className={`result${result ? ' show' : ''}`} aria-live="polite">
        {result && (() => {
          const tier = getTier(result.num);
          return (
            <div className={`result-card tier-${tier}`}>
              <div className={`result-badge ${tier}`}>{getBadgeText(tier)}</div>
              <AnimatedNumber value={result.num} />
              <div className="result-label">CGPA</div>
              <div className="result-progress">
                <div className="result-progress-fill" style={{ width: `${(result.num / 10) * 100}%` }} role="progressbar" aria-valuenow={result.num} aria-valuemin={0} aria-valuemax={10} />
              </div>
              <div className="result-pct">{result.pct?.toFixed(1)}%</div>
              <div className="result-meta">{result.meta}</div>
              <div className="result-actions">
                <button className="btn btn-sm" onClick={() => { navigator.clipboard?.writeText(`CGPA: ${result.num.toFixed(2)}`); showToast('Copied', 'success'); }}>
                  <i className="fa-solid fa-share-nodes" /> Share
                </button>
                <button className="btn btn-sm btn-primary" onClick={() => showToast('Saved', 'success')}>
                  <i className="fa-solid fa-bookmark" /> Save
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
