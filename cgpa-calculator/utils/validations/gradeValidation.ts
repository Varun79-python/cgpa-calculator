export function isValidGrade(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return false;
  return num >= 0 && num <= 10;
}

export function isValidCredit(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return false;
  return num > 0 && num <= 30;
}

export function isValidSGPA(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return false;
  return num >= 0 && num <= 10;
}

export function isValidPercentage(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return false;
  return num >= 0 && num <= 100;
}

export function sanitizeNumber(value: string): number {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}
