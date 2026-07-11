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

  // Reset when degree changes (semester count may differ)
  useEffect(() => {
    setVals(Array(semCount).fill(''));
    setResult(null);
  }, [semCount]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cgpa-cg-inputs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === semCount) setVals(parsed);
      }
    } catch {}
  }, [semCount]);

  useEffect(() => {
    try { localStorage.setItem('cgpa-cg-inputs', JSON.stringify(vals)); } catch {}
  }, [vals]);

  const validate = useCallback((v: string) => {
    if (!v) return true;
    const x = parseFloat(v);
    return !(isNaN(x) || x < 0 || x > 10);
  }, []);

  const handleChange = useCallback((i: number, v: string) => {
    if (!validate(v)) return;
    setVals(prev => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    setResult(null);
  }, [validate]);

  const handleCalc = useCallback(() => {
    const semesters = vals.map((v, i) => ({
      semester: i + 1,
      sgpa: v,
    }));

    const res = calculateCGPA(semesters);
    if (res) {
      setResult(res);
      addEntry({
        type: 'CGPA',
        score: res.num,
        percentage: res.pct,
        subtitle: `${vals.filter(v => v && parseFloat(v) > 0).length} semesters`,
      });
      showToast(`CGPA: ${res.num.toFixed(2)}`, 'success');
    }
  }, [vals, addEntry]);

  const handleReset = useCallback(() => {
    setVals(Array(semCount).fill(''));
    setResult(null);
  }, [semCount]);

  return (
    <div className="panel active">
      <div className="sec-head">
        <div className="sec-title">
          <span className="sec-icon"><i className="fa-solid fa-chart-line" /></span>
          <span>Enter your SGPA per semester ({DEGREE_CONFIG[degree].label}, {semCount} semesters)</span>
        </div>
      </div>

      <div className="s-grid">
        {Array.from({ length: semCount }, (_, i) => (
          <div className="s-card" key={i}>
            <label htmlFor={`cg-sem-${i}`}>Sem {i + 1}</label>
            <input
              id={`cg-sem-${i}`}
              type="number"
              min="0"
              max="10"
              step="0.01"
              placeholder="SGPA"
              value={vals[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              className={!validate(vals[i]) && vals[i] ? 'invalid' : ''}
              aria-label={`Semester ${i + 1} SGPA`}
            />
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

      <div className={`res${result ? ' show' : ''}`}>
        {result && (
          <div className="res-inner">
            <div className="res-score">
              <AnimatedNumber value={result.num} fontSize="3rem" />
            </div>
            <div className="res-pct">Percentage: {result.pct?.toFixed(2)}%</div>
            <div className="res-meta">{result.meta}</div>
          </div>
        )}
      </div>
    </div>
  );
}
