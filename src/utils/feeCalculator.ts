import { Student, MonthlyFeeRecord, Payment, StudentFeeSummary, MonthCalculation } from '../types';
import { ACADEMIC_MONTHS, isBeforeJoiningDate, isMonthNotOver } from './academicSession';

export function calculateStudentFeeSummary(
  student: Student,
  feeRecords: MonthlyFeeRecord[] = [],
  studentPayments: Payment[] = []
): StudentFeeSummary {
  const monthCalculations: MonthCalculation[] = [];
  let totalExpected = 0;
  let totalPaid = 0;
  let totalBalance = 0;
  let pendingMonthsCount = 0;

  // Map fee records by monthKey
  const feeRecordMap = new Map<string, MonthlyFeeRecord>();
  feeRecords.forEach(rec => feeRecordMap.set(rec.monthKey, rec));

  // Map payments by monthKey
  const paymentsByMonth = new Map<string, Payment[]>();
  studentPayments.forEach(p => {
    const list = paymentsByMonth.get(p.monthKey) || [];
    list.push(p);
    paymentsByMonth.set(p.monthKey, list);
  });

  for (const m of ACADEMIC_MONTHS) {
    const notJoined = isBeforeJoiningDate(m.key, student.joiningDate);
    const paymentsForMonth = paymentsByMonth.get(m.key) || [];
    const paidForMonth = paymentsForMonth.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    let expected = 0;
    if (!notJoined) {
      const explicitRec = feeRecordMap.get(m.key);
      expected = explicitRec ? Number(explicitRec.expectedFee) : Number(student.monthlyFee);
    }

    const remaining = Math.max(0, expected - paidForMonth);

    let status: MonthCalculation['status'] = 'NOT_JOINED';
    if (notJoined) {
      status = 'NOT_JOINED';
    } else {
      const explicitRec = feeRecordMap.get(m.key);
      if (explicitRec?.statusOverride) {
        status = explicitRec.statusOverride;
      } else if (paidForMonth >= expected && expected > 0) {
        status = 'PAID';
      } else if (paidForMonth > 0 && paidForMonth < expected) {
        // Partially paid is pending balance
        status = 'UNPAID';
      } else if (paidForMonth === 0) {
        if (isMonthNotOver(m.key)) {
          status = 'NOT_OVER';
        } else {
          status = 'UNPAID';
        }
      } else {
        // expected is 0 and paid is 0
        status = 'PAID';
      }
    }

    if (!notJoined) {
      totalExpected += expected;
      totalPaid += paidForMonth;
      totalBalance += remaining;
      if (status === 'UNPAID' || (status === 'NOT_OVER' && remaining > 0 && paidForMonth > 0)) {
        pendingMonthsCount++;
      }
    }

    monthCalculations.push({
      monthKey: m.key,
      monthName: m.name,
      hindiName: m.hindiName,
      expectedFee: expected,
      amountPaid: paidForMonth,
      remainingBalance: remaining,
      status,
      isNotJoined: notJoined,
      payments: paymentsForMonth,
    });
  }

  return {
    student,
    monthCalculations,
    totalExpected,
    totalPaid,
    totalBalance,
    pendingMonthsCount,
  };
}

export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount || 0);
  return '₹' + rounded.toLocaleString('en-IN');
}
