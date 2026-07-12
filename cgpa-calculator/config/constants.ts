import { DegreeType, DegreeConfig } from '@/types';

/** University-specific grading schemas — All Indian University Systems */
export interface GradingSchema {
  id: string;
  name: string;
  grades: { label: string; value: number; description: string }[];
  maxCredits: number;
  minCredits: number;
  passGrade: number;
  hasAudit: boolean;
  maxGradePoints?: number;
}

export const GRADING_SCHEMAS: GradingSchema[] = [
  // ═══════════════════════════════════════
  // 1. STANDARD UGC CBCS (Baseline)
  // ═══════════════════════════════════════
  {
    id: 'ugc-cbcs',
    name: 'UGC CBCS (Standard)',
    grades: [
      { label: 'O', value: 10, description: 'Outstanding' },
      { label: 'A+', value: 9, description: 'Excellent' },
      { label: 'A', value: 8, description: 'Very Good' },
      { label: 'B+', value: 7, description: 'Good' },
      { label: 'B', value: 6, description: 'Above Average' },
      { label: 'C', value: 5, description: 'Average' },
      { label: 'P', value: 4, description: 'Pass' },
      { label: 'F', value: 0, description: 'Fail' },
    ],
    maxCredits: 30,
    minCredits: 0.5,
    passGrade: 4,
    hasAudit: false,
  },

  // ═══════════════════════════════════════
  // 2. JNTU / JNTUH / JNTUK (R22)
  // ═══════════════════════════════════════
  {
    id: 'jntu',
    name: 'JNTU / JNTUH / JNTUK (R22)',
    grades: [
      { label: 'O', value: 10, description: 'Outstanding (≥90%)' },
      { label: 'A+', value: 9, description: 'Excellent (80-89.99%)' },
      { label: 'A', value: 8, description: 'Very Good (70-79.99%)' },
      { label: 'B+', value: 7, description: 'Good (60-69.99%)' },
      { label: 'B', value: 6, description: 'Average (50-59.99%)' },
      { label: 'C', value: 5, description: 'Pass (40-49.99%)' },
      { label: 'F', value: 0, description: 'Fail (<40%)' },
      { label: 'Ab', value: 0, description: 'Absent' },
    ],
    maxCredits: 25,
    minCredits: 1,
    passGrade: 5,
    hasAudit: true,
  },

  // ═══════════════════════════════════════
  // 3. Anna University (2021 Reg)
  // ═══════════════════════════════════════
  {
    id: 'anna',
    name: 'Anna University (2021 Reg)',
    grades: [
      { label: 'O', value: 10, description: 'Outstanding (91-100)' },
      { label: 'A+', value: 9, description: 'Excellent (81-90)' },
      { label: 'A', value: 8, description: 'Very Good (71-80)' },
      { label: 'B+', value: 7, description: 'Good (61-70)' },
      { label: 'B', value: 6, description: 'Average (51-60)' },
      { label: 'C', value: 5, description: 'Satisfactory (50 — Min Pass)' },
      { label: 'RA', value: 0, description: 'Re-Appearance / Fail (<50)' },
    ],
    maxCredits: 28,
    minCredits: 1,
    passGrade: 5,
    hasAudit: true,
  },

  // ═══════════════════════════════════════
  // 4. VTU
  // ═══════════════════════════════════════
  {
    id: 'vtu',
    name: 'VTU (Visvesvaraya Technological University)',
    grades: [
      { label: 'O', value: 10, description: 'Outstanding (90-100)' },
      { label: 'A+', value: 9, description: 'Excellent (80-89)' },
      { label: 'A', value: 8, description: 'Very Good (70-79)' },
      { label: 'B+', value: 7, description: 'Good (60-69)' },
      { label: 'B', value: 6, description: 'Above Average (55-59)' },
      { label: 'C', value: 5, description: 'Average (50-54)' },
      { label: 'P', value: 4, description: 'Pass (40-49)' },
      { label: 'F', value: 0, description: 'Fail (<40)' },
    ],
    maxCredits: 26,
    minCredits: 1,
    passGrade: 4,
    hasAudit: true,
  },

  // ═══════════════════════════════════════
  // 5. Mumbai University (CBCS 10-point)
  // ═══════════════════════════════════════
  {
    id: 'mumbai',
    name: 'Mumbai University (CBCS)',
    grades: [
      { label: 'O', value: 10, description: 'Outstanding (80-100)' },
      { label: 'A+', value: 9, description: 'Excellent (70-79.99)' },
      { label: 'A', value: 8, description: 'Very Good (60-69.99)' },
      { label: 'B+', value: 7, description: 'Good (55-59.99)' },
      { label: 'B', value: 6, description: 'Above Average (50-54.99)' },
      { label: 'C', value: 5, description: 'Average (45-49.99)' },
      { label: 'D', value: 4, description: 'Pass (40-44.99)' },
      { label: 'F', value: 0, description: 'Fail / ATKT (<40)' },
    ],
    maxCredits: 24,
    minCredits: 1,
    passGrade: 4,
    hasAudit: false,
  },

  // ═══════════════════════════════════════
  // 6. KTU (Kerala) — Decimal grades!
  // ═══════════════════════════════════════
  {
    id: 'ktu',
    name: 'KTU (Kerala Technological University)',
    grades: [
      { label: 'S', value: 10, description: 'Outstanding' },
      { label: 'A+', value: 9, description: 'Excellent' },
      { label: 'A', value: 8.5, description: 'Very Good' },
      { label: 'B+', value: 8, description: 'Good' },
      { label: 'B', value: 7.5, description: 'Above Average' },
      { label: 'C', value: 7, description: 'Average' },
      { label: 'P', value: 6, description: 'Pass' },
      { label: 'F', value: 0, description: 'Fail' },
    ],
    maxCredits: 24,
    minCredits: 1,
    passGrade: 6,
    hasAudit: false,
    maxGradePoints: 10,
  },

  // ═══════════════════════════════════════
  // 7. GTU (Gujarat) — Double letters
  // ═══════════════════════════════════════
  {
    id: 'gtu',
    name: 'GTU (Gujarat Technological University)',
    grades: [
      { label: 'AA', value: 10, description: 'Outstanding' },
      { label: 'AB', value: 9, description: 'Excellent' },
      { label: 'BB', value: 8, description: 'Very Good' },
      { label: 'BC', value: 7, description: 'Good' },
      { label: 'CC', value: 6, description: 'Average' },
      { label: 'CD', value: 5, description: 'Below Average' },
      { label: 'DD', value: 4, description: 'Pass' },
      { label: 'FF', value: 0, description: 'Fail' },
    ],
    maxCredits: 25,
    minCredits: 1,
    passGrade: 4,
    hasAudit: false,
  },

  // ═══════════════════════════════════════
  // 8. MAKAUT (West Bengal)
  // ═══════════════════════════════════════
  {
    id: 'makaut',
    name: 'MAKAUT (West Bengal)',
    grades: [
      { label: 'O', value: 10, description: 'Outstanding' },
      { label: 'E', value: 9, description: 'Excellent' },
      { label: 'A', value: 8, description: 'Very Good' },
      { label: 'B', value: 7, description: 'Good' },
      { label: 'C', value: 6, description: 'Average' },
      { label: 'D', value: 5, description: 'Pass' },
      { label: 'F', value: 0, description: 'Fail' },
    ],
    maxCredits: 25,
    minCredits: 1,
    passGrade: 5,
    hasAudit: false,
  },

  // ═══════════════════════════════════════
  // 9. IIT / NIT / BITS (Relative grading)
  // ═══════════════════════════════════════
  {
    id: 'iit-nit',
    name: 'IIT / NIT / BITS (Relative Grading)',
    grades: [
      { label: 'EX', value: 10, description: 'Outstanding (Top 1-2%)' },
      { label: 'AA', value: 10, description: 'Excellent' },
      { label: 'AB', value: 9, description: 'Very Good' },
      { label: 'BB', value: 8, description: 'Good' },
      { label: 'BC', value: 7, description: 'Above Average' },
      { label: 'CC', value: 6, description: 'Average' },
      { label: 'CD', value: 5, description: 'Below Average' },
      { label: 'DD', value: 4, description: 'Pass' },
      { label: 'F', value: 0, description: 'Fail' },
    ],
    maxCredits: 20,
    minCredits: 1,
    passGrade: 4,
    hasAudit: false,
  },

  // ═══════════════════════════════════════
  // 10. Mumbai University (Legacy 7-point)
  // ═══════════════════════════════════════
  {
    id: 'mumbai-legacy',
    name: 'Mumbai University (Legacy 7-Point)',
    grades: [
      { label: 'O', value: 7, description: 'Outstanding (≥70%)' },
      { label: 'A', value: 6, description: 'Very Good (60-69.99%)' },
      { label: 'B', value: 5, description: 'Good (55-59.99%)' },
      { label: 'C', value: 4, description: 'Average (50-54.99%)' },
      { label: 'D', value: 3, description: 'Pass (45-49.99%)' },
      { label: 'E', value: 2, description: 'Pass (40-44.99%)' },
      { label: 'F', value: 0, description: 'Fail (<40%)' },
    ],
    maxCredits: 24,
    minCredits: 1,
    passGrade: 2,
    hasAudit: false,
    maxGradePoints: 7,
  },

  // ═══════════════════════════════════════
  // 11. Custom / Other University
  // ═══════════════════════════════════════
  {
    id: 'custom',
    name: 'Custom / Other University',
    grades: [
      { label: '10', value: 10, description: 'Grade Point 10' },
      { label: '9', value: 9, description: 'Grade Point 9' },
      { label: '8', value: 8, description: 'Grade Point 8' },
      { label: '7', value: 7, description: 'Grade Point 7' },
      { label: '6', value: 6, description: 'Grade Point 6' },
      { label: '5', value: 5, description: 'Grade Point 5' },
      { label: '4', value: 4, description: 'Grade Point 4' },
      { label: '3', value: 3, description: 'Grade Point 3' },
      { label: '2', value: 2, description: 'Grade Point 2' },
      { label: '1', value: 1, description: 'Grade Point 1' },
      { label: '0', value: 0, description: 'Grade Point 0' },
    ],
    maxCredits: 30,
    minCredits: 0.5,
    passGrade: 4,
    hasAudit: false,
  },
];

export const DEFAULT_SCHEMA = 'ugc-cbcs';

/** Get grade options for a schema */
export function getGradeOptions(schemaId: string): { value: string; label: string }[] {
  const schema = GRADING_SCHEMAS.find(s => s.id === schemaId) || GRADING_SCHEMAS[0];
  const options = [{ value: '', label: 'Select Grade' }];
  schema.grades.forEach(g => {
    options.push({ value: g.value.toString(), label: `${g.label} — ${g.value}` });
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

/** Parse CSV/bulk import data */
export function parseBulkImport(text: string): { name: string; credits: string; grade: string }[] {
  const lines = text.trim().split('\n');
  const results: { name: string; credits: string; grade: string }[] = [];

  for (const line of lines) {
    const parts = line.split(/[,\t|]/).map(p => p.trim());
    if (parts.length >= 2) {
      results.push({
        name: parts[0] || '',
        credits: parts[1] || '',
        grade: parts[2] || parts[1] || '',
      });
    }
  }

  return results;
}

export const DEGREE_CONFIG: Record<DegreeType, DegreeConfig> = {
  diploma: { label: 'Diploma', shortLabel: 'DIP', semesters: 6, years: 3, description: '3-Year Diploma' },
  degree: { label: 'Degree', shortLabel: 'DEG', semesters: 6, years: 3, description: '3-Year UG Degree' },
  btech: { label: 'B.Tech', shortLabel: 'B.Tech', semesters: 8, years: 4, description: '4-Year B.Tech' },
  mtech: { label: 'M.Tech', shortLabel: 'M.Tech', semesters: 4, years: 2, description: '2-Year M.Tech' },
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
  url: 'https://cgpacalculator7.vercel.app',
} as const;
