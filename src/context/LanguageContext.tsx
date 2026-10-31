import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../db';

export type Language = 'en' | 'hi';

export interface Translations {
  appName: string;
  session: string;
  dashboard: string;
  students: string;
  feeRegister: string;
  payments: string;
  reports: string;
  backupRestore: string;
  settings: string;
  
  // Dashboard Metrics
  totalStudents: string;
  activeStudents: string;
  totalExpectedFees: string;
  totalFeesCollected: string;
  totalPendingFees: string;
  currentMonthCollection: string;
  studentsWithPending: string;
  recentPayments: string;
  noRecentPayments: string;
  monthlyCollectionChart: string;
  feeCollectionOverview: string;
  collectionProgress: string;
  
  // Actions
  addStudent: string;
  addFirstStudent: string;
  recordPayment: string;
  editStudent: string;
  deleteStudent: string;
  save: string;
  cancel: string;
  search: string;
  filter: string;
  all: string;
  active: string;
  inactive: string;
  confirmDelete: string;
  deleteWarning: string;
  exportPdf: string;
  exportExcel: string;
  exportCsv: string;
  printReceipt: string;
  
  // Student Form & List
  studentName: string;
  joiningDate: string;
  monthlyFee: string;
  phoneNumber: string;
  notes: string;
  status: string;
  actions: string;
  noStudentsFound: string;
  studentProfile: string;
  
  // Fee Register & Statuses
  paid: string;
  unpaid: string;
  notJoined: string;
  monthNotOver: string;
  statusLegend: string;
  paidDesc: string;
  unpaidDesc: string;
  notJoinedDesc: string;
  monthNotOverDesc: string;
  expected: string;
  received: string;
  balance: string;
  
  // Payments
  paymentDate: string;
  paymentMethod: string;
  amount: string;
  transactionId: string;
  cash: string;
  upi: string;
  bankTransfer: string;
  other: string;
  noPaymentsFound: string;
  receiptNumber: string;
  receipt: string;
  
  // Reports
  monthlyReport: string;
  yearlyReport: string;
  studentWiseReport: string;
  outstandingReport: string;
  yearlyFeeRegister: string;
  downloadReport: string;
  instituteDetailsPrompt: string;
  instituteName: string;
  tagline: string;
  tutorName: string;
  contactNumber: string;
  address: string;
  continueExport: string;
  
  // Backup
  exportBackup: string;
  importBackup: string;
  backupHelpText: string;
  restoreSuccess: string;
  invalidBackup: string;

  // Settings
  theme: string;
  lightMode: string;
  darkMode: string;
  systemMode: string;
  language: string;
}

const translationsEn: Translations = {
  appName: 'Coaching Fee Manager',
  session: 'Session 2026–27',
  dashboard: 'Dashboard',
  students: 'Students',
  feeRegister: 'Fee Register',
  payments: 'Payments',
  reports: 'Reports',
  backupRestore: 'Backup & Restore',
  settings: 'Settings',

  totalStudents: 'Total Students',
  activeStudents: 'Active Students',
  totalExpectedFees: 'Total Expected Fees',
  totalFeesCollected: 'Total Fees Collected',
  totalPendingFees: 'Total Pending Fees',
  currentMonthCollection: "Current Month's Collection",
  studentsWithPending: 'Students with Pending',
  recentPayments: 'Recent Payment Activity',
  noRecentPayments: 'No payments recorded yet.',
  monthlyCollectionChart: 'Monthly Fee Collection',
  feeCollectionOverview: 'Fee Collection Overview',
  collectionProgress: 'Collection Rate',

  addStudent: 'Add Student',
  addFirstStudent: '+ Add Your First Student',
  recordPayment: 'Record Payment',
  editStudent: 'Edit Student',
  deleteStudent: 'Delete Student',
  save: 'Save',
  cancel: 'Cancel',
  search: 'Search...',
  filter: 'Filter',
  all: 'All',
  active: 'Active',
  inactive: 'Inactive',
  confirmDelete: 'Are you sure you want to delete this record?',
  deleteWarning: 'This action cannot be undone and will permanently remove associated records.',
  exportPdf: 'Export PDF',
  exportExcel: 'Export Excel (.xlsx)',
  exportCsv: 'Export CSV',
  printReceipt: 'Print Receipt',

  studentName: 'Student Name',
  joiningDate: 'Joining Date',
  monthlyFee: 'Monthly Fee',
  phoneNumber: 'Phone Number',
  notes: 'Notes / Remarks',
  status: 'Status',
  actions: 'Actions',
  noStudentsFound: 'No students found. Add your first student to get started.',
  studentProfile: 'Student Ledger & Profile',

  paid: 'PAID',
  unpaid: 'UNPAID',
  notJoined: 'NOT JOINED',
  monthNotOver: 'MONTH NOT OVER',
  statusLegend: 'Status Legend (स्थिति विवरण)',
  paidDesc: 'Full monthly fee received',
  unpaidDesc: 'Fee has not been fully paid',
  notJoinedDesc: 'Student had not joined yet',
  monthNotOverDesc: 'Current month is still in progress',
  expected: 'Expected',
  received: 'Received',
  balance: 'Balance',

  paymentDate: 'Payment Date',
  paymentMethod: 'Payment Method',
  amount: 'Amount',
  transactionId: 'Transaction / Ref ID',
  cash: 'Cash',
  upi: 'UPI',
  bankTransfer: 'Bank Transfer',
  other: 'Other',
  noPaymentsFound: 'No payments found matching criteria.',
  receiptNumber: 'Receipt No.',
  receipt: 'Fee Receipt',

  monthlyReport: 'Monthly Collection Report',
  yearlyReport: 'Yearly Financial Summary',
  studentWiseReport: 'Student-Wise Fee Statement',
  outstandingReport: 'Outstanding Balance Report',
  yearlyFeeRegister: 'Yearly Fee Register (A4 Landscape)',
  downloadReport: 'Download Report',
  instituteDetailsPrompt: 'Confirm Institute Header for Export',
  instituteName: 'Coaching / Institute Name',
  tagline: 'Tagline / Class Details',
  tutorName: 'Tutor / Director Name',
  contactNumber: 'Contact Number',
  address: 'Address / Location',
  continueExport: 'Continue & Download',

  exportBackup: 'Download JSON Backup',
  importBackup: 'Restore from JSON Backup',
  backupHelpText: 'Safely backup all students, fee schedules, payments, and settings into a single file.',
  restoreSuccess: 'Database restored successfully!',
  invalidBackup: 'Invalid backup file structure. Please select a valid Coaching Fee Manager backup.',

  theme: 'Theme',
  lightMode: 'Light Mode',
  darkMode: 'Dark Mode',
  systemMode: 'System Theme',
  language: 'Language (भाषा)',
};

const translationsHi: Translations = {
  appName: 'कोचिंग फीस प्रबंधक',
  session: 'सत्र 2026–27',
  dashboard: 'डैशबोर्ड',
  students: 'छात्र',
  feeRegister: 'फीस रजिस्टर',
  payments: 'भुगतान',
  reports: 'रिपोर्ट्स',
  backupRestore: 'बैकअप एवं रिस्टोर',
  settings: 'सेटिंग्स',

  totalStudents: 'कुल छात्र',
  activeStudents: 'सक्रिय छात्र',
  totalExpectedFees: 'कुल अपेक्षित फीस',
  totalFeesCollected: 'कुल प्राप्त फीस',
  totalPendingFees: 'कुल बकाया फीस',
  currentMonthCollection: 'वर्तमान माह की वसूली',
  studentsWithPending: 'बकाया वाले छात्र',
  recentPayments: 'हालिया भुगतान गतिविधि',
  noRecentPayments: 'अभी तक कोई भुगतान दर्ज नहीं है।',
  monthlyCollectionChart: 'मासिक फीस संकलन',
  feeCollectionOverview: 'फीस वसूली अवलोकन',
  collectionProgress: 'वसूली प्रतिशत',

  addStudent: 'नया छात्र जोड़ें',
  addFirstStudent: '+ अपना पहला छात्र जोड़ें',
  recordPayment: 'भुगतान दर्ज करें',
  editStudent: 'छात्र विवरण बदलें',
  deleteStudent: 'छात्र हटाएं',
  save: 'सुरक्षित करें',
  cancel: 'रद्द करें',
  search: 'खोजें...',
  filter: 'फ़िल्टर',
  all: 'सभी',
  active: 'सक्रिय',
  inactive: 'निष्क्रिय',
  confirmDelete: 'क्या आप वाकई इस रिकॉर्ड को हटाना चाहते हैं?',
  deleteWarning: 'यह कार्रवाई वापस नहीं ली जा सकती और सभी संबंधित रिकॉर्ड हट जाएंगे।',
  exportPdf: 'PDF डाउनलोड',
  exportExcel: 'Excel (.xlsx) डाउनलोड',
  exportCsv: 'CSV डाउनलोड',
  printReceipt: 'रसीद प्रिंट करें',

  studentName: 'छात्र का नाम',
  joiningDate: 'प्रवेश तिथि (Joining Date)',
  monthlyFee: 'मासिक फीस',
  phoneNumber: 'मोबाइल नंबर',
  notes: 'टिप्पणी / विवरण',
  status: 'स्थिति',
  actions: 'कार्रवाई',
  noStudentsFound: 'कोई छात्र नहीं मिला। शुरू करने के लिए अपना पहला छात्र जोड़ें।',
  studentProfile: 'छात्र लेज़र एवं प्रोफ़ाइल',

  paid: 'जमा (PAID)',
  unpaid: 'बकाया (UNPAID)',
  notJoined: 'शामिल नहीं (NOT JOINED)',
  monthNotOver: 'माह प्रगति पर (NOT OVER)',
  statusLegend: 'स्थिति विवरण (Status Legend)',
  paidDesc: 'माह की पूरी फीस प्राप्त हो चुकी है',
  unpaidDesc: 'माह की फीस पूरी तरह जमा नहीं हुई है',
  notJoinedDesc: 'छात्र इस माह में शामिल नहीं हुआ था',
  monthNotOverDesc: 'वर्तमान माह अभी प्रगति पर है',
  expected: 'अपेक्षित',
  received: 'प्राप्त',
  balance: 'बकाया',

  paymentDate: 'भुगतान तिथि',
  paymentMethod: 'भुगतान माध्यम',
  amount: 'राशि',
  transactionId: 'ट्रांजेक्शन / संदर्भ संख्या',
  cash: 'नकद (Cash)',
  upi: 'यूपीआई (UPI)',
  bankTransfer: 'बैंक ट्रांसफर',
  other: 'अन्य',
  noPaymentsFound: 'कोई भुगतान रिकॉर्ड नहीं मिला।',
  receiptNumber: 'रसीद सं.',
  receipt: 'फीस रसीद',

  monthlyReport: 'मासिक वसूली रिपोर्ट',
  yearlyReport: 'वार्षिक वित्तीय सारांश',
  studentWiseReport: 'छात्र-वार फीस विवरण',
  outstandingReport: 'बकाया फीस रिपोर्ट',
  yearlyFeeRegister: 'वार्षिक फीस रजिस्टर (A4 लैंडस्केप)',
  downloadReport: 'रिपोर्ट डाउनलोड करें',
  instituteDetailsPrompt: 'एक्सपोर्ट हेतु संस्थान का विवरण जांचें',
  instituteName: 'कोचिंग / संस्थान का नाम',
  tagline: 'टैगलाइन / कक्षा विवरण',
  tutorName: 'शिक्षक / संचालक का नाम',
  contactNumber: 'संपर्क नंबर',
  address: 'पता / स्थान',
  continueExport: 'आगे बढ़ें एवं डाउनलोड करें',

  exportBackup: 'JSON बैकअप डाउनलोड करें',
  importBackup: 'JSON बैकअप से पुनर्स्थापित करें',
  backupHelpText: 'सभी छात्रों, फीस शेड्यूल, भुगतानों और सेटिंग्स का सुरक्षित एकल फ़ाइल बैकअप लें।',
  restoreSuccess: 'डेटा सफलतापूर्वक पुनर्स्थापित हो गया!',
  invalidBackup: 'अमान्य बैकअप फ़ाइल। कृपया सही कोचिंग फीस प्रबंधक फ़ाइल चुनें।',

  theme: 'थीम (Theme)',
  lightMode: 'लाइट मोड',
  darkMode: 'डार्क मोड',
  systemMode: 'सिस्टम थीम',
  language: 'भाषा (Language)',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: translationsEn,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    getSettings().then(s => {
      if (s.language) {
        setLanguageState(s.language);
      }
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveSettings({ language: lang });
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
  };

  const t = language === 'hi' ? translationsHi : translationsEn;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
