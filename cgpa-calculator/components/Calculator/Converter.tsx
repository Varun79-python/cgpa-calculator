import { useState, useCallback } from 'react';
import { UniversityFormula } from '@/types';
import { UNIVERSITY_FORMULAS } from '@/config/universities';
import { useHistoryStore } from '@/store/useStore';

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
      addEntry({
        type: 'CONVERTER',
        score: result.gpa,
        percentage: result.pct,
        subtitle: selectedFormula,
      });
    }
  }, [result, addEntry, selectedFormula]);

  return (
    <div className="panel active">
      <div className="sec-head">
        <div className="sec-title">
          <span className="sec-icon"><i className="fa-solid fa-arrow-right-arrow-left" /></span>
          <span>SGPA / CGPA ⟷ Percentage</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ink-mid)] mb-2">
          University Formula
        </label>
        <select
          value={selectedFormula}
          onChange={(e) => { setSelectedFormula(e.target.value); setResult(null); setInA(''); setInB(''); }}
          className="w-full p-3 border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] text-sm"
        >
          {UNIVERSITY_FORMULAS.map(f => (
            <option key={f.id} value={f.id}>{f.name} — {f.description}</option>
          ))}
        </select>
      </div>

      {selectedFormula === 'custom' && (
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ink-mid)] mb-2">
            Custom Factor
          </label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="20"
            value={customFactor}
            onChange={(e) => setCustomFactor(e.target.value)}
            className="w-full p-3 border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] text-sm"
          />
        </div>
      )}

      <div className="conv-wrap">
        <div className="cgrid">
          <div className="cgrp">
            <label htmlFor="cv-gpa">SGPA / CGPA (0–10)</label>
            <input
              id="cv-gpa"
              type="number"
              min="0"
              max="10"
              step="0.01"
              placeholder="e.g. 8.5"
              value={inA}
              onChange={(e) => handleGPAChange(e.target.value)}
              aria-label="SGPA or CGPA value"
              autoComplete="off"
            />
          </div>
          <div className="carr" aria-hidden="true">
            <i className="fa-solid fa-arrow-right" />
          </div>
          <div className="cgrp">
            <label htmlFor="cv-pct">Percentage (0–100%)</label>
            <input
              id="cv-pct"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g. 80"
              value={inB}
              onChange={(e) => handlePctChange(e.target.value)}
              aria-label="Percentage value"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="conv-formula">
          {formula.formula}
        </div>
      </div>

      <div className={`res${result ? ' show' : ''}`}>
        {result ? (
          <div className="res-inner-zero">
            <div className="res-zero-label">Conversion Result</div>
            <div className="res-zero-value">
              {result.gpa.toFixed(2)}
              <span className="res-zero-slash">/</span>
              <span className="res-zero-pct">{result.pct.toFixed(2)}%</span>
            </div>
            <div className="res-zero-meta">
              {formula.name} · GPA ⟷ Percentage
              <button className="ml-3 text-xs underline hover:no-underline" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="res-zero-idle" aria-hidden="true">
            0.00 / 0.0%
          </div>
        )}
      </div>
    </div>
  );
}
