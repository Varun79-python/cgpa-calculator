import { useState, useCallback } from 'react';
import { useHistoryStore, useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';
import { showToast } from '@/components/Shared/Toast';
import { predictRequiredSGPA, calculateFeasibility } from '@/utils/calculations/predictor';

export default function GoalPredictor() {
  const degree = useDegreeStore(s => s.degree);
  const maxSems = DEGREE_CONFIG[degree].semesters;
  const [step, setStep] = useState(1);
  const [currentCGPA, setCurrentCGPA] = useState('');
  const [completedSems, setCompletedSems] = useState('');
  const [targetCGPA, setTargetCGPA] = useState('');
  const [remainingSems, setRemainingSems] = useState('');
  const [result, setResult] = useState<{ requiredSGPA: number; gap: number; message: string; error?: string; feasibility: number } | null>(null);
  const addEntry = useHistoryStore(s => s.addEntry);

  const handleCalculate = useCallback(() => {
    const current = parseFloat(currentCGPA);
    const completed = parseInt(completedSems);
    const target = parseFloat(targetCGPA);
    const remaining = parseInt(remainingSems);

    if (isNaN(current) || isNaN(completed) || isNaN(target) || isNaN(remaining)) { showToast('Fill all fields', 'error'); return; }
    if (current < 0 || current > 10 || target < 0 || target > 10) { showToast('CGPA must be 0–10', 'error'); return; }
    if (completed < 1 || remaining < 1) { showToast('At least 1 semester each', 'error'); return; }
    if (completed + remaining > maxSems) { showToast(`${DEGREE_CONFIG[degree].label} has only ${maxSems} semesters`, 'error'); return; }

    const prediction = predictRequiredSGPA({ currentCGPA: current, completedSemesters: completed, targetCGPA: target, remainingSemesters: remaining });
    const feasibility = calculateFeasibility({ currentCGPA: current, completedSemesters: completed, targetCGPA: target, remainingSemesters: remaining });
    setResult({ ...prediction, feasibility });
    addEntry({ type: 'PREDICTOR', score: target, subtitle: `Need ${prediction.requiredSGPA} SGPA · ${feasibility}% feasible`, metadata: { current, completed, target, remaining, required: prediction.requiredSGPA } });
  }, [currentCGPA, completedSems, targetCGPA, remainingSems, addEntry, degree, maxSems]);

  const handleReset = useCallback(() => { setCurrentCGPA(''); setCompletedSems(''); setTargetCGPA(''); setRemainingSems(''); setResult(null); setStep(1); }, []);

  const handleNext = useCallback(() => {
    if (!currentCGPA || !completedSems) { showToast('Fill both fields', 'error'); return; }
    setStep(2);
  }, [currentCGPA, completedSems]);

  const feasibilityLabel = (f: number) => f >= 80 ? 'Achievable' : f >= 50 ? 'Challenging' : f >= 30 ? 'Difficult' : 'Very Difficult';

  return (
    <div className="panel">
      <div className="sec-header">
        <span className="sec-label">
          <span className="sec-icon"><i className="fa-solid fa-bullseye" /></span>
          Target CGPA Predictor
        </span>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)' }}>
        {[1, 2].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: step >= s ? 'var(--ink)' : 'var(--surface-2)',
              color: step >= s ? 'var(--surface)' : 'var(--ink-4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'var(--text-xs)', fontWeight: 600, transition: 'all 0.2s ease',
            }}>{s}</div>
            {s < 2 && <div style={{ width: '32px', height: '1px', background: step >= 2 ? 'var(--ink)' : 'var(--surface-3)' }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <div style={{ textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--sp-4)' }}>Your Current State</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)' }}>
            <div className="sem-card" style={{ padding: 'var(--sp-5) var(--sp-3) var(--sp-3)' }}>
              <label>Current CGPA</label>
              <input type="number" min="0" max="10" step="0.01" placeholder="e.g. 7.5" value={currentCGPA} onChange={(e) => setCurrentCGPA(e.target.value)} />
            </div>
            <div className="sem-card" style={{ padding: 'var(--sp-5) var(--sp-3) var(--sp-3)' }}>
              <label>Completed Semesters</label>
              <input type="number" min="1" max={maxSems} step="1" placeholder={`e.g. ${Math.ceil(maxSems / 2)}`} value={completedSems} onChange={(e) => setCompletedSems(e.target.value)} />
            </div>
          </div>
          <div className="btn-row"><button className="btn btn-primary" onClick={handleNext}>Next <i className="fa-solid fa-arrow-right" /></button></div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--sp-4)' }}>Your Target Goal</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)' }}>
            <div className="sem-card" style={{ padding: 'var(--sp-5) var(--sp-3) var(--sp-3)' }}>
              <label>Target CGPA</label>
              <input type="number" min="0" max="10" step="0.01" placeholder="e.g. 9.0" value={targetCGPA} onChange={(e) => setTargetCGPA(e.target.value)} />
            </div>
            <div className="sem-card" style={{ padding: 'var(--sp-5) var(--sp-3) var(--sp-3)' }}>
              <label>Remaining Semesters</label>
              <input type="number" min="1" max={maxSems} step="1" placeholder={`e.g. ${Math.floor(maxSems / 2)}`} value={remainingSems} onChange={(e) => setRemainingSems(e.target.value)} />
            </div>
          </div>
          <div className="btn-row">
            <button className="btn" onClick={() => setStep(1)}><i className="fa-solid fa-arrow-left" /> Back</button>
            <button className="btn btn-primary" onClick={handleCalculate}><i className="fa-solid fa-calculator" /> Predict</button>
          </div>
        </div>
      )}

      {result && (
        <div className="result show">
          {result.error ? (
            <div className="result-card"><div style={{ color: 'var(--ink-3)' }}>{result.error}</div></div>
          ) : (
            <div className="result-card" style={{ borderColor: 'var(--ink)' }}>
              <div className="result-label">Required SGPA per Semester</div>
              <div className="result-number">{result.requiredSGPA.toFixed(2)}</div>
              <div className="result-meta" style={{ marginBottom: 'var(--sp-4)' }}>for next {remainingSems} semester{remainingSems !== '1' ? 's' : ''}</div>

              <div style={{ marginBottom: 'var(--sp-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-2)', fontSize: 'var(--text-2xs)', color: 'var(--ink-4)' }}>
                  <span>Feasibility</span>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{result.feasibility}%</span>
                </div>
                <div className="result-progress">
                  <div className="result-progress-fill" style={{ width: `${Math.min(result.feasibility, 100)}%` }} />
                </div>
                <div style={{ textAlign: 'center', marginTop: 'var(--sp-2)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-3)' }}>{feasibilityLabel(result.feasibility)}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
                {[['Current', currentCGPA], ['Target', targetCGPA], ['Gap', `${result.gap > 0 ? '+' : ''}${result.gap.toFixed(2)}`]].map(([l, v]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-5)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: 'var(--sp-3) var(--sp-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--ink-3)', lineHeight: 1.6 }}>{result.message}</div>

              <div className="result-actions" style={{ marginTop: 'var(--sp-5)' }}>
                <button className="btn btn-sm" onClick={handleReset}><i className="fa-solid fa-rotate-left" /> Try Again</button>
                <button className="btn btn-sm btn-primary" onClick={() => { navigator.clipboard?.writeText(`Required SGPA: ${result.requiredSGPA.toFixed(2)} (${result.feasibility}% feasible)`); showToast('Copied', 'success'); }}>
                  <i className="fa-solid fa-share-nodes" /> Share
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
