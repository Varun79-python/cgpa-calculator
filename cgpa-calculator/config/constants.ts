import { DegreeType, DegreeConfig } from '@/types';

export const GRADE_POINTS: Record<string, number> = {
  'O': 10, 'S': 10, 'A+': 10,
  'A': 9,
  'B+': 8, 'B': 8,
  'C+': 7, 'C': 7,
  'D': 6, 'E': 5,
  'F': 0, 'AB': 0,
};

export const GRADE_OPTIONS = [
  { value: '', label: 'Select Grade' },
  { value: '10', label: 'O / S / A+ — 10' },
  { value: '9', label: 'A — 9' },
  { value: '8', label: 'B+ / B — 8' },
  { value: '7', label: 'C+ / C — 7' },
  { value: '6', label: 'D — 6' },
  { value: '5', label: 'E — 5' },
  { value: '0', label: 'F / AB — 0' },
];

/** All supported degree types and their academic structure */
export const DEGREE_CONFIG: Record<DegreeType, DegreeConfig> = {
  diploma: {
    label: 'Diploma',
    shortLabel: 'DIP',
    semesters: 6,
    years: 3,
    description: '3-Year Diploma',
  },
  degree: {
    label: 'Degree',
    shortLabel: 'DEG',
    semesters: 6,
    years: 3,
    description: '3-Year UG Degree (B.Sc/BA/B.Com)',
  },
  btech: {
    label: 'B.Tech',
    shortLabel: 'B.Tech',
    semesters: 8,
    years: 4,
    description: '4-Year B.Tech',
  },
  mtech: {
    label: 'M.Tech',
    shortLabel: 'M.Tech',
    semesters: 4,
    years: 2,
    description: '2-Year M.Tech / M.E.',
  },
};

/** Ordered list for switching */
export const DEGREE_ORDER: DegreeType[] = ['diploma', 'degree', 'btech', 'mtech'];

export const MAX_CREDITS = 30;
export const MIN_CREDITS = 0.5;

export const STORAGE_KEYS = {
  THEME: 'cgpa-theme',
  DEGREE: 'cgpa-degree',
  HISTORY: 'cgpa-history',
  CG_INPUTS: 'cgpa-cg-inputs',
  SG_INPUTS: 'cgpa-sg-inputs',
  MESH_INTENSITY: 'cgpa-mesh',
  SPOTLIGHT: 'cgpa-spotlight',
  TILT: 'cgpa-tilt',
} as const;

export const APP_INFO = {
  name: 'GPA Suite',
  version: '3.0.0',
  description: 'CGPA · SGPA · Percentage Calculator for Diploma, Degree, B.Tech & M.Tech',
  url: 'https://gpa-calc.app',
} as const;
