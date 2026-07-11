import { useState, useCallback, useRef, useEffect } from 'react';

/* ── Undo/Redo Stack Hook ── */
/* Tracks state snapshots for Ctrl+Z / Ctrl+Shift+Z support */
export default function useUndoRedo(initialState, maxHistory = 30) {
  const [state, setState] = useState(initialState);
  const pastRef = useRef([]);
  const futureRef = useRef([]);
  const skipRef = useRef(false);
  const listenersRef = useRef([]);

  /* Push state onto history stack */
  const pushState = useCallback((newState) => {
    if (skipRef.current) {
      skipRef.current = false;
      return;
    }
    pastRef.current = [...pastRef.current.slice(-(maxHistory - 1)), state];
    futureRef.current = [];
    setState(newState);
  }, [state, maxHistory]);

  /* Replace current state (skip history) */
  const replaceState = useCallback((newState) => {
    skipRef.current = true;
    setState(newState);
  }, []);

  /* Undo */
  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return false;
    const prev = pastRef.current[pastRef.current.length - 1];
    futureRef.current = [state, ...futureRef.current];
    pastRef.current = pastRef.current.slice(0, -1);
    skipRef.current = true;
    setState(prev);
    return true;
  }, [state]);

  /* Redo */
  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return false;
    const next = futureRef.current[0];
    pastRef.current = [...pastRef.current, state];
    futureRef.current = futureRef.current.slice(1);
    skipRef.current = true;
    setState(next);
    return true;
  }, [state]);

  /* Reset history */
  const resetHistory = useCallback((newState) => {
    pastRef.current = [];
    futureRef.current = [];
    skipRef.current = true;
    setState(newState);
  }, []);

  /* Subscribe to undo/redo requests */
  const subscribe = useCallback((listener) => {
    listenersRef.current.push(listener);
    return () => {
      listenersRef.current = listenersRef.current.filter(l => l !== listener);
    };
  }, []);

  /* Notify listeners */
  const notifyUndo = useCallback(() => {
    listenersRef.current.forEach(l => l('undo'));
  }, []);

  const notifyRedo = useCallback(() => {
    listenersRef.current.forEach(l => l('redo'));
  }, []);

  return {
    state,
    setState: pushState,
    replaceState,
    undo,
    redo,
    resetHistory,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    subscribe,
    notifyUndo,
    notifyRedo,
  };
}

/* ── Hook for components that want Ctrl+Z support ── */
export function useUndoShortcut(undoFn, redoFn, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undoFn?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redoFn?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redoFn?.();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [undoFn, redoFn, enabled]);
}
