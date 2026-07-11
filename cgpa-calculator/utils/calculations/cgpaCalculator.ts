import { CalculationResult } from '@/types';
import { safeDivide } from '@/config/constants';

/** Round to fixed decimals to avoid floating-point issues */
function roundTo(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export interface CGPASemester {
  semester: number;
  sgpa: string | number;
  credits?: string | number;
}

export function calculateCGPA(semesters: CGPASemester[]): CalculationResult | null {
  const valid = semesters.filter(s => {
    const sgpa = parseFloat(s.sgpa as string);
    return !isNaN(sgpa) && sgpa >= 0;
  });

  if (!valid.length) {
    return { num: 0, pct: 0, meta: 'No semesters entered yet' };
  }

  let totalCredits = 0;
  let totalPoints = 0;
  let hasCredits = false;

  for (const s of valid) {
    const sgpa = parseFloat(s.sgpa as string);
    const credits = parseFloat(s.credits as string);
    if (!isNaN(credits) && credits > 0) {
      hasCredits = true;
      totalCredits = roundTo(totalCredits + credits, 4);
      totalPoints = roundTo(totalPoints + (sgpa * credits), 4);
    }
  }

  let cgpa: number;
  if (hasCredits && totalCredits > 0) {
    cgpa = roundTo(safeDivide(totalPoints, totalCredits), 2);
  } else {
    const sum = valid.reduce((acc, s) => acc + parseFloat(s.sgpa as string), 0);
    cgpa = roundTo(safeDivide(sum, valid.length), 2);
  }

  const percentage = roundTo(Math.max(0, (cgpa - 0.5) * 10), 2);

  return {
    num: cgpa,
    pct: percentage,
    meta: `${valid.length} semester${valid.length > 1 ? 's' : ''} counted`,
  };
}
