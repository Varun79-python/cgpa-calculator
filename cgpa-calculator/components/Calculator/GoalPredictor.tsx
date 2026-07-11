import { useState, useCallback } from 'react';
import { useHistoryStore, useDegreeStore } from '@/store/useStore';
import { DEGREE_CONFIG } from '@/config/constants';
import { showToast } from '@/components/Shared/Toast';
import { predictRequiredSGPA, calculateFeasibility } from '@/utils/calculations/predictor';

export default function GoalPredictor() {
  const degree = useDegreeStore(s => s.degree);
  const maxSems = DEGREE_CONFIG[degree].semesters;
  const [currentCGPA, setCurrentCGPA] = useState('');
  const [completedSems, setCompletedSems] = useState('');
  const [targetCGPA, setTargetCGPA] = useState('');
  const [remainingSems, setRemainingSems] = useState('');
  const [result, setResult] = useState<any>(null);
  const addEntry = useHistoryStore(s => s.addEntry);

  const handleCalculate = useCallback(() => {
    const current = parseFloat(currentCGPA);
    const completed = parseInt(completedSems);
    const target = parseFloat(targetCGPA);
    const remaining = parseInt(remainingSems);

    if (isNaN(current) || isNaN(completed) || isNaN(target) || isNaN(remaining)) {
      showToast('Please fill all fields', 'error');
      return;
    }

    if (current < 0 || current > 10 || target < 0 || target > 10) {
      showToast('CGPA must be between 0 and 10', 'error');
      return;
    }

    if (completed < 1 || remaining < 1) {
      showToast('Enter at least 1 semester in each field', 'error');
      return;
    }

    if (completed + remaining > maxSems) {
      showToast(`Your ${DEGREE_CONFIG[degree].label} has only ${maxSems} semesters total`, 'error');
      return;
    }

    const prediction = predictRequiredSGPA({
      currentCGPA: current,
      completedSemesters: completed,
      targetCGPA: target,
      remainingSemesters: remaining,
    });

    const feasibility = calculateFeasibility({
      currentCGPA: current,
      completedSemesters: completed,
      targetCGPA: target,
      remainingSemesters: remaining,
    });

    setResult({ ...prediction, feasibility });

    addEntry({
      type: 'PREDICTOR',
      score: target,
      subtitle: `Need ${prediction.requiredSGPA} SGPA · ${feasibility}% feasible`,
      metadata: { current, completed, target, remaining, required: prediction.requiredSGPA },
    });
  }, [currentCGPA, completedSems, targetCGPA, remainingSems, addEntry, degree, maxSems]);

  const handleReset = useCallback(() => {
    setCurrentCGPA('');
    setCompletedSems('');
    setTargetCGPA('');
    setRemainingSems('');
    setResult(null);
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="sec-head">
        <div className="sec-title">
          <span className="sec-icon"><i className="fa-solid fa-bullseye" /></span>
          <span>Target CGPA Predictor ({DEGREE_CONFIG[degree].label})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="s-card">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ink-mid)] mb-2">
            Current CGPA
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            placeholder="e.g. 7.5"
            value={currentCGPA}
            onChange={(e) => setCurrentCGPA(e.target.value)}
            className="w-full text-center text-2xl font-bold bg-transparent border-none outline-none text-[var(--ink)]"
          />
        </div>
        <div className="s-card">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ink-mid)] mb-2">
            Completed Semesters
          </label>
          <input
            type="number"
            min="1"
            max={maxSems}
            step="1"
            placeholder={`e.g. ${Math.ceil(maxSems / 2)}`}
            value={completedSems}
            onChange={(e) => setCompletedSems(e.target.value)}
            className="w-full text-center text-2xl font-bold bg-transparent border-none outline-none text-[var(--ink)]"
          />
        </div>
        <div className="s-card">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ink-mid)] mb-2">
            Target CGPA
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            placeholder="e.g. 9.0"
            value={targetCGPA}
            onChange={(e) => setTargetCGPA(e.target.value)}
            className="w-full text-center text-2xl font-bold bg-transparent border-none outline-none text-[var(--ink)]"
          />
        </div>
        <div className="s-card">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ink-mid)] mb-2">
            Remaining Semesters
          </label>
          <input
            type="number"
            min="1"
            max={maxSems}
            step="1"
            placeholder={`e.g. ${Math.floor(maxSems / 2)}`}
            value={remainingSems}
            onChange={(e) => setRemainingSems(e.target.value)}
            className="w-full text-center text-2xl font-bold bg-transparent border-none outline-none text-[var(--ink)]"
          />
        </div>
      </div>

      <div className="btn-row">
        <button className="btn btn-primary" onClick={handleCalculate}>
          <i className="fa-solid fa-calculator" /> Predict
        </button>
        <button className="btn" onClick={handleReset}>
          <i className="fa-solid fa-rotate-left" /> Reset
        </button>
      </div>

      {result && (
        <div className="res show">
          <div className="res-inner">
            {result.error ? (
              <div className="text-[var(--ink)] font-medium">{result.error}</div>
            ) : (
              <>
                <div className="text-xs uppercase tracking-wider text-[var(--ink-mid)] mb-2">Required SGPA</div>
                <div className="res-score">
                  {result.requiredSGPA.toFixed(2)}
                </div>
                <div className="res-pct">
                  per semester for next {remainingSems} semester{remainingSems !== '1' ? 's' : ''}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-[var(--ink-mid)]">
                    <span>Current: {currentCGPA}</span>
                    <span>Target: {targetCGPA}</span>
                    <span>Gap: {result.gap > 0 ? '+' : ''}{result.gap.toFixed(2)}</span>
                  </div>

                  <div className="w-full h-3 border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--ink)]"
                      style={{
                        width: `${Math.min(result.feasibility, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-center text-xs font-bold text-[var(--ink-mid)]">
                    {result.feasibility}% Feasible
                  </div>

                  <div className="text-sm text-[var(--ink-mid)] mt-3 p-3 border border-[var(--border)] bg-[var(--surface)]">
                    {result.message}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
