import { Subject, CalculationResult } from '@/types';

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

    totalCredits += credits;
    totalPoints += credits * grade;
    validCount++;

    const gradeKey = getGradeLetter(grade);
    distribution[gradeKey] = (distribution[gradeKey] || 0) + 1;
  }

  if (totalCredits === 0 || validCount === 0) return null;

  const sgpa = parseFloat((totalPoints / totalCredits).toFixed(2));
  const percentage = parseFloat(((sgpa - 0.5) * 10).toFixed(2));

  return {
    num: sgpa,
    pct: percentage,
    meta: `Total credits: ${totalCredits} | ${validCount} subject${validCount > 1 ? 's' : ''}`,
    distribution,
  };
}

export function getGradeLetter(gradePoint: number): string {
  if (gradePoint >= 10) return 'O';        // O/S/A+ = 10
  if (gradePoint >= 9) return 'A';         // A = 9
  if (gradePoint >= 8) return 'B+';        // B+/B = 8
  if (gradePoint >= 7) return 'C+';        // C+/C = 7
  if (gradePoint >= 6) return 'D';         // D = 6
  if (gradePoint >= 5) return 'E';         // E = 5
  return 'F';                               // F/AB = 0
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
