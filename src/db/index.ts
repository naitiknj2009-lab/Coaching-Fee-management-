import Dexie, { type Table } from 'dexie';
import { Client, Invoice, ReminderLog, PracticeProfile } from '../types';

export class LedgerCoachDatabase extends Dexie {
  clients!: Table<Client, string>;
  invoices!: Table<Invoice, string>;
  reminders!: Table<ReminderLog, string>;
  settings!: Table<{ key: string; value: any }, string>;

  constructor() {
    super('LedgerCoachDB');
    this.version(1).stores({
      clients: 'id, name, company, status, activePackage',
      invoices: 'id, clientId, clientName, status, period, dueDate, amount',
      reminders: 'id, invoiceId, clientId, sentAt, tone',
      settings: 'key',
    });
  }
}

export const db = new LedgerCoachDatabase();

export const DEFAULT_PROFILE: PracticeProfile = {
  coachName: 'Elena Vance',
  practiceName: 'LedgerCoach',
  partnerStatus: 'ACTIVE PARTNER',
  tagline: 'TRACK. BILL. GROW.',
  email: 'elena@vanceadvisory.com',
  phone: '+1 (415) 890-4211',
  bankDetails: 'JP Morgan Chase • Private Banking ****8291',
  currencySymbol: '$',
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli_aria',
    name: 'Aria Thorne',
    title: 'VP of Product',
    company: 'Nexus Health',
    email: 'aria.thorne@nexushealth.io',
    phone: '+1 (415) 321-7788',
    activePackage: 'Executive Leadership Retainer',
    cadence: 'Monthly',
    retainerFee: 4500,
    status: 'ACTIVE',
    corporateSponsor: 'Sponsored by Nexus Health L&D',
    notes: 'Q4 focus on cross-functional alignment and board presence.',
    ltv: 27000,
    joinedDate: '2024-02-15',
  },
  {
    id: 'cli_marcus',
    name: 'Marcus Sterling',
    title: 'Chief Revenue Officer',
    company: 'FinScale Technologies',
    email: 'marcus@finscale.co',
    phone: '+1 (650) 912-3401',
    activePackage: 'C-Suite Advisory Sprint',
    cadence: 'Monthly',
    retainerFee: 5000,
    status: 'ACTIVE',
    corporateSponsor: 'Executive Committee Budget',
    notes: 'Bi-weekly cadence on enterprise sales restructuring.',
    ltv: 20000,
    joinedDate: '2024-05-01',
  },
  {
    id: 'cli_priya',
    name: 'Priya Mehta',
    title: 'Co-Founder & CEO',
    company: 'Stellar AI',
    email: 'priya@stellarai.com',
    phone: '+1 (408) 554-9022',
    activePackage: 'Founder Scale Retainer',
    cadence: 'Monthly',
    retainerFee: 6500,
    status: 'ACTIVE',
    corporateSponsor: 'Self-Sponsored Founder',
    notes: 'Series B transition coaching and executive hires onboarding.',
    ltv: 39000,
    joinedDate: '2024-01-10',
  },
  {
    id: 'cli_david',
    name: 'David Chen',
    title: 'Chief Technology Officer',
    company: 'Lumina Cloud',
    email: 'david.chen@luminacloud.com',
    phone: '+1 (206) 441-8930',
    activePackage: 'Executive Bi-Weekly',
    cadence: 'Bi-Weekly',
    retainerFee: 3500,
    status: 'ACTIVE',
    corporateSponsor: 'People Operations Budget',
    notes: 'Engineering leadership maturation post-IPO.',
    ltv: 14000,
    joinedDate: '2024-06-20',
  },
  {
    id: 'cli_sarah',
    name: 'Sarah Jenkins',
    title: 'Managing Director',
    company: 'Vanguard Ventures',
    email: 'sarah.j@vanguardvc.com',
    phone: '+1 (212) 880-9941',
    activePackage: 'Board Advisory Retainer',
    cadence: 'Quarterly',
    retainerFee: 7500,
    status: 'ACTIVE',
    corporateSponsor: 'Partnership Overhead',
    notes: 'Partner portfolio turnaround and mediation.',
    ltv: 30000,
    joinedDate: '2024-03-01',
  },
  {
    id: 'cli_jonathan',
    name: 'Jonathan Vance',
    title: 'EVP Global Operations',
    company: 'Apex Logistics',
    email: 'jvance@apexlogistics.com',
    phone: '+1 (312) 760-4491',
    activePackage: 'Executive Leadership Retainer',
    cadence: 'Monthly',
    retainerFee: 4750,
    status: 'ACTIVE',
    corporateSponsor: 'Corporate L&D Sponsor',
    notes: 'Executive team conflict navigation.',
    ltv: 28500,
    joinedDate: '2024-01-15',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2041',
    clientId: 'cli_marcus',
    clientName: 'Marcus Sterling',
    company: 'FinScale Technologies',
    packageName: 'C-Suite Advisory Sprint',
    amount: 5000,
    period: 'Q4 2024',
    issuedDate: '2024-10-15',
    dueDate: '2024-11-03', // Due in 3 days
    dueDaysLeft: 3,
    status: 'PENDING',
    paymentMethod: 'Wire / ACH',
    notes: 'Q4 Sprint Retainer (Session 1 & 2)',
    stripePaymentUrl: 'https://pay.stripe.com/demo/inv-2041',
  },
  {
    id: 'INV-2039',
    clientId: 'cli_aria',
    clientName: 'Aria Thorne',
    company: 'Nexus Health',
    packageName: 'Executive Leadership Retainer',
    amount: 4500,
    period: 'Q4 2024',
    issuedDate: '2024-10-01',
    dueDate: '2024-10-16',
    status: 'OVERDUE',
    overdueDays: 15,
    paymentMethod: 'Stripe',
    lastPinged: 'Pinged Today',
    notes: 'Monthly Executive Retainer - October 2024',
    stripePaymentUrl: 'https://pay.stripe.com/demo/inv-2039',
  },
  {
    id: 'INV-2038',
    clientId: 'cli_priya',
    clientName: 'Priya Mehta',
    company: 'Stellar AI',
    packageName: 'Founder Scale Retainer',
    amount: 6500,
    period: 'Q4 2024',
    issuedDate: '2024-10-01',
    dueDate: '2024-10-15',
    clearedDate: '2024-10-12',
    status: 'PAID',
    paymentMethod: 'Wire / ACH',
    notes: 'Monthly Retainer - October 2024 (Cleared via Wire)',
    stripePaymentUrl: 'https://pay.stripe.com/demo/inv-2038',
  },
  {
    id: 'INV-2035',
    clientId: 'cli_david',
    clientName: 'David Chen',
    company: 'Lumina Cloud',
    packageName: 'Executive Bi-Weekly',
    amount: 3500,
    period: 'Q4 2024',
    issuedDate: '2024-09-25',
    dueDate: '2024-10-10',
    status: 'OVERDUE',
    overdueDays: 21,
    paymentMethod: 'Stripe',
    notes: 'Bi-Weekly Advisory Block',
    stripePaymentUrl: 'https://pay.stripe.com/demo/inv-2035',
  },
  {
    id: 'INV-2034',
    clientId: 'cli_sarah',
    clientName: 'Sarah Jenkins',
    company: 'Vanguard Ventures',
    packageName: 'Board Advisory Retainer',
    amount: 7500,
    period: 'Q4 2024',
    issuedDate: '2024-10-05',
    dueDate: '2024-10-20',
    clearedDate: '2024-10-18',
    status: 'PAID',
    paymentMethod: 'Direct Transfer',
    notes: 'Q4 Strategic Advisory Fee',
    stripePaymentUrl: 'https://pay.stripe.com/demo/inv-2034',
  },
  {
    id: 'INV-2032',
    clientId: 'cli_jonathan',
    clientName: 'Jonathan Vance',
    company: 'Apex Logistics',
    packageName: 'Executive Leadership Retainer',
    amount: 4750,
    period: 'Q4 2024',
    issuedDate: '2024-10-01',
    dueDate: '2024-10-15',
    clearedDate: '2024-10-14',
    status: 'PAID',
    paymentMethod: 'Stripe',
    notes: 'October 2024 Retainer',
    stripePaymentUrl: 'https://pay.stripe.com/demo/inv-2032',
  },
  {
    id: 'INV-2029',
    clientId: 'cli_priya',
    clientName: 'Priya Mehta',
    company: 'Stellar AI',
    packageName: 'Founder Scale Retainer',
    amount: 6500,
    period: 'Q3 2024',
    issuedDate: '2024-09-01',
    dueDate: '2024-09-15',
    clearedDate: '2024-09-10',
    status: 'PAID',
    paymentMethod: 'Wire / ACH',
    notes: 'September 2024 Retainer',
    stripePaymentUrl: 'https://pay.stripe.com/demo/inv-2029',
  },
  {
    id: 'INV-2025',
    clientId: 'cli_aria',
    clientName: 'Aria Thorne',
    company: 'Nexus Health',
    packageName: 'Executive Leadership Retainer',
    amount: 4500,
    period: 'Q3 2024',
    issuedDate: '2024-09-01',
    dueDate: '2024-09-15',
    clearedDate: '2024-09-14',
    status: 'PAID',
    paymentMethod: 'Stripe',
    notes: 'September 2024 Retainer',
    stripePaymentUrl: 'https://pay.stripe.com/demo/inv-2025',
  },
  {
    id: 'INV-2022',
    clientId: 'cli_marcus',
    clientName: 'Marcus Sterling',
    company: 'FinScale Technologies',
    packageName: 'C-Suite Advisory Sprint',
    amount: 5000,
    period: 'Q3 2024',
    issuedDate: '2024-08-15',
    dueDate: '2024-09-01',
    clearedDate: '2024-08-30',
    status: 'PAID',
    paymentMethod: 'Wire / ACH',
    notes: 'August 2024 Retainer',
    stripePaymentUrl: 'https://pay.stripe.com/demo/inv-2022',
  },
];

export const INITIAL_REMINDERS: ReminderLog[] = [
  {
    id: 'rem_1',
    invoiceId: 'INV-2039',
    clientId: 'cli_aria',
    clientName: 'Aria Thorne',
    tone: 'Gentle Nudge',
    channel: 'Email',
    sentAt: '2024-10-25 09:30 AM',
    subject: 'Aria — Quick check-in regarding October Advisory Retainer (#INV-2039)',
    preview: 'Hi Aria, Hope our session on Tuesday provided clarity on the product re-org. Sharing a courteous note that your October retainer is pending...',
    status: 'Delivered',
  },
  {
    id: 'rem_2',
    invoiceId: 'INV-2035',
    clientId: 'cli_david',
    clientName: 'David Chen',
    tone: 'Urgent Ping',
    channel: 'SMS',
    sentAt: '2024-10-28 02:15 PM',
    subject: 'Urgent: Lumina Cloud Advisory Statement #INV-2035',
    preview: 'Hi David, checking in on invoice #INV-2035 ($3,500) which is 18 days past due. Would you like me to coordinate directly with AP?',
    status: 'Opened',
  },
];

// Initialize database with seed records if empty
export async function initializeDatabase(): Promise<void> {
  const clientCount = await db.clients.count();
  if (clientCount === 0) {
    await db.clients.bulkAdd(INITIAL_CLIENTS);
  }
  const invoiceCount = await db.invoices.count();
  if (invoiceCount === 0) {
    await db.invoices.bulkAdd(INITIAL_INVOICES);
  }
  const reminderCount = await db.reminders.count();
  if (reminderCount === 0) {
    await db.reminders.bulkAdd(INITIAL_REMINDERS);
  }
  const profileItem = await db.settings.get('practice_profile');
  if (!profileItem) {
    await db.settings.put({ key: 'practice_profile', value: DEFAULT_PROFILE });
  }
}

export async function getProfile(): Promise<PracticeProfile> {
  try {
    const item = await db.settings.get('practice_profile');
    if (item && item.value) {
      return { ...DEFAULT_PROFILE, ...item.value };
    }
  } catch (e) {
    console.error('Error loading profile:', e);
  }
  return DEFAULT_PROFILE;
}

export async function saveProfile(profile: Partial<PracticeProfile>): Promise<void> {
  const current = await getProfile();
  await db.settings.put({ key: 'practice_profile', value: { ...current, ...profile } });
}
