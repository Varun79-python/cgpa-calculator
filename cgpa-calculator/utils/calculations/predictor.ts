export interface PredictorInput {
  currentCGPA: number;
  completedSemesters: number;
  targetCGPA: number;
  remainingSemesters: number;
}

export interface PredictorResult {
  requiredSGPA: number;
  feasible: boolean;
  message: string;
  gap: number;
  totalSemesters: number;
}

export function predictRequiredSGPA(input: PredictorInput): PredictorResult {
  const { currentCGPA, completedSemesters, targetCGPA, remainingSemesters } = input;
  const totalSemesters = completedSemesters + remainingSemesters;

  // Sum of SGPA so far = current CGPA × completed semesters
  const currentSum = currentCGPA * completedSemesters;
  // Total points needed for target = target CGPA × total semesters
  const targetTotal = targetCGPA * totalSemesters;
  // Points still needed
  const remainingNeeded = targetTotal - currentSum;

  let requiredSGPA = remainingNeeded / remainingSemesters;
  requiredSGPA = parseFloat(requiredSGPA.toFixed(2));

  let feasible = true;
  let message = '';

  if (requiredSGPA > 10) {
    feasible = false;
    const maxPossible = currentSum + (10 * remainingSemesters);
    const maxTarget = parseFloat((maxPossible / totalSemesters).toFixed(2));
    message = `Even scoring a perfect 10 in all ${remainingSemesters} remaining semester${remainingSemesters > 1 ? 's' : ''} will only give you ${maxTarget} CGPA. Try lowering your target to ${maxTarget}.`;
    requiredSGPA = 10;
  } else if (requiredSGPA < 0) {
    feasible = true;
    message = 'You already exceed this target! Just maintain your current performance.';
    requiredSGPA = 0;
  } else if (requiredSGPA <= 4) {
    message = 'Very achievable! A little effort is all you need.';
  } else if (requiredSGPA <= 6) {
    message = 'Moderately achievable. Steady effort will get you there.';
  } else if (requiredSGPA <= 8) {
    message = 'Challenging but possible. You will need consistent hard work.';
  } else {
    message = 'Very challenging. You will need near-perfect scores in every remaining semester.';
  }

  const gap = parseFloat((targetCGPA - currentCGPA).toFixed(2));

  return {
    requiredSGPA,
    feasible,
    message,
    gap,
    totalSemesters,
  };
}

export function calculateFeasibility(input: PredictorInput): number {
  const { requiredSGPA } = predictRequiredSGPA(input);
  if (requiredSGPA <= 0) return 100;
  if (requiredSGPA >= 10) return 0;
  return Math.max(0, Math.min(100, Math.round((1 - requiredSGPA / 10) * 100)));
}
