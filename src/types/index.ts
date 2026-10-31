export type PaymentStatus = 'PAID' | 'UNPAID' | 'NOT_JOINED' | 'NOT_OVER';

export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Other';

export interface Student {
  id: string;
  name: string;
  joiningDate: string; // YYYY-MM-DD
  monthlyFee: number;
  phone?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AcademicMonth {
  key: string; // e.g. "2026-06"
  name: string; // "June"
  hindiName: string; // "जून"
  year: number; // 2026
  monthIndex: number; // 5 (0-indexed for Date)
  order: number; // 0 to 9
}

export interface MonthlyFeeRecord {
  id: string; // `${studentId}_${monthKey}`
  studentId: string;
  monthKey: string; // e.g. "2026-06"
  expectedFee: number;
  statusOverride?: PaymentStatus;
  notes?: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  monthKey: string; // e.g. "2026-06"
  amount: number;
  paymentDate: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
  createdAt: string;
}

export interface InstituteSettings {
  instituteName: string;
  tagline: string;
  tutorName: string;
  contactNumber: string;
  address: string;
  session: string; // "2026-27"
  defaultMonthlyFee: number;
  language: 'en' | 'hi';
  theme: 'system' | 'light' | 'dark';
}

export interface MonthCalculation {
  monthKey: string;
  monthName: string;
  hindiName: string;
  expectedFee: number;
  amountPaid: number;
  remainingBalance: number;
  status: PaymentStatus;
  isNotJoined: boolean;
  payments: Payment[];
}

export interface StudentFeeSummary {
  student: Student;
  monthCalculations: MonthCalculation[];
  totalExpected: number;
  totalPaid: number;
  totalBalance: number;
  pendingMonthsCount: number;
}
