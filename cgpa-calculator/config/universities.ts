import { UniversityFormula } from '@/types';

export const UNIVERSITY_FORMULAS: UniversityFormula[] = [
  {
    id: 'standard',
    name: 'Standard Formula',
    description: 'Percentage = (CGPA - 0.5) × 10',
    formula: '% = (CGPA − 0.5) × 10',
    calculate: (cgpa: number) => (cgpa - 0.5) * 10,
    inverse: (percentage: number) => percentage / 10 + 0.5,
  },
  {
    id: 'mumbai',
    name: 'Mumbai University',
    description: 'Percentage = CGPA × 7.25 + 11',
    formula: '% = CGPA × 7.25 + 11',
    calculate: (cgpa: number) => cgpa * 7.25 + 11,
    inverse: (percentage: number) => (percentage - 11) / 7.25,
  },
  {
    id: 'vtu',
    name: 'VTU',
    description: 'Percentage = (CGPA - 0.75) × 10',
    formula: '% = (CGPA − 0.75) × 10',
    calculate: (cgpa: number) => (cgpa - 0.75) * 10,
    inverse: (percentage: number) => percentage / 10 + 0.75,
  },
  {
    id: 'anna',
    name: 'Anna University',
    description: 'Percentage = CGPA × 10',
    formula: '% = CGPA × 10',
    calculate: (cgpa: number) => cgpa * 10,
    inverse: (percentage: number) => percentage / 10,
  },
  {
    id: 'custom',
    name: 'Custom Formula',
    description: 'Percentage = CGPA × Factor',
    formula: '% = CGPA × Factor',
    calculate: (cgpa: number, factor: number = 9.5) => cgpa * factor,
    inverse: (percentage: number, factor: number = 9.5) => percentage / factor,
  },
];

export function getFormulaById(id: string): UniversityFormula {
  return UNIVERSITY_FORMULAS.find(f => f.id === id) || UNIVERSITY_FORMULAS[0];
}
