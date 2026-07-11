import { useRef, useState, useCallback } from 'react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
  preview?: string | null;
  /** File name to display (e.g. for PDFs that have no image preview) */
  fileName?: string | null;
}

export default function ImageUploader({ onFileSelect, loading, preview, fileName }: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const isPDF = preview?.startsWith('data:application/pdf') || fileName?.toLowerCase().endsWith('.pdf');

  const handleFile = useCallback((file: File) => {
    if (!file) return;
    // Accept images and PDFs
    if (file.type.startsWith('image/') || file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
        ${dragOver ? 'border-[var(--violet)] bg-[var(--violet-soft)]' : 'border-[var(--border)] hover:border-[var(--violet)]/50'}
        ${loading ? 'opacity-50 pointer-events-none' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileRef.current?.click()}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*,application/pdf"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />

      {loading ? (
        <div className="space-y-3">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-[var(--violet)]" />
          <p className="text-sm text-[var(--ink-mid)]">Processing…</p>
        </div>
      ) : preview ? (
        isPDF ? (
          <div className="space-y-3">
            <i className="fa-solid fa-file-pdf text-4xl text-[var(--red)]" />
            <p className="text-sm font-medium text-[var(--ink)] truncate max-w-full">
              {fileName || 'PDF document'}
            </p>
            <p className="text-xs text-[var(--ink-faint)]">Click to replace</p>
          </div>
        ) : (
          <div className="relative max-h-48 overflow-hidden rounded-lg">
            <img src={preview} alt="Upload preview" className="max-h-48 mx-auto object-contain" />
          </div>
        )
      ) : (
        <div className="space-y-3">
          <i className="fa-solid fa-cloud-arrow-up text-3xl text-[var(--ink-faint)]" />
          <p className="text-sm font-medium text-[var(--ink-mid)]">
            Drop your marksheet here
          </p>
          <p className="text-xs text-[var(--ink-faint)]">
            or click to browse · JPG, PNG, PDF
          </p>
        </div>
      )}
    </div>
  );
}
