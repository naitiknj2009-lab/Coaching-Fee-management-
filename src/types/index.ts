export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE';
export type RetainerCadence = 'Monthly' | 'Sprint' | 'Bi-Weekly' | 'Quarterly';
export type PaymentMethod = 'Stripe' | 'Wire / ACH' | 'Credit Card' | 'Check' | 'Direct Transfer';
export type ReminderTone = 'Gentle Nudge' | 'Milestone Follow-up' | 'Urgent Ping';

export interface Client {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  activePackage: string;
  cadence: RetainerCadence;
  retainerFee: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  corporateSponsor?: string;
  notes?: string;
  ltv: number;
  joinedDate: string;
}

export interface Invoice {
  id: string; // e.g. "INV-2041"
  clientId: string;
  clientName: string;
  company: string;
  packageName: string;
  amount: number;
  period: string; // e.g. "Q4 2024"
  issuedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  clearedDate?: string; // YYYY-MM-DD
  status: InvoiceStatus;
  overdueDays?: number;
  dueDaysLeft?: number;
  paymentMethod?: PaymentMethod;
  lastPinged?: string;
  notes?: string;
  stripePaymentUrl?: string;
}

export interface ReminderLog {
  id: string;
  invoiceId: string;
  clientId: string;
  clientName: string;
  tone: ReminderTone;
  channel: 'Email' | 'SMS';
  sentAt: string;
  subject: string;
  preview: string;
  status: 'Delivered' | 'Opened' | 'Settled';
}

export interface PracticeProfile {
  coachName: string;
  practiceName: string;
  partnerStatus: string;
  tagline: string;
  email: string;
  phone: string;
  bankDetails: string;
  currencySymbol: string;
}

export interface FiscalPeriodData {
  period: string; // "Q4 2024", "Q3 2024", "YTD 2024"
  recognizedVolume: number;
  quarterlyGrowth: number;
  collectedAmount: number;
  dueAmount: number;
  paidPercentage: number;
  dsoDays: number;
}
