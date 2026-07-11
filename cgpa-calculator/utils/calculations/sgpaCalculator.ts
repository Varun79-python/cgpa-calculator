import { Subject, CalculationResult } from '@/types';
import { safeDivide } from '@/config/constants';

/** Round to fixed decimals to avoid floating-point issues */
function roundTo(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function calculateSGPA(subjects: Subject[]): CalculationResult | null {
  if (!subjects.length) return null;

  let totalCredits = 0;
  let totalPoints = 0;
  const distribution: Record<string, number> = {};
  let validCount = 0;

  for (const subj of subjects) {
    const credits = parseFloat(subj.credits as string);
    const grade = parseFloat(subj.grade as string);

    if (isNaN(credits) || isNaN(grade) || credits <= 0 || grade < 0) continue;

    totalCredits = roundTo(totalCredits + credits, 4);
    totalPoints = roundTo(totalPoints + (credits * grade), 4);
    validCount++;

    const gradeKey = getGradeLetter(grade);
    distribution[gradeKey] = (distribution[gradeKey] || 0) + 1;
  }

  // Zero-credit trap protection
  if (totalCredits <= 0 || validCount === 0) return null;

  const sgpa = roundTo(safeDivide(totalPoints, totalCredits), 2);
  const percentage = roundTo(Math.max(0, (sgpa - 0.5) * 10), 2);

  return {
    num: sgpa,
    pct: percentage,
    meta: `Total credits: ${totalCredits} | ${validCount} subject${validCount > 1 ? 's' : ''}`,
    distribution,
  };
}

export function getGradeLetter(gradePoint: number): string {
  if (gradePoint >= 10) return 'O';
  if (gradePoint >= 9) return 'A';
  if (gradePoint >= 8) return 'B+';
  if (gradePoint >= 7) return 'C+';
  if (gradePoint >= 6) return 'D';
  if (gradePoint >= 5) return 'E';
  return 'F';
}

export function getGradeColor(gradePoint: number): string {
  if (gradePoint >= 10) return '#ffd700';
  if (gradePoint >= 9) return '#9b7fff';
  if (gradePoint >= 8) return '#4dd9e0';
  if (gradePoint >= 7) return '#69f0ae';
  if (gradePoint >= 6) return '#f06292';
  if (gradePoint >= 5) return '#ffb74d';
  if (gradePoint >= 4) return '#f87171';
  return '#ef4444';
}
