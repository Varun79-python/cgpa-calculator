import { useState, useCallback } from 'react';
import { Subject, CalculationResult } from '@/types';
import { generatePDF } from '@/utils/pdf/pdfGenerator';
import { showToast } from '@/components/Shared/Toast';

interface PDFGeneratorProps {
  result?: CalculationResult | null;
  type?: string;
  subjects?: Subject[];
}

export default function PDFGenerator({ result, type = 'GPA', subjects }: PDFGeneratorProps) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!result?.num && result?.num !== 0) {
      showToast('Calculate something first before exporting', 'error');
      return;
    }
    setGenerating(true);
    try {
      await generatePDF({
        result,
        type,
        subjects,
      });
      showToast('PDF report downloaded!', 'success');
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('PDF generation failed. Try again.', 'error');
    } finally {
      setGenerating(false);
    }
  }, [result, type, subjects]);

  return (
    <button
      className="btn btn-primary w-full justify-center"
      onClick={handleGenerate}
      disabled={generating}
      aria-label="Download PDF report"
    >
      <i className={`fa-solid ${generating ? 'fa-spinner fa-spin' : 'fa-file-pdf'}`} />
      {generating ? 'Generating…' : 'Download PDF Report'}
    </button>
  );
}
