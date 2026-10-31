import Dexie, { type Table } from 'dexie';
import { Student, MonthlyFeeRecord, Payment, InstituteSettings } from '../types';

export class CoachingFeeDatabase extends Dexie {
  students!: Table<Student, string>;
  monthlyFees!: Table<MonthlyFeeRecord, string>;
  payments!: Table<Payment, string>;
  settings!: Table<{ key: string; value: any }, string>;

  constructor() {
    super('CoachingFeeManagerDB');
    this.version(1).stores({
      students: 'id, name, joiningDate, monthlyFee, isActive, createdAt',
      monthlyFees: 'id, studentId, monthKey, updatedAt',
      payments: 'id, studentId, monthKey, paymentDate, paymentMethod, createdAt',
      settings: 'key',
    });
  }
}

export const db = new CoachingFeeDatabase();

// Default settings (Non-student, purely app configuration)
export const DEFAULT_SETTINGS: InstituteSettings = {
  instituteName: 'Coaching Fee Manager',
  tagline: 'Academic Session 2026–27',
  tutorName: '',
  contactNumber: '',
  address: '',
  session: '2026–27',
  defaultMonthlyFee: 1000,
  language: 'en',
  theme: 'system',
};

export async function getSettings(): Promise<InstituteSettings> {
  try {
    const item = await db.settings.get('institute_settings');
    if (item && item.value) {
      return { ...DEFAULT_SETTINGS, ...item.value };
    }
  } catch (err) {
    console.error('Error fetching settings:', err);
  }
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Partial<InstituteSettings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await db.settings.put({ key: 'institute_settings', value: updated });
}
