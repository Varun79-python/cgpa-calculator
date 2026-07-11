export interface Subject {
  id: number;
  name: string;
  credits: number | string;
  grade: number | string;
  creditsErr?: boolean;
  gradeErr?: boolean;
}

export interface Semester {
  semester: number;
  sgpa: number | string;
  credits: number | string;
}

export interface CalculationResult {
  num: number;
  pct?: number;
  meta?: string;
  distribution?: Record<string, number>;
}

export interface HistoryEntry {
  id: string;
  type: 'SGPA' | 'CGPA' | 'CONVERTER' | 'PREDICTOR';
  score: number;
  percentage?: number;
  subtitle?: string;
  date: string;
  timestamp: number;
  subjects?: Subject[];
  semesters?: Semester[];
  metadata?: Record<string, unknown>;
}

export type DegreeType = 'diploma' | 'degree' | 'btech' | 'mtech';

export interface DegreeConfig {
  label: string;
  shortLabel: string;
  semesters: number;
  years: number;
  description: string;
}

export interface GradeMapping {
  label: string;
  value: number;
  color: string;
}

export interface UniversityFormula {
  id: string;
  name: string;
  description: string;
  formula: string;
  calculate: (cgpa: number, factor?: number) => number;
  inverse: (percentage: number, factor?: number) => number;
}
