import { AcademicMonth } from '../types';

export const ACADEMIC_SESSION = '2026–27';

export const ACADEMIC_MONTHS: AcademicMonth[] = [
  { key: '2026-06', name: 'June', hindiName: 'जून', year: 2026, monthIndex: 5, order: 0 },
  { key: '2026-07', name: 'July', hindiName: 'जुलाई', year: 2026, monthIndex: 6, order: 1 },
  { key: '2026-08', name: 'August', hindiName: 'अगस्त', year: 2026, monthIndex: 7, order: 2 },
  { key: '2026-09', name: 'September', hindiName: 'सितंबर', year: 2026, monthIndex: 8, order: 3 },
  { key: '2026-10', name: 'October', hindiName: 'अक्टूबर', year: 2026, monthIndex: 9, order: 4 },
  { key: '2026-11', name: 'November', hindiName: 'नवंबर', year: 2026, monthIndex: 10, order: 5 },
  { key: '2026-12', name: 'December', hindiName: 'दिसंबर', year: 2026, monthIndex: 11, order: 6 },
  { key: '2027-01', name: 'January', hindiName: 'जनवरी', year: 2027, monthIndex: 0, order: 7 },
  { key: '2027-02', name: 'February', hindiName: 'फरवरी', year: 2027, monthIndex: 1, order: 8 },
  { key: '2027-03', name: 'March', hindiName: 'मार्च', year: 2027, monthIndex: 2, order: 9 },
];

/**
 * Checks if a given monthKey is before the student's joining month.
 * If so, the student is NOT JOINED for that month.
 */
export function isBeforeJoiningDate(monthKey: string, joiningDateStr: string): boolean {
  if (!joiningDateStr) return false;
  // monthKey is YYYY-MM
  const [mYear, mMonth] = monthKey.split('-').map(Number);
  const [jYear, jMonth] = joiningDateStr.split('-').map(Number);

  if (mYear < jYear) return true;
  if (mYear === jYear && mMonth < jMonth) return true;
  return false;
}

/**
 * Checks if a month is currently ongoing or in the future based on real-world date.
 * If the month is not over and full fee has not been received, it receives 'NOT_OVER' status.
 */
export function isMonthNotOver(monthKey: string): boolean {
  const [mYear, mMonth] = monthKey.split('-').map(Number);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  if (mYear > currentYear) return true;
  if (mYear === currentYear && mMonth >= currentMonth) return true;
  return false;
}
