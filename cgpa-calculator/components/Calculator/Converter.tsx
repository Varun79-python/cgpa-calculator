import { useState, useCallback } from 'react';
import { UniversityFormula } from '@/types';
import { UNIVERSITY_FORMULAS } from '@/config/universities';
import { useHistoryStore } from '@/store/useStore';
import { showToast } from '@/components/Shared/Toast';

export default function Converter() {
  const [inA, setInA] = useState('');
  const [inB, setInB] = useState('');
  const [result, setResult] = useState<{ gpa: number; pct: number } | null>(null);
  const [selectedFormula, setSelectedFormula] = useState(UNIVERSITY_FORMULAS[0].id);
  const [customFactor, setCustomFactor] = useState('9.5');
  const addEntry = useHistoryStore(s => s.addEntry);

  const getFormula = useCallback((): UniversityFormula => {
    return UNIVERSITY_FORMULAS.find(f => f.id === selectedFormula) || UNIVERSITY_FORMULAS[0];
  }, [selectedFormula]);

  const handleGPAChange = useCallback((v: string) => {
    setInA(v);
    if (v) {
      const x = parseFloat(v);
      if (!isNaN(x) && x >= 0 && x <= 10) {
        const formula = getFormula();
        const factor = selectedFormula === 'custom' ? parseFloat(customFactor) || 9.5 : undefined;
        const pct = formula.calculate(x, factor);
        const rounded = parseFloat(pct.toFixed(2));
        setInB(rounded.toString());
        setResult({ gpa: x, pct: rounded });
        return;
      }
    }
    setInB('');
    setResult(null);
  }, [getFormula, selectedFormula, customFactor]);

  const handlePctChange = useCallback((v: string) => {
    setInB(v);
    if (v) {
      const x = parseFloat(v);
      if (!isNaN(x) && x >= 0 && x <= 100) {
        const formula = getFormula();
        const factor = selectedFormula === 'custom' ? parseFloat(customFactor) || 9.5 : undefined;
        const gpa = formula.inverse(x, factor);
        const rounded = parseFloat(Math.min(Math.max(gpa, 0), 10).toFixed(2));
        setInA(rounded.toString());
        setResult({ gpa: rounded, pct: x });
        return;
      }
    }
    setInA('');
    setResult(null);
  }, [getFormula, selectedFormula, customFactor]);

  const formula = getFormula();

  const handleSave = useCallback(() => {
    if (result) {
      addEntry({ type: 'CONVERTER', score: result.gpa, percentage: result.pct, subtitle: selectedFormula });
      showToast('Saved', 'success');
    }
  }, [result, addEntry, selectedFormula]);

  return (
    <div className="panel">
      <div className="sec-header">
        <span className="sec-label">
          <span className="sec-icon"><i className="fa-solid fa-arrow-right-arrow-left" /></span>
          SGPA / CGPA ⟷ Percentage
        </span>
      </div>

      {/* Formula Selector */}
      <div style={{ marginBottom: 'var(--sp-4)' }}>
        <label style={{ display: 'block', fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-4)', marginBottom: 'var(--sp-2)' }}>University Formula</label>
        <div style={{ display: 'flex', gap: 'var(--sp-1)', flexWrap: 'wrap' }}>
          {UNIVERSITY_FORMULAS.map(f => (
            <button key={f.id} onClick={() => { setSelectedFormula(f.id); setResult(null); setInA(''); setInB(''); }}
              style={{
                padding: '6px 12px', border: `1px solid ${selectedFormula === f.id ? 'var(--ink)' : 'var(--border-solid)'}`,
                borderRadius: 'var(--radius-md)', background: selectedFormula === f.id ? 'var(--ink)' : 'var(--surface)',
                color: selectedFormula === f.id ? 'var(--surface)' : 'var(--ink-3)', cursor: 'pointer',
                fontSize: 'var(--text-2xs)', fontWeight: 500, transition: 'all 0.15s ease',
              }}>
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {selectedFormula === 'custom' && (
        <div style={{ marginBottom: 'var(--sp-4)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-4)', marginBottom: 'var(--sp-2)' }}>Custom Factor</label>
          <input type="number" step="0.1" min="1" max="20" value={customFactor} onChange={(e) => setCustomFactor(e.target.value)} className="input input-mono" style={{ textAlign: 'center' }} />
        </div>
      )}

      <div className="conv-grid">
        <div className="conv-group">
          <label>SGPA / CGPA (0–10)</label>
          <input id="cv-gpa" type="number" min="0" max="10" step="0.01" placeholder="e.g. 8.5" value={inA} onChange={(e) => handleGPAChange(e.target.value)} className="input input-mono input-lg" aria-label="SGPA or CGPA value" autoComplete="off" />
        </div>
        <div className="conv-arrow" aria-hidden="true"><i className="fa-solid fa-arrow-right" /></div>
        <div className="conv-group">
          <label>Percentage (0–100%)</label>
          <input id="cv-pct" type="number" min="0" max="100" step="0.01" placeholder="e.g. 80" value={inB} onChange={(e) => handlePctChange(e.target.value)} className="input input-mono input-lg" aria-label="Percentage value" autoComplete="off" />
        </div>
      </div>

      <div className="conv-formula"><strong>{formula.name}</strong>: {formula.formula}</div>

      <div className={`result${result ? ' show' : ''}`} aria-live="polite">
        {result ? (
          <div className="result-card" style={{ borderColor: 'var(--ink)' }}>
            <div className="result-label">Conversion Result</div>
            <div className="result-number" style={{ marginBottom: 'var(--sp-2)' }}>
              {result.gpa.toFixed(2)}
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: 300, color: 'var(--ink-5)', margin: '0 var(--sp-2)' }}>/</span>
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--ink-3)' }}>{result.pct.toFixed(1)}%</span>
            </div>
            <div className="result-meta">{formula.name}</div>
            <div className="result-actions">
              <button className="btn btn-sm" onClick={() => { navigator.clipboard?.writeText(`GPA: ${result.gpa.toFixed(2)} = ${result.pct.toFixed(1)}%`); showToast('Copied', 'success'); }}>
                <i className="fa-solid fa-share-nodes" /> Share
              </button>
              <button className="btn btn-sm btn-primary" onClick={handleSave}>
                <i className="fa-solid fa-bookmark" /> Save
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--ink-5)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', letterSpacing: '-0.03em' }} aria-hidden="true">
            0.00 / 0.0%
          </div>
        )}
      </div>
    </div>
  );
}
