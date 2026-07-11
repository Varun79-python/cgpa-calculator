import { UniversityFormula } from '@/types';

export interface ConversionResult {
  gpa: number;
  percentage: number;
}

export function convertGPAtoPercentage(
  gpa: number,
  formula: UniversityFormula,
  customFactor?: number
): number {
  if (isNaN(gpa) || gpa < 0 || gpa > 10) return 0;
  return parseFloat(formula.calculate(gpa, customFactor).toFixed(2));
}

export function convertPercentageToGPA(
  percentage: number,
  formula: UniversityFormula,
  customFactor?: number
): number {
  if (isNaN(percentage) || percentage < 0 || percentage > 100) return 0;
  const gpa = formula.inverse(percentage, customFactor);
  return parseFloat(Math.min(Math.max(gpa, 0), 10).toFixed(2));
}

export function convertBidirectional(
  value: number,
  mode: 'gpa-to-pct' | 'pct-to-gpa',
  formula: UniversityFormula,
  customFactor?: number
): ConversionResult {
  if (mode === 'gpa-to-pct') {
    const pct = convertGPAtoPercentage(value, formula, customFactor);
    return { gpa: value, percentage: pct };
  } else {
    const gpa = convertPercentageToGPA(value, formula, customFactor);
    return { gpa, percentage: value };
  }
}
