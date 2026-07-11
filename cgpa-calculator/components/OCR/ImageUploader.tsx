import { useRef, useState, useCallback } from 'react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
  preview?: string | null;
  fileName?: string | null;
}

export default function ImageUploader({ onFileSelect, loading, preview, fileName }: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const isPDF = preview?.startsWith('data:application/pdf') || fileName?.toLowerCase().endsWith('.pdf');

  const handleFile = useCallback((file: File) => {
    if (!file) return;
    if (file.type.startsWith('image/') || file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div
      className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
      style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files?.[0]; if (file) handleFile(file); }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onClick={() => fileRef.current?.click()}
    >
      <input ref={fileRef} type="file" accept="image/*,application/pdf" capture="environment" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} style={{ display: 'none' }} />
      {loading ? (
        <div><div className="upload-icon" style={{ background: 'var(--ink)', color: 'var(--surface)' }}><i className="fa-solid fa-spinner fa-spin" /></div><div className="upload-text">Processing...</div></div>
      ) : preview ? (
        isPDF ? (
          <div><div className="upload-icon"><i className="fa-solid fa-file-pdf" /></div><div className="upload-text">{fileName || 'PDF'}</div><div className="upload-hint">Click to replace</div></div>
        ) : (
          <div style={{ maxHeight: '120px', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}><img src={preview} alt="Preview" style={{ maxHeight: '120px', objectFit: 'contain' }} /></div>
        )
      ) : (
        <div><div className="upload-icon"><i className="fa-solid fa-cloud-arrow-up" /></div><div className="upload-text">Drop marksheet here</div><div className="upload-hint">or click to browse</div><div className="upload-formats"><span>JPG</span><span>PNG</span><span>PDF</span></div></div>
      )}
    </div>
  );
}
