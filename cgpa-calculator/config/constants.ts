import { DegreeType, DegreeConfig } from '@/types';

/** University-specific grading schemas */
export interface GradingSchema {
  id: string;
  name: string;
  grades: { label: string; value: number }[];
  maxCredits: number;
  minCredits: number;
  passGrade: number;
  hasAudit: boolean;
}

export const GRADING_SCHEMAS: GradingSchema[] = [
  {
    id: 'standard',
    name: 'Standard (Most Universities)',
    grades: [
      { label: 'O / S / A+ — 10', value: 10 },
      { label: 'A — 9', value: 9 },
      { label: 'B+ / B — 8', value: 8 },
      { label: 'C+ / C — 7', value: 7 },
      { label: 'D — 6', value: 6 },
      { label: 'E — 5', value: 5 },
      { label: 'F / AB — 0', value: 0 },
    ],
    maxCredits: 30,
    minCredits: 0.5,
    passGrade: 5,
    hasAudit: false,
  },
  {
    id: 'jntu',
    name: 'JNTU / JNTUH / JNTUK',
    grades: [
      { label: 'O — 10', value: 10 },
      { label: 'S — 9', value: 9 },
      { label: 'A+ — 8', value: 8 },
      { label: 'A — 7', value: 7 },
      { label: 'B+ — 6', value: 6 },
      { label: 'B — 5', value: 5 },
      { label: 'C — 4', value: 4 },
      { label: 'D — 3', value: 3 },
      { label: 'F — 0', value: 0 },
    ],
    maxCredits: 25,
    minCredits: 1,
    passGrade: 5,
    hasAudit: true,
  },
  {
    id: 'anna',
    name: 'Anna University',
    grades: [
      { label: 'O — 10', value: 10 },
      { label: 'A+ — 9', value: 9 },
      { label: 'A — 8', value: 8 },
      { label: 'B+ — 7', value: 7 },
      { label: 'B — 6', value: 6 },
      { label: 'C — 5', value: 5 },
      { label: 'F — 0', value: 0 },
    ],
    maxCredits: 28,
    minCredits: 1,
    passGrade: 5,
    hasAudit: true,
  },
  {
    id: 'vtu',
    name: 'VTU (Visvesvaraya Technological University)',
    grades: [
      { label: 'O — 10', value: 10 },
      { label: 'A+ — 9', value: 9 },
      { label: 'A — 8', value: 8 },
      { label: 'B+ — 7', value: 7 },
      { label: 'B — 6', value: 6 },
      { label: 'C — 5', value: 5 },
      { label: 'D — 4', value: 4 },
      { label: 'F — 0', value: 0 },
    ],
    maxCredits: 26,
    minCredits: 1,
    passGrade: 4,
    hasAudit: true,
  },
  {
    id: 'mumbai',
    name: 'Mumbai University',
    grades: [
      { label: 'O — 10', value: 10 },
      { label: 'A+ — 9', value: 9 },
      { label: 'A — 8', value: 8 },
      { label: 'B+ — 7', value: 7 },
      { label: 'B — 6', value: 6 },
      { label: 'C — 5', value: 5 },
      { label: 'D — 4', value: 4 },
      { label: 'F — 0', value: 0 },
    ],
    maxCredits: 24,
    minCredits: 1,
    passGrade: 4,
    hasAudit: false,
  },
  {
    id: 'custom',
    name: 'Custom / Other University',
    grades: [
      { label: '10', value: 10 },
      { label: '9', value: 9 },
      { label: '8', value: 8 },
      { label: '7', value: 7 },
      { label: '6', value: 6 },
      { label: '5', value: 5 },
      { label: '4', value: 4 },
      { label: '3', value: 3 },
      { label: '2', value: 2 },
      { label: '1', value: 1 },
      { label: '0', value: 0 },
    ],
    maxCredits: 30,
    minCredits: 0.5,
    passGrade: 4,
    hasAudit: false,
  },
];

export const DEFAULT_SCHEMA = 'standard';

/** Get grade options for a schema */
export function getGradeOptions(schemaId: string): { value: string; label: string }[] {
  const schema = GRADING_SCHEMAS.find(s => s.id === schemaId) || GRADING_SCHEMAS[0];
  const options = [{ value: '', label: 'Select Grade' }];
  schema.grades.forEach(g => {
    options.push({ value: g.value.toString(), label: g.label });
  });
  return options;
}

/** Get schema by ID */
export function getSchema(schemaId: string): GradingSchema {
  return GRADING_SCHEMAS.find(s => s.id === schemaId) || GRADING_SCHEMAS[0];
}

/** Validation rules */
export const VALIDATION = {
  MAX_CREDITS: 30,
  MIN_CREDITS: 0.5,
  MAX_GRADE: 10,
  MIN_GRADE: 0,
  MAX_SEMESTERS: 12,
  MAX_SUBJECTS: 50,
  MAX_CGPA: 10,
  MIN_CGPA: 0,
} as const;

/** Input validation helper */
export function validateCredits(value: string, maxCredits: number): { valid: boolean; error?: string } {
  if (!value) return { valid: false, error: 'Credits required' };
  const num = parseFloat(value);
  if (isNaN(num)) return { valid: false, error: 'Must be a number' };
  if (num < VALIDATION.MIN_CREDITS) return { valid: false, error: `Min ${VALIDATION.MIN_CREDITS}` };
  if (num > maxCredits) return { valid: false, error: `Max ${maxCredits}` };
  return { valid: true };
}

export function validateGrade(value: string, passGrade: number): { valid: boolean; error?: string } {
  if (!value) return { valid: false, error: 'Grade required' };
  const num = parseFloat(value);
  if (isNaN(num)) return { valid: false, error: 'Must be a number' };
  if (num < VALIDATION.MIN_GRADE) return { valid: false, error: 'Cannot be negative' };
  if (num > VALIDATION.MAX_GRADE) return { valid: false, error: `Max ${VALIDATION.MAX_GRADE}` };
  return { valid: true };
}

export function validateSGPA(value: string): { valid: boolean; error?: string } {
  if (!value) return { valid: false, error: 'Required' };
  const num = parseFloat(value);
  if (isNaN(num)) return { valid: false, error: 'Must be a number' };
  if (num < VALIDATION.MIN_CGPA) return { valid: false, error: 'Cannot be negative' };
  if (num > VALIDATION.MAX_CGPA) return { valid: false, error: `Max ${VALIDATION.MAX_CGPA}` };
  return { valid: true };
}

/** Clean input — remove non-numeric chars except decimal */
export function cleanNumericInput(value: string): string {
  return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
}

/** Prevent division by zero in SGPA/CGPA calculation */
export function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0 || isNaN(denominator)) return 0;
  if (isNaN(numerator)) return 0;
  return numerator / denominator;
}

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

export const DEGREE_ORDER: DegreeType[] = ['diploma', 'degree', 'btech', 'mtech'];

export const STORAGE_KEYS = {
  THEME: 'cgpa-theme-mode',
  DEGREE: 'cgpa-degree',
  SCHEMA: 'cgpa-schema',
  HISTORY: 'cgpa-history',
  CG_INPUTS: 'cgpa-cg-inputs',
  SG_INPUTS: 'cgpa-sg-inputs',
} as const;

export const APP_INFO = {
  name: 'CGPA Calculator',
  version: '4.0.0',
  description: 'CGPA · SGPA · Percentage Calculator for Diploma, Degree, B.Tech & M.Tech',
  url: 'https://cgpa-calculator.vercel.app',
} as const;
