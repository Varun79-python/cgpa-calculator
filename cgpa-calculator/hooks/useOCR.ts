import { useState, useCallback } from 'react';
import { Subject } from '@/types';
import { performOCR, OCRProgress } from '@/utils/ocr/tesseract';

interface UseOCRReturn {
  loading: boolean;
  progress: number;
  error: string | null;
  subjects: Subject[];
  extractedText: string;
  processImage: (file: File) => Promise<Subject[]>;
  reset: () => void;
}

export function useOCR(): UseOCRReturn {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [extractedText, setExtractedText] = useState('');

  const processImage = useCallback(async (file: File): Promise<Subject[]> => {
    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await performOCR(file, (p: OCRProgress) => {
        setProgress(Math.round(p.progress * 100));
      });

      setSubjects(result.subjects);
      setExtractedText(result.text);
      return result.subjects;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'OCR processing failed';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setProgress(0);
    setError(null);
    setSubjects([]);
    setExtractedText('');
  }, []);

  return { loading, progress, error, subjects, extractedText, processImage, reset };
}
