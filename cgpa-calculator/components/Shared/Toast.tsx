import { useEffect, useState, useCallback } from 'react';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  undoAction?: () => void;
}

let toastListeners: Array<(msg: ToastMessage) => void> = [];

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info', undoAction?: () => void) {
  const id = Date.now().toString(36);
  toastListeners.forEach(fn => fn({ id, message, type, undoAction }));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (msg: ToastMessage) => {
      setToasts(prev => [...prev, msg]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== msg.id)), 3000);
    };
    toastListeners.push(listener);
    return () => { toastListeners = toastListeners.filter(l => l !== listener); };
  }, []);

  const handleUndo = useCallback((msg: ToastMessage) => {
    msg.undoAction?.();
    setToasts(prev => prev.filter(t => t.id !== msg.id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map(msg => (
        <div key={msg.id} className="toast">
          <i className={msg.type === 'success' ? 'fa-solid fa-check' : msg.type === 'error' ? 'fa-solid fa-xmark' : 'fa-solid fa-info'} />
          <span>{msg.message}</span>
          {msg.undoAction && (
            <button onClick={() => handleUndo(msg)} style={{ marginLeft: '4px', padding: '2px 8px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'inherit', fontSize: 'var(--text-2xs)', fontWeight: 700, cursor: 'pointer' }}>UNDO</button>
          )}
        </div>
      ))}
    </div>
  );
}
