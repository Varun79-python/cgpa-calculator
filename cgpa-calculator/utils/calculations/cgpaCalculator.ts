import { CalculationResult } from '@/types';

export interface CGPASemester {
  semester: number;
  sgpa: string | number;
  credits?: string | number;
}

export function calculateCGPA(semesters: CGPASemester[]): CalculationResult | null {
  const valid = semesters.filter(s => {
    const sgpa = parseFloat(s.sgpa as string);
    return !isNaN(sgpa) && sgpa > 0;
  });

  if (!valid.length) {
    return { num: 0, pct: 0, meta: 'No semesters entered yet' };
  }

  const hasCredits = valid.some(s => {
    const c = parseFloat(s.credits as string);
    return !isNaN(c) && c > 0;
  });

  let cgpa: number;
  if (hasCredits) {
    let totalCredits = 0;
    let totalPoints = 0;
    for (const s of valid) {
      const sgpa = parseFloat(s.sgpa as string);
      const credits = parseFloat(s.credits as string);
      if (isNaN(credits) || credits <= 0) continue; // skip invalid — never silently default to 1
      totalCredits += credits;
      totalPoints += sgpa * credits;
    }
    if (totalCredits === 0) {
      // Fall back to simple average if no valid credits
      const avg = valid.reduce((sum, s) => sum + parseFloat(s.sgpa as string), 0) / valid.length;
      cgpa = parseFloat(avg.toFixed(2));
    } else {
      cgpa = parseFloat((totalPoints / totalCredits).toFixed(2));
    }
  } else {
    const avg = valid.reduce((sum, s) => sum + parseFloat(s.sgpa as string), 0) / valid.length;
    cgpa = parseFloat(avg.toFixed(2));
  }

  const percentage = parseFloat(((cgpa - 0.5) * 10).toFixed(2));

  return {
    num: cgpa,
    pct: percentage,
    meta: `${valid.length} semester${valid.length > 1 ? 's' : ''} counted`,
  };
}
