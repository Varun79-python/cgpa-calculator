import { useState, useCallback } from 'react';
import { useOCR } from '@/hooks/useOCR';
import { Subject } from '@/types';
import { useHistoryStore } from '@/store/useStore';
import { showToast } from '@/components/Shared/Toast';
import ImageUploader from './ImageUploader';

interface OCRParserProps {
  onPopulateSubjects?: (subjects: Subject[]) => void;
}

export default function OCRParser({ onPopulateSubjects }: OCRParserProps) {
  const { loading, progress, subjects, extractedText, processImage, reset } = useOCR();
  const [preview, setPreview] = useState<string | null>(null);
  const [editingSubjects, setEditingSubjects] = useState<Subject[]>([]);
  const addEntry = useHistoryStore(s => s.addEntry);

  const handleFile = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result as string);
    reader.readAsDataURL(file);

    const parsedSubjects = await processImage(file);
    if (parsedSubjects.length > 0) {
      setEditingSubjects(parsedSubjects.map((s, i) => ({ ...s, id: i + 1 })));
      showToast(`Parsed ${parsedSubjects.length} subjects`, 'success');
    } else {
      showToast('Could not detect subjects. Try a clearer screenshot.', 'error');
    }
  }, [processImage]);

  const handleUpdateSubject = useCallback((id: number, field: keyof Subject, value: string | number) => {
    setEditingSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  }, []);

  const handleRemoveSubject = useCallback((id: number) => {
    setEditingSubjects(prev => prev.filter(s => s.id !== id));
  }, []);

  const handlePopulate = useCallback(() => {
    if (editingSubjects.length > 0 && onPopulateSubjects) {
      onPopulateSubjects(editingSubjects);
      showToast(`Populated ${editingSubjects.length} subjects to calculator`, 'success');
    }
  }, [editingSubjects, onPopulateSubjects]);

  const handleReset = useCallback(() => {
    reset();
    setPreview(null);
    setEditingSubjects([]);
  }, [reset]);

  return (
    <div className="space-y-6">
      <ImageUploader onFileSelect={handleFile} loading={loading} preview={preview} />

      {loading && (
        <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-2">
            <i className="fa-solid fa-spinner fa-spin text-[var(--violet)]" />
            <span className="text-sm text-[var(--ink-mid)]">Extracting text from image…</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--surface3)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--violet)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {editingSubjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <i className="fa-solid fa-list text-[var(--violet)]" />
              Extracted Subjects ({editingSubjects.length})
            </h4>
            <div className="flex gap-2">
              <button
                className="btn btn-primary text-xs px-3 py-1.5"
                onClick={handlePopulate}
              >
                <i className="fa-solid fa-arrow-right" /> Use in Calculator
              </button>
              <button
                className="btn text-xs px-3 py-1.5"
                onClick={handleReset}
              >
                <i className="fa-solid fa-rotate-left" /> Clear
              </button>
            </div>
          </div>

          <div className="tw max-h-64 overflow-y-auto">
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
                {editingSubjects.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => handleUpdateSubject(s.id, 'name', e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-[var(--ink)]"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="30"
                        value={s.credits}
                        onChange={(e) => handleUpdateSubject(s.id, 'credits', e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-center text-[var(--ink)]"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="10"
                        value={s.grade}
                        onChange={(e) => handleUpdateSubject(s.id, 'grade', e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-center text-[var(--ink)]"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleRemoveSubject(s.id)}
                        className="p-1 text-[var(--ink-faint)] hover:text-[var(--red)]"
                      >
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

      {extractedText && editingSubjects.length === 0 && (
        <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
          <h4 className="text-sm font-semibold mb-2">Raw Extracted Text</h4>
          <pre className="text-xs text-[var(--ink-mid)] whitespace-pre-wrap max-h-40 overflow-y-auto">
            {extractedText}
          </pre>
        </div>
      )}
    </div>
  );
}
