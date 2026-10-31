# Coaching Fee Manager 2026–27

Production-grade cross-platform fee management system designed for coaching institutes, tuition centers, and tutors. Operates as a responsive web app, installable offline PWA, and native Android APK, backed by an empty-by-default persistent IndexedDB database with automated GitHub Actions APK builds.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product and design decisions have been aligned based on user clarification and specifications:

- **Theme & Aesthetic**: System default posture with automatic adaptation to device settings, plus a persistent manual toggle between High-Contrast Modern Light and Luxury Glassmorphic Dark modes.
- **Coaching Institute Branding on Exports**: Interactive prompt dialog before each PDF receipt or Register export allowing on-the-fly verification/customization of institute name, tagline, tutor name, phone number, and address, pre-filled with saved defaults from Settings.
- **Language**: English default on first launch with an instant 1-tap Hindi (हिंदी) language switch across all screens, dialogs, legends, and reports.
- **Strict Zero-Data Policy**: The app initializes with 0 students, 0 payments, ₹0 collected, ₹0 pending, and empty registers. No mock, seed, or demo data will ever be generated.

---

## 1. Overview & Core Concept

Coaching Fee Manager 2026–27 streamlines student enrollment, individual variable fee schedules, monthly attendance/fee registers (June 2026 to March 2027), partial/installment payments, balance tracking, and audit-ready financial reporting.

- **Target Audience**: Coaching institute directors, private tutors, academies, and administrative staff managing tuition fees.
- **Primary Platform Coverage**:
  1. **Responsive Web Application**: Optimized for desktops, laptops, tablets, and phones.
  2. **Installable PWA**: Offline-first service worker with persistent local storage.
  3. **Native Android APK**: Packaged with Capacitor & Android WebView integration, ready for standalone installation and GitHub Actions CI/CD automation.
- **Academic Session**: June 2026 to March 2027 (10-month academic cycle).

---

## 2. User Experience & Visual Design

### Key User Flows

1. **First Launch (Zero State)**:
   - Dashboard loads with zero metrics: 0 students, 0 active, ₹0 expected, ₹0 collected, ₹0 pending.
   - Prominent empty state card with an inviting `+ Add Your First Student` call-to-action.
2. **Student Onboarding**:
   - Modal/drawer to enter Student Name, Joining Date (defaults to session start or current date), Monthly Fee (custom per student), Phone Number, Notes, and Active status.
   - Immediate reactive calculation of expected fees starting strictly from the student's joining month.
3. **Interactive Fee Register Grid**:
   - Master grid: `Student Name | Joining Date | Jun | Jul | Aug | Sep | Oct | Nov | Dec | Jan | Feb | Mar`.
   - Each cell dynamically reflects payment state:
     - ✅ **PAID** (Green): Full expected fee received for the month.
     - ❌ **UNPAID** (Red): Prior completed month with outstanding balance.
     - ➖ **NOT JOINED** (Muted Slate): Month prior to student's joining date (never billed).
     - ❗ **MONTH NOT OVER** (Amber/Yellow): Current or future active month pending finalization.
   - Tapping any month cell opens the **Payment Ledger Modal** for that student-month to log full, partial, or multiple payments with receipt generation.
4. **Export & Print Flow**:
   - One-click export for A4 Landscape Fee Register, Individual Student Ledger, Monthly Collection Report, or Outstanding Balances in PDF, Excel (.xlsx), or CSV.
   - Confirmation dialog prompts for institute details before compiling download.

### Visual Identity & Theme Tokens

- **Light Mode**:
  - Background: Clean warm white `#F8FAFC` to `#FFFFFF`
  - Cards: Crisp frosted glass `#FFFFFF` with soft border `#E2E8F0` and shadow `0 4px 20px -2px rgba(0, 0, 0, 0.05)`
  - Primary Accent: Deep Indigo / Royal Navy `#1E3A8A` / `#2563EB`
  - Success/Paid: Emerald `#059669`
  - Pending/Unpaid: Crimson `#DC2626`
  - Not Over: Amber `#D97706`
- **Dark Mode**:
  - Background: Deep obsidian/slate `#090D16` with ambient luminous gradients
  - Cards: Translucent glass `rgba(255, 255, 255, 0.05)` with 1px specular rim `rgba(255, 255, 255, 0.12)`
  - Primary Accent: Vibrant Electric Blue `#3B82F6` and Indigo `#6366F1`
  - Text: High-contrast `text-zinc-100` and `text-zinc-400`
- **Typography**: Clean sans-serif pairing with complete Devanagari script font rendering for flawless bilingual English/Hindi output.

---

## 3. Key Product Decisions & Trade-Offs

- **Dexie.js (IndexedDB) Persistence**:
  - *Chosen Approach*: Client-side IndexedDB managed via Dexie.js with transactional schemas and automated reactive hooks.
  - *Why*: Guarantees 100% offline functionality, fast performance, zero hosting cost, no mandatory login/signup barrier, and persistence across app restarts in browser, PWA, and Android WebView.
  - *Alternatives Considered*: Remote cloud database was rejected to fulfill the user's explicit offline, zero-backend, privacy-first requirement.
- **Academic Month Logic (June 2026 – March 2027)**:
  - Students joining in August 2026 are marked `NOT JOINED` for June and July with ₹0 fee obligation.
  - Fee amount changes apply to future unrecorded months while strictly preserving historical fee amounts and prior payments.
- **Bilingual Engine**:
  - In-memory reactive dictionary for English and Hindi (हिंदी) with localStorage retention. Exported PDF reports embed standard UTF-8 text formatting and fallback tables so Hindi headers and status labels render reliably.

---

## 4. Technical Architecture & System Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COACHING FEE MANAGER                            │
├────────────────────────────────────────────────────────────────────────┤
│                           React 18 + Vite                              │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                     Navigation & Shell                         │   │
│   │  [Dashboard] [Students] [Register] [Payments] [Reports] [Set.]  │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │                                   │
│   ┌────────────────────────────────▼───────────────────────────────┐   │
│   │                    Core State & Modules                        │   │
│   │  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │   │
│   │  │ Student Mgmt │  │ Fee Register │  │ Payment & Ledgers     │  │   │
│   │  │ (CRUD, fees) │  │ (Jun-Mar 27) │  │ (Partials, methods)   │  │   │
│   │  └───────┬──────┘  └───────┬──────┘  └───────────┬───────────┘  │   │
│   │          │                 │                     │              │   │
│   │  ┌───────▼─────────────────▼─────────────────────▼───────────┐  │   │
│   │  │       Financial Calculator & Business Logic Engine        │  │   │
│   │  │ (Expected, Received, Balances, Status State Machine)      │  │   │
│   │  └─────────────────────────┬─────────────────────────────────┘  │   │
│   │                            │                                    │   │
│   │  ┌─────────────────────────▼─────────────────────────────────┐  │   │
│   │  │             Reports & Data Exchange Subsystem             │  │   │
│   │  │      [jsPDF]       [ExcelJS / SheetJS]      [JSON Backup]  │  │   │
│   │  └─────────────────────────┬─────────────────────────────────┘  │   │
│   └────────────────────────────┼───────────────────────────────────┘   │
│                                │                                       │
│   ┌────────────────────────────▼───────────────────────────────────┐   │
│   │              Dexie.js / IndexedDB Storage Layer                │   │
│   │     Tables: students, monthlyFees, payments, settings           │   │
│   └────────────────────────────┬───────────────────────────────────┘   │
│                                │                                       │
│   ┌────────────────────────────▼───────────────────────────────────┐   │
│   │                    Packaging & Delivery Targets                │   │
│   │  1. Web (Vite SPA)   2. PWA (Workbox)   3. Android APK (Cap.)  │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema Entities

1. `Student`:
   - `id`: string (UUID)
   - `name`: string
   - `joiningDate`: string (YYYY-MM-DD)
   - `monthlyFee`: number
   - `phone`: string (optional)
   - `notes`: string (optional)
   - `isActive`: boolean
   - `createdAt`: string
2. `MonthlyFeeRecord`:
   - `id`: string (`${studentId}_${year}_${month}`)
   - `studentId`: string
   - `sessionYear`: "2026-27"
   - `month`: number (1..10 corresponding to Jun 2026..Mar 2027)
   - `monthName`: string ("June", "July", etc.)
   - `expectedFee`: number
   - `status`: 'PAID' | 'UNPAID' | 'NOT_JOINED' | 'NOT_OVER'
   - `notes`: string
3. `Payment`:
   - `id`: string (UUID)
   - `studentId`: string
   - `feeRecordId`: string
   - `month`: number
   - `amount`: number
   - `paymentDate`: string (YYYY-MM-DD)
   - `paymentMethod`: 'Cash' | 'UPI' | 'Bank Transfer' | 'Other'
   - `transactionId`: string (optional)
   - `notes`: string (optional)
   - `createdAt`: string
4. `InstituteSettings`:
   - `instituteName`: string
   - `tagline`: string
   - `tutorName`: string
   - `contactNumber`: string
   - `address`: string
   - `language`: 'en' | 'hi'
   - `theme`: 'system' | 'light' | 'dark'

---

## 5. Implementation Stages & Build Plan

1. **Environment Setup & Web Application Core**:
   - Setup `package.json`, Vite configuration, Tailwind CSS, Lucide icons, Dexie.js, Recharts, jsPDF, ExcelJS, and canvas-confetti.
   - Configure responsive layout with desktop sidebar, mobile bottom navigation bar, and dark/light system theme provider.
2. **Database Engine & Zero-Data State**:
   - Initialize Dexie database with empty schema.
   - Build EmptyState UI components with zero data indicators across Dashboard, Students, Register, Payments, and Reports.
3. **Student Management Module**:
   - Full CRUD: Add Student modal, Edit Student modal, Delete with double-confirmation dialog.
   - Search by name, filter by active/inactive, sort by name, joining date, or balance.
   - Individual student profile view with ledger breakdown.
4. **Fee Register 2026–27 (June 2026 – March 2027)**:
   - Horizontal responsive grid for all 10 academic session months.
   - Four color-coded status badges with English and Hindi legends.
   - Interactive cell click to open quick-pay drawer or detailed ledger.
5. **Payment Management & Ledgers**:
   - Log full, partial, or multi-split payments per month with instant balance recalculation.
   - Payment history table with search, date filters, payment mode filters, and printable PDF receipt generation.
6. **Reports & Exports Engine**:
   - Monthly collection summary, yearly financial audit, student ledger, and full A4 landscape register table.
   - Export to PDF, Excel (.xlsx), and CSV.
   - Export-time modal prompting for institute details.
7. **Backup & Restore System**:
   - Export full JSON dump with cryptographic checksum and timestamp.
   - Validate and import JSON backups with safety preview dialog before applying.
8. **Bilingual Hindi/English Localization**:
   - Complete dictionary covering all UI labels, months, status badges, buttons, tooltips, and receipts.
9. **Android APK & PWA Packaging**:
   - Android WebView integration with hardware acceleration, file download handling, and back-button lifecycle.
   - PWA web app manifest (`manifest.webmanifest`) and service worker for offline browser installation.
10. **GitHub Actions Workflow CI/CD**:
    - Configure `.github/workflows/android-build.yml` to checkout code, install Node.js, build web app, setup Java 17 + Android SDK, build release/debug APK with Gradle, and upload `app-release.apk` artifact.
    - Comprehensive README with setup, run, and APK download instructions.
