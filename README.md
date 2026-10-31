# Coaching Fee Manager 2026–27 🎓

A complete, production-grade tuition and coaching fee management system for the academic session **June 2026 to March 2027**. Works seamlessly as a **responsive web app**, **installable PWA**, and **native Android APK**.

---

## 🌟 Key Features

1. **Strict Empty Database by Default**:
   - Starts with 0 students, ₹0 expected, ₹0 collected, and ₹0 pending fees.
   - Never loads dummy, mock, or sample data.
2. **10-Month Digital Fee Register (June 2026 – March 2027)**:
   - Modeled after academic tuition registers.
   - Interactive cell status badges:
     - ✅ **PAID**: Full monthly fee received.
     - ❌ **UNPAID**: Prior completed month with outstanding balance.
     - ➖ **NOT JOINED**: Months prior to student's joining date (never billed).
     - ❗ **MONTH NOT OVER**: Ongoing or future active month.
   - English and Hindi status legends.
3. **Student Management**:
   - Variable monthly fees per student (e.g. ₹500, ₹800, ₹1,200).
   - Joining date sensitivity (students are not billed for months before their enrollment).
   - Individual student profile and fee statement.
4. **Payments & Partial Installments**:
   - Partial payments, advance payments, and multiple payments per month.
   - Instant balance recalculation.
   - Payment modes: Cash, UPI, Bank Transfer, Other.
   - One-click printable PDF fee receipts.
5. **Comprehensive Reports & Exports**:
   - Yearly Fee Register in **A4 Landscape PDF** format.
   - Excel workbook export (`.xlsx`).
   - Plain CSV data export.
   - Outstanding balances list.
   - Interactive prompt dialog before export to verify institute headers.
6. **Bilingual Localization**:
   - Instant one-tap switch between **English** and **हिन्दी (Hindi)**.
7. **Offline-First Persistence**:
   - Powered by IndexedDB via Dexie.js.
   - Operates 100% offline with zero external cloud dependencies.
   - JSON Backup and Restore with schema verification.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Database**: IndexedDB with Dexie.js & Dexie React Hooks
- **Exports**: jsPDF, jsPDF-AutoTable, XLSX (SheetJS)
- **Mobile & Android**: Capacitor, Android Gradle, Android WebView with WebViewAssetLoader
- **DevOps**: GitHub Actions automated CI/CD APK builds

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Sync Web Assets to Android
```bash
npm run sync:android
```

---

## 📱 Automatic Android APK Builds with GitHub Actions

The repository includes an automated workflow at `.github/workflows/android-build.yml`.

### How to Get Your Android APK:
1. Push your repository to GitHub (`git push origin main`).
2. Open your repository on GitHub in a web browser.
3. Click on the **Actions** tab at the top.
4. Select the latest run of **Android APK Build**.
5. Once complete (green checkmark), scroll down to the **Artifacts** section.
6. Click **app-release** to download your ready-to-install Android APK (`app-release.apk`).
7. Transfer and install on your Android device!
