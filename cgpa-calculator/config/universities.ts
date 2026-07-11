import { UniversityFormula } from '@/types';

/** University-specific CGPA to Percentage conversion formulas */
export const UNIVERSITY_FORMULAS: UniversityFormula[] = [
  {
    id: 'standard',
    name: 'Standard (Most Universities)',
    description: 'Percentage = (CGPA - 0.5) × 10',
    formula: '% = (CGPA − 0.5) × 10',
    calculate: (cgpa: number) => Math.max(0, (cgpa - 0.5) * 10),
    inverse: (percentage: number) => Math.min(10, (percentage / 10) + 0.5),
  },
  {
    id: 'jntu',
    name: 'JNTU / JNTUH / JNTUK',
    description: 'Percentage = (CGPA - 0.5) × 10',
    formula: '% = (CGPA − 0.5) × 10',
    calculate: (cgpa: number) => Math.max(0, (cgpa - 0.5) * 10),
    inverse: (percentage: number) => Math.min(10, (percentage / 10) + 0.5),
  },
  {
    id: 'anna',
    name: 'Anna University',
    description: 'Percentage = CGPA × 10',
    formula: '% = CGPA × 10',
    calculate: (cgpa: number) => Math.max(0, cgpa * 10),
    inverse: (percentage: number) => Math.min(10, percentage / 10),
  },
  {
    id: 'vtu',
    name: 'VTU',
    description: 'Percentage = (CGPA - 0.75) × 10',
    formula: '% = (CGPA − 0.75) × 10',
    calculate: (cgpa: number) => Math.max(0, (cgpa - 0.75) * 10),
    inverse: (percentage: number) => Math.min(10, (percentage / 10) + 0.75),
  },
  {
    id: 'mumbai',
    name: 'Mumbai University',
    description: 'Percentage = (CGPA - 0.75) × 10',
    formula: '% = (CGPA − 0.75) × 10',
    calculate: (cgpa: number) => Math.max(0, (cgpa - 0.75) * 10),
    inverse: (percentage: number) => Math.min(10, (percentage / 10) + 0.75),
  },
  {
    id: 'custom',
    name: 'Custom Formula',
    description: 'Percentage = CGPA × Factor',
    formula: '% = CGPA × Factor',
    calculate: (cgpa: number, factor: number = 9.5) => Math.max(0, cgpa * factor),
    inverse: (percentage: number, factor: number = 9.5) => Math.min(10, percentage / factor),
  },
];

export function getFormulaById(id: string): UniversityFormula {
  return UNIVERSITY_FORMULAS.find(f => f.id === id) || UNIVERSITY_FORMULAS[0];
}
