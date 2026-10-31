import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { Student, Payment, StudentFeeSummary } from './types';
import { calculateStudentFeeSummary } from './utils/feeCalculator';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { StudentModal } from './components/StudentModal';
import { PaymentModal } from './components/PaymentModal';

import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { FeeRegister } from './pages/FeeRegister';
import { Payments } from './pages/Payments';
import { Reports } from './pages/Reports';
import { BackupRestore } from './pages/BackupRestore';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Modals
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [preselectedStudentId, setPreselectedStudentId] = useState<string | undefined>();
  const [preselectedMonthKey, setPreselectedMonthKey] = useState<string | undefined>();

  // Live queries from Dexie
  const students = useLiveQuery(() => db.students.toArray()) || [];
  const monthlyFees = useLiveQuery(() => db.monthlyFees.toArray()) || [];
  const payments = useLiveQuery(() => db.payments.toArray()) || [];

  // Compute fee summaries for all students
  const summaries: StudentFeeSummary[] = students.map(student => {
    const studentFeeRecs = monthlyFees.filter(mf => mf.studentId === student.id);
    const studentPayments = payments.filter(p => p.studentId === student.id);
    return calculateStudentFeeSummary(student, studentFeeRecs, studentPayments);
  });

  const handleOpenAddStudent = () => {
    setStudentToEdit(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsStudentModalOpen(true);
  };

  const handleOpenRecordPayment = (studentId?: string, monthKey?: string) => {
    setPreselectedStudentId(studentId);
    setPreselectedMonthKey(monthKey);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Navbar
          onAddStudent={handleOpenAddStudent}
          onRecordPayment={() => handleOpenRecordPayment()}
          hasStudents={students.length > 0}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              summaries={summaries}
              payments={payments}
              onAddStudent={handleOpenAddStudent}
              onRecordPayment={() => handleOpenRecordPayment()}
              onNavigateToTab={setCurrentTab}
            />
          )}

          {currentTab === 'students' && (
            <Students
              summaries={summaries}
              onAddStudent={handleOpenAddStudent}
              onEditStudent={handleOpenEditStudent}
              onRecordPayment={(id) => handleOpenRecordPayment(id)}
              onRefresh={() => {}}
            />
          )}

          {currentTab === 'feeRegister' && (
            <FeeRegister
              summaries={summaries}
              onAddStudent={handleOpenAddStudent}
              onRecordPaymentForCell={(studentId, monthKey) => handleOpenRecordPayment(studentId, monthKey)}
            />
          )}

          {currentTab === 'payments' && (
            <Payments
              payments={payments}
              students={students}
              onRecordPayment={() => handleOpenRecordPayment()}
              onRefresh={() => {}}
            />
          )}

          {currentTab === 'reports' && (
            <Reports
              summaries={summaries}
              payments={payments}
            />
          )}

          {currentTab === 'backup' && (
            <BackupRestore
              onDataRestored={() => {}}
            />
          )}

          {currentTab === 'settings' && (
            <Settings
              onRefresh={() => {}}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Student Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setStudentToEdit(null);
        }}
        studentToEdit={studentToEdit}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPreselectedStudentId(undefined);
          setPreselectedMonthKey(undefined);
        }}
        students={students}
        preselectedStudentId={preselectedStudentId}
        preselectedMonthKey={preselectedMonthKey}
      />
    </div>
  );
};
export default App;
