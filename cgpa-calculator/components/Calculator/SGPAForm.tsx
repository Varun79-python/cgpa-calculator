import { useState, useEffect, useCallback } from 'react';
import { Subject, CalculationResult } from '@/types';
import { calculateSGPA } from '@/utils/calculations/sgpaCalculator';
import { GRADE_OPTIONS } from '@/config/constants';
import { useHistoryStore } from '@/store/useStore';
import { showToast } from '@/components/Shared/Toast';
import AnimatedNumber from '@/components/Shared/AnimatedNumber';
import { useOCR } from '@/hooks/useOCR';
import ImageUploader from '@/components/OCR/ImageUploader';
import PerformanceMetrics from '@/components/Visualizations/PerformanceMetrics';
import RadarChartView from '@/components/Visualizations/RadarChart';
import GradeBarChart from '@/components/Visualizations/GradeBar';

export default function SGPAForm() {
  const [rows, setRows] = useState<Subject[]>([
    { id: 1, name: '', credits: '', grade: '' },
  ]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showUpload, setShowUpload] = useState(false);
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
      addEntry({
        type: 'SGPA',
        score: res.num,
        percentage: res.pct,
        subtitle: `${next.length} subject${next.length > 1 ? 's' : ''}`,
        subjects: next.filter(s => s.name || parseFloat(s.credits as string) > 0),
      });
      showToast(`SGPA: ${res.num.toFixed(2)}`, 'success');
    }
  }, [rows, addEntry]);

  const handleReset = useCallback(() => {
    setRows([{ id: 1, name: '', credits: '', grade: '' }]);
    setResult(null);
  }, []);

  // ── OCR: Upload Result ──
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

  const handleOcrUpdateSubject = useCallback((id: number, field: keyof Subject, value: string | number) => {
    setOcrSubjects(prev => prev.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  }, []);

  const handleOcrRemoveSubject = useCallback((id: number) => {
    setOcrSubjects(prev => prev.filter(s => s.id !== id));
  }, []);

  const handlePopulateRows = useCallback(() => {
    if (ocrSubjects.length === 0) return;
    const maxId = rows.reduce((m, r) => Math.max(m, r.id || 0), 0);
    const newRows = ocrSubjects.map((s, i) => ({
      ...s,
      id: maxId + i + 1,
    }));
    setRows(newRows);
    setResult(null);
    setShowUpload(false);
    setOcrSubjects([]);
    setOcrPreview(null);
    setOcrFileName(null);
    resetOCR();
    showToast(`Populated ${newRows.length} subjects`, 'success');
  }, [ocrSubjects, rows, resetOCR]);

  const handleCloseUpload = useCallback(() => {
    setShowUpload(false);
    setOcrSubjects([]);
    setOcrPreview(null);
    setOcrFileName(null);
    resetOCR();
  }, [resetOCR]);

  return (
    <div className="panel active">
      <div className="sec-head">
        <div className="sec-title">
          <span className="sec-icon"><i className="fa-solid fa-layer-group" /></span>
          <span>Subjects this semester</span>
        </div>
        <div className="sec-actions">
          <button className="btn btn-add" onClick={addRow}>
            <i className="fa-solid fa-plus" /> Add Subject
          </button>
          <button
            className={`btn ${showUpload ? 'btn-primary' : ''}`}
            onClick={() => setShowUpload(v => !v)}
          >
            <i className="fa-solid fa-camera" /> Upload Result
          </button>
        </div>
      </div>

      {/* ── Inline OCR Upload Section ── */}
      {showUpload && (
        <div className="mb-4 p-4 bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <i className="fa-solid fa-camera" />
              Upload Result — Auto-fill from marksheet
            </h4>
            <button
              onClick={handleCloseUpload}
              className="p-1.5 hover:bg-[var(--surface2)] text-[var(--ink-faint)]"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <ImageUploader onFileSelect={handleOCRFile} loading={loading} preview={ocrPreview} fileName={ocrFileName} />

          {loading && (
            <div className="mt-3 p-3 bg-[var(--surface2)]">
              <div className="flex items-center gap-2 mb-2 text-sm text-[var(--ink-mid)]">
                <i className="fa-solid fa-spinner fa-spin" />
                Extracting subjects & grades…
              </div>
              <div className="w-full h-1.5 bg-[var(--surface)] overflow-hidden">
                <div className="h-full bg-[var(--ink)] transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {ocrSubjects.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--ink-mid)]">
                  {ocrSubjects.length} subject{ocrSubjects.length > 1 ? 's' : ''} detected
                </span>
                <div className="flex gap-2">
                  <button className="btn btn-primary text-xs px-3 py-1.5" onClick={handlePopulateRows}>
                    <i className="fa-solid fa-arrow-right" /> Populate Table
                  </button>
                  <button className="btn text-xs px-3 py-1.5" onClick={() => { setOcrSubjects([]); setOcrPreview(null); setOcrFileName(null); resetOCR(); }}>
                    <i className="fa-solid fa-rotate-left" /> Clear
                  </button>
                </div>
              </div>
              <div className="tw max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Subject</th>
                      <th className="w-20">Credits</th>
                      <th className="w-20">Grade</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocrSubjects.map(s => (
                      <tr key={s.id}>
                        <td>
                          <input type="text" value={s.name}
                            onChange={e => handleOcrUpdateSubject(s.id, 'name', e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-[var(--ink)]" />
                        </td>
                        <td>
                          <input type="number" step="0.5" min="0" max="30" value={s.credits}
                            onChange={e => handleOcrUpdateSubject(s.id, 'credits', e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-center text-[var(--ink)]" />
                        </td>
                        <td>
                          <input type="number" step="0.5" min="0" max="10" value={s.grade}
                            onChange={e => handleOcrUpdateSubject(s.id, 'grade', e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-center text-[var(--ink)]" />
                        </td>
                        <td>
                          <button onClick={() => handleOcrRemoveSubject(s.id)}
                            className="p-1 text-[var(--ink-faint)] hover:text-[var(--ink)]">
                            <i className="fa-solid fa-xmark" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="tw">
        <table aria-label="Subjects, credits, and grades">
          <thead>
            <tr>
              <th id="sg-th-subject">Subject</th>
              <th id="sg-th-credits" style={{ width: '80px' }}>Credits</th>
              <th id="sg-th-grade" style={{ width: '150px' }}>Grade</th>
              <th style={{ width: '36px' }} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-faint)' }}>
                  Add subjects below, or use <strong>Upload Result</strong> to auto-fill from a marksheet screenshot
                </td>
              </tr>
            )}
            {rows.map((r, idx) => (
              <tr key={r.id}>
                <td>
                  <input
                    type="text"
                    placeholder={`Subject ${idx + 1}`}
                    value={r.name}
                    onChange={(e) => updateRow(r.id, 'name', e.target.value)}
                    aria-label={`Subject ${idx + 1} name`}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0.5"
                    max="30"
                    step="0.5"
                    placeholder="Cr"
                    value={r.credits}
                    onChange={(e) => updateRow(r.id, 'credits', e.target.value)}
                    className={(r as any).creditsErr ? 'invalid' : ''}
                    aria-label={`Subject ${idx + 1} credits`}
                  />
                </td>
                <td>
                  <select
                    value={r.grade}
                    onChange={(e) => updateRow(r.id, 'grade', e.target.value)}
                    className={(r as any).gradeErr ? 'invalid' : ''}
                    aria-label={`Subject ${idx + 1} grade`}
                  >
                    {GRADE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="gh">per your university</div>
                </td>
                <td>
                  <button
                    className="rm-btn"
                    aria-label={`Remove subject ${idx + 1}`}
                    onClick={() => removeRow(r.id)}
                  >
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

      {/* Inline visualizations after calculation */}
      {result && (() => {
        const validSubjects = rows.filter(s => {
          const g = parseFloat(s.grade as string);
          return !isNaN(g) && g > 0 && s.name;
        });
        if (validSubjects.length === 0) return null;
        return (
          <div className="mt-6 space-y-6">
            <PerformanceMetrics subjects={validSubjects} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="text-sm font-semibold mb-3 text-[var(--ink)]">Subject Performance</h3>
                <RadarChartView subjects={validSubjects} />
              </div>
              <div className="p-4 bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="text-sm font-semibold mb-3 text-[var(--ink)]">Grade Distribution</h3>
                <GradeBarChart subjects={validSubjects} />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
