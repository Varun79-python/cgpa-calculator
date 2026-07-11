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
  const msg: ToastMessage = { id, message, type, undoAction };
  toastListeners.forEach(fn => fn(msg));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (msg: ToastMessage) => {
      setToasts(prev => [...prev, msg]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== msg.id));
      }, 3000);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  const handleUndo = useCallback((msg: ToastMessage) => {
    msg.undoAction?.();
    setToasts(prev => prev.filter(t => t.id !== msg.id));
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center">
      {toasts.map(msg => (
        <div
          key={msg.id}
          className="flex items-center gap-3 px-5 py-3 border border-[var(--border)] bg-[var(--ink)] text-[var(--bg)] text-sm font-medium"
        >
          <i className={
            msg.type === 'success' ? 'fa-solid fa-circle-check' :
            msg.type === 'error' ? 'fa-solid fa-circle-exclamation' :
            'fa-solid fa-circle-info'
          } />
          <span>{msg.message}</span>
          {msg.undoAction && (
            <button
              onClick={() => handleUndo(msg)}
              className="ml-2 px-2 py-1 border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] text-xs font-bold"
            >
              UNDO
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
