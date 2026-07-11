import { useState, useCallback } from 'react';
import { Subject, CalculationResult } from '@/types';
import { generatePDF } from '@/utils/pdf/pdfGenerator';
import { showToast } from '@/components/Shared/Toast';

export default function PDFGenerator({ result, type = 'GPA', subjects }: { result?: CalculationResult | null; type?: string; subjects?: Subject[] }) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!result?.num && result?.num !== 0) { showToast('Calculate something first', 'error'); return; }
    setGenerating(true);
    try {
      await generatePDF({ result, type, subjects });
      showToast('PDF downloaded!', 'success');
    } catch (err) {
      console.error('PDF error:', err);
      showToast('PDF generation failed', 'error');
    } finally { setGenerating(false); }
  }, [result, type, subjects]);

  return (
    <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={generating} aria-label="Download PDF report">
      <i className={`fa-solid ${generating ? 'fa-spinner fa-spin' : 'fa-file-pdf'}`} />
      {generating ? 'Generating...' : 'Download PDF Report'}
    </button>
  );
}
