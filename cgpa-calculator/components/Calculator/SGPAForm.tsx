import { useState, useEffect, useCallback } from 'react';
import { Subject, CalculationResult } from '@/types';
import { calculateSGPA } from '@/utils/calculations/sgpaCalculator';
import { GRADE_OPTIONS } from '@/config/constants';
import { useHistoryStore } from '@/store/useStore';
import { showToast } from '@/components/Shared/Toast';
import AnimatedNumber from '@/components/Shared/AnimatedNumber';
import { useOCR } from '@/hooks/useOCR';
import ImageUploader from '@/components/OCR/ImageUploader';
import RadarChartView from '@/components/Visualizations/RadarChart';
import GradeBarChart from '@/components/Visualizations/GradeBar';
import { generatePDF } from '@/utils/pdf/pdfGenerator';

export default function SGPAForm() {
  const [rows, setRows] = useState<Subject[]>([{ id: 1, name: '', credits: '', grade: '' }]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [exporting, setExporting] = useState(false);
  const addEntry = useHistoryStore(s => s.addEntry);
  const { loading, progress, processImage, reset: resetOCR } = useOCR();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cgpa-sg-inputs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setRows(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('cgpa-sg-inputs', JSON.stringify(rows)); } catch {}
  }, [rows]);

  const addRow = useCallback(() => {
    const maxId = rows.reduce((m, r) => Math.max(m, r.id || 0), 0);
    setRows(prev => [...prev, { id: maxId + 1, name: '', credits: '', grade: '' }]);
    setResult(null);
  }, [rows]);

  const updateRow = useCallback((id: number, field: keyof Subject, value: string) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, [field]: value } : r)));
    setResult(null);
  }, []);

  const removeRow = useCallback((id: number) => {
    setRows(prev => prev.filter(r => r.id !== id));
    setResult(null);
  }, []);

  const handleCalculate = useCallback(() => {
    if (!rows.length) { showToast('Add at least one subject', 'error'); return; }
    let valid = true;
    const next = rows.map(r => {
      const cv = parseFloat(r.credits as string);
      const gv = parseFloat(r.grade as string);
      const cErr = isNaN(cv) || cv <= 0;
      const gErr = isNaN(gv) || gv < 0;
      if (cErr || gErr) valid = false;
      return { ...r, creditsErr: cErr, gradeErr: gErr };
    });
    setRows(next);
    if (!valid) { showToast('Check all inputs — credits and grades required', 'error'); return; }
    const res = calculateSGPA(next);
    if (res) {
      setResult(res);
      addEntry({ type: 'SGPA', score: res.num, percentage: res.pct, subtitle: `${next.length} subject${next.length > 1 ? 's' : ''}`, subjects: next.filter(s => s.name || parseFloat(s.credits as string) > 0) });
      showToast(`SGPA: ${res.num.toFixed(2)}`, 'success');
    }
  }, [rows, addEntry]);

  const handleReset = useCallback(() => {
    setRows([{ id: 1, name: '', credits: '', grade: '' }]);
    setResult(null);
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (!result) return;
    setExporting(true);
    try {
      const validSubjects = rows.filter(s => s.name && parseFloat(s.credits as string) > 0);
      await generatePDF({ result, type: 'SGPA', subjects: validSubjects });
      showToast('PDF downloaded', 'success');
    } catch {
      showToast('PDF generation failed', 'error');
    } finally {
      setExporting(false);
    }
  }, [result, rows]);

  // OCR state
  const [ocrPreview, setOcrPreview] = useState<string | null>(null);
  const [ocrFileName, setOcrFileName] = useState<string | null>(null);
  const [ocrSubjects, setOcrSubjects] = useState<Subject[]>([]);

  const handleOCRFile = useCallback(async (file: File) => {
    setOcrFileName(file.name);
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPDF) {
      const reader = new FileReader();
      reader.onload = (ev) => setOcrPreview(ev.target.result as string);
      reader.readAsDataURL(file);
    } else {
      setOcrPreview('data:application/pdf;base64,placeholder');
    }
    const parsed = await processImage(file);
    if (parsed.length > 0) {
      setOcrSubjects(parsed.map((s, i) => ({ ...s, id: i + 1 })));
      showToast(`Parsed ${parsed.length} subjects`, 'success');
    } else {
      showToast('Could not detect subjects. Try a clearer screenshot.', 'error');
    }
  }, [processImage]);

  const handleOcrUpdate = useCallback((id: number, field: keyof Subject, value: string | number) => {
    setOcrSubjects(prev => prev.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  }, []);

  const handleOcrRemove = useCallback((id: number) => {
    setOcrSubjects(prev => prev.filter(s => s.id !== id));
  }, []);

  const handlePopulate = useCallback(() => {
    if (ocrSubjects.length === 0) return;
    const maxId = rows.reduce((m, r) => Math.max(m, r.id || 0), 0);
    setRows(ocrSubjects.map((s, i) => ({ ...s, id: maxId + i + 1 })));
    setResult(null);
    setShowUpload(false);
    setOcrSubjects([]);
    setOcrPreview(null);
    setOcrFileName(null);
    resetOCR();
    showToast(`Populated ${ocrSubjects.length} subjects`, 'success');
  }, [ocrSubjects, rows, resetOCR]);

  const handleCloseUpload = useCallback(() => {
    setShowUpload(false);
    setOcrSubjects([]);
    setOcrPreview(null);
    setOcrFileName(null);
    resetOCR();
  }, [resetOCR]);

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
          <span className="sec-icon"><i className="fa-solid fa-layer-group" /></span>
          Subjects this semester
        </span>
        <div className="sec-actions">
          <button className="btn" onClick={addRow}>
            <i className="fa-solid fa-plus" /> Add
          </button>
          <button className={`btn ${showUpload ? 'btn-primary' : ''}`} onClick={() => setShowUpload(v => !v)}>
            <i className="fa-solid fa-camera" /> Scan
          </button>
        </div>
      </div>

      {/* OCR Upload */}
      {showUpload && (
        <div style={{ marginBottom: 'var(--sp-4)', padding: 'var(--sp-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Upload Marksheet</span>
            <button className="rm-btn" onClick={handleCloseUpload}><i className="fa-solid fa-xmark" /></button>
          </div>
          <ImageUploader onFileSelect={handleOCRFile} loading={loading} preview={ocrPreview} fileName={ocrFileName} />
          {loading && (
            <div style={{ marginTop: 'var(--sp-3)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginBottom: 'var(--sp-2)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <i className="fa-solid fa-spinner fa-spin" /> Extracting subjects...
              </div>
              <div className="result-progress">
                <div className="result-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          {ocrSubjects.length > 0 && (
            <div style={{ marginTop: 'var(--sp-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-3)' }}>{ocrSubjects.length} subjects detected</span>
                <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
                  <button className="btn btn-sm btn-primary" onClick={handlePopulate}>Use These</button>
                  <button className="btn btn-sm" onClick={() => { setOcrSubjects([]); setOcrPreview(null); resetOCR(); }}>Clear</button>
                </div>
              </div>
              <div className="table-wrap" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table>
                  <thead><tr><th>Subject</th><th>Credits</th><th>Grade</th><th></th></tr></thead>
                  <tbody>
                    {ocrSubjects.map(s => (
                      <tr key={s.id}>
                        <td><input type="text" value={s.name} onChange={e => handleOcrUpdate(s.id, 'name', e.target.value)} /></td>
                        <td><input type="number" step="0.5" min="0" max="30" value={s.credits} onChange={e => handleOcrUpdate(s.id, 'credits', e.target.value)} /></td>
                        <td><input type="number" step="0.5" min="0" max="10" value={s.grade} onChange={e => handleOcrUpdate(s.id, 'grade', e.target.value)} /></td>
                        <td><button className="rm-btn" onClick={() => handleOcrRemove(s.id)}><i className="fa-solid fa-xmark" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subject Table */}
      <div className="table-wrap">
        <table aria-label="Subjects, credits, and grades">
          <thead>
            <tr>
              <th>Subject</th>
              <th style={{ width: '70px' }}>Credits</th>
              <th style={{ width: '120px' }}>Grade</th>
              <th style={{ width: '28px' }} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 'var(--sp-6)', color: 'var(--ink-4)', fontSize: 'var(--text-xs)' }}>Add subjects below or scan a marksheet</td></tr>
            )}
            {rows.map((r, idx) => (
              <tr key={r.id}>
                <td>
                  <input type="text" placeholder={`Subject ${idx + 1}`} value={r.name} onChange={(e) => updateRow(r.id, 'name', e.target.value)} aria-label={`Subject ${idx + 1} name`} />
                </td>
                <td>
                  <input type="number" min="0.5" max="30" step="0.5" placeholder="Cr" value={r.credits} onChange={(e) => updateRow(r.id, 'credits', e.target.value)} className={r.creditsErr ? 'invalid' : ''} aria-label={`Subject ${idx + 1} credits`} />
                </td>
                <td>
                  <select value={r.grade} onChange={(e) => updateRow(r.id, 'grade', e.target.value)} className={r.gradeErr ? 'invalid' : ''} aria-label={`Subject ${idx + 1} grade`}>
                    {GRADE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </td>
                <td>
                  <button className="rm-btn" aria-label={`Remove subject ${idx + 1}`} onClick={() => removeRow(r.id)}>
                    <i className="fa-solid fa-xmark" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="btn-row">
        <button className="btn btn-primary" onClick={handleCalculate}>
          <i className="fa-solid fa-calculator" /> Calculate SGPA
        </button>
        <button className="btn" onClick={handleReset}>
          <i className="fa-solid fa-rotate-left" /> Reset
        </button>
      </div>

      {/* Result */}
      <div className={`result${result ? ' show' : ''}`} aria-live="polite">
        {result && (() => {
          const tier = getTier(result.num);
          return (
            <div className={`result-card tier-${tier}`}>
              <div className={`result-badge ${tier}`}>{getBadgeText(tier)}</div>
              <AnimatedNumber value={result.num} />
              <div className="result-label">SGPA</div>
              <div className="result-progress">
                <div className="result-progress-fill" style={{ width: `${(result.num / 10) * 100}%` }} role="progressbar" aria-valuenow={result.num} aria-valuemin={0} aria-valuemax={10} />
              </div>
              <div className="result-pct">{result.pct?.toFixed(1)}%</div>
              <div className="result-meta">{result.meta}</div>
              <div className="result-actions">
                <button className="btn btn-sm" onClick={() => { navigator.clipboard?.writeText(`SGPA: ${result.num.toFixed(2)}`); showToast('Copied', 'success'); }}>
                  <i className="fa-solid fa-share-nodes" /> Share
                </button>
                <button className="btn btn-sm btn-primary" onClick={handleExportPDF} disabled={exporting}>
                  <i className={`fa-solid ${exporting ? 'fa-spinner fa-spin' : 'fa-file-pdf'}`} /> {exporting ? 'Exporting...' : 'Download PDF'}
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Visualizations */}
      {result && (() => {
        const valid = rows.filter(s => { const g = parseFloat(s.grade as string); return !isNaN(g) && g > 0 && s.name; });
        if (valid.length === 0) return null;
        return (
          <div style={{ marginTop: 'var(--sp-6)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--sp-4)' }}>
              <div style={{ padding: 'var(--sp-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--sp-3)' }}>Subject Performance</div>
                <RadarChartView subjects={valid} />
              </div>
              <div style={{ padding: 'var(--sp-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--sp-3)' }}>Grade Distribution</div>
                <GradeBarChart subjects={valid} />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
