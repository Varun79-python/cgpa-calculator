import { create } from 'zustand';
import { Subject, HistoryEntry, DegreeType } from '@/types';
import { STORAGE_KEYS, DEGREE_ORDER, DEGREE_CONFIG } from '@/config/constants';
import { getStorageItem, setStorageItem } from '@/utils/storage/localStorage';

type ThemeMode = 'light' | 'dark' | 'black' | 'white';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  cycleTheme: () => void;
}

interface HistoryState {
  history: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp' | 'date'>) => void;
  deleteEntry: (id: string) => void;
  clearAll: () => void;
  restoreEntry: (id: string) => HistoryEntry | undefined;
}

interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

interface CalculationState {
  sgpaSubjects: Subject[];
  cgpaSemesters: Array<{ semester: number; sgpa: string; credits: string }>;
  setSgpaSubjects: (subjects: Subject[]) => void;
  setCgpaSemesters: (semesters: Array<{ semester: number; sgpa: string; credits: string }>) => void;
}

interface DegreeState {
  degree: DegreeType;
  setDegree: (d: DegreeType) => void;
  cycleDegree: () => void;
}

/** Ordered list for cycling themes */
const THEME_CYCLE: ThemeMode[] = ['light', 'dark', 'black', 'white'];

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('cgpa-theme-mode') as ThemeMode | null;
  if (saved && THEME_CYCLE.includes(saved)) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (t) => {
    set({ theme: t });
    if (typeof window !== 'undefined') {
      localStorage.setItem('cgpa-theme-mode', t);
      applyThemeClass(t);
    }
  },
  cycleTheme: () => {
    const current = get().theme;
    const idx = THEME_CYCLE.indexOf(current);
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    get().setTheme(next);
  },
}));

/** Apply the theme class to <html> and remove all others */
export function applyThemeClass(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark', 'black', 'white');
  if (theme !== 'light') root.classList.add(theme);
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: typeof window !== 'undefined' ? getStorageItem<HistoryEntry[]>(STORAGE_KEYS.HISTORY, []) : [],

  addEntry: (entry) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      }),
    };
    const next = [newEntry, ...get().history].slice(0, 50);
    set({ history: next });
    setStorageItem(STORAGE_KEYS.HISTORY, next);
  },

  deleteEntry: (id) => {
    const next = get().history.filter(e => e.id !== id);
    set({ history: next });
    setStorageItem(STORAGE_KEYS.HISTORY, next);
  },

  clearAll: () => {
    set({ history: [] });
    setStorageItem(STORAGE_KEYS.HISTORY, []);
  },

  restoreEntry: (id) => {
    return get().history.find(e => e.id === id);
  },
}));

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  commandPaletteOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));

export const useCalculationStore = create<CalculationState>((set, get) => ({
  sgpaSubjects: [{ id: 1, name: '', credits: '', grade: '' }],
  cgpaSemesters: (() => {
    // Initialize with default degree's semester count
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.DEGREE) as DegreeType | null;
      const deg = saved && DEGREE_ORDER.includes(saved) ? saved : 'btech';
      return Array.from({ length: DEGREE_CONFIG[deg].semesters }, (_, i) => ({
        semester: i + 1,
        sgpa: '',
        credits: '',
      }));
    }
    return Array.from({ length: 8 }, (_, i) => ({
      semester: i + 1,
      sgpa: '',
      credits: '',
    }));
  })(),
  setSgpaSubjects: (subjects) => set({ sgpaSubjects: subjects }),
  setCgpaSemesters: (semesters) => set({ cgpaSemesters: semesters }),
}));

/** ── Degree Store ── */
function getInitialDegree(): DegreeType {
  if (typeof window === 'undefined') return 'btech';
  const saved = localStorage.getItem(STORAGE_KEYS.DEGREE) as DegreeType | null;
  if (saved && DEGREE_ORDER.includes(saved)) return saved;
  return 'btech';
}

export const useDegreeStore = create<DegreeState>((set, get) => ({
  degree: getInitialDegree(),
  setDegree: (d) => {
    set({ degree: d });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.DEGREE, d);
    }
    // Reset CGPA semester inputs when degree changes
    const config = DEGREE_CONFIG[d];
    useCalculationStore.getState().setCgpaSemesters(
      Array.from({ length: config.semesters }, (_, i) => ({
        semester: i + 1,
        sgpa: '',
        credits: '',
      }))
    );
  },
  cycleDegree: () => {
    const current = get().degree;
    const idx = DEGREE_ORDER.indexOf(current);
    const next = DEGREE_ORDER[(idx + 1) % DEGREE_ORDER.length];
    get().setDegree(next);
  },
}));
