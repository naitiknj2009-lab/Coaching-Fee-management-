# LedgerCoach 💼

**Executive Coaching Fee & Retainer Management Platform**  
*Mobile-First Web & Native Android Application*

---

## 🌟 Overview & Product Vision

**LedgerCoach** is a specialized, mobile-first financial operations suite built specifically for independent executive coaches, coaching collectives, and leadership advisory practices. It enables coaches to monitor retainer health, trigger courteous client payment nudges, issue new retainers on the go, and track collection velocity directly between client engagements.

---

## 🚀 Key Modules & Capabilities

### 1. Financial Performance & Hero KPI Module
- **Recognized Retainer Volume**: Total recognized volume (e.g., `$48,250.00`) with quarterly growth indicators (`+14.2%`).
- **Micro-Breakdown Chips**: Fast visual recognition of **Collected Cash** (`$38.7k collected`) vs. **Outstanding Due** (`$9.5k due`).
- **Circular Collection Velocity Gauge**: Real-time SVG ring showing percentage collected (e.g. `84% Paid`) and average Days Sales Outstanding (DSO: `5.4 days`).

### 2. Executive Command Center (2x2 Matrix)
- **+ New Charge**: Issue multi-month retainers, sprint commitments, or bi-weekly blocks with instant Stripe checkout links.
- **Send Reminders**: Dynamic badge indicating invoices due, opening courteous executive reminder templates.
- **Retainers Hub**: Direct access to client contracts and auto-renewing advisory scopes.
- **Export Ledger**: Audited CPA-ready PDF summaries and structured CSV workbooks.

### 3. Transaction Ledger & Payment Pipeline
- Full-text search across leader names, corporate sponsors, invoice IDs, and packages.
- Filter pills with dynamic counters: `All`, `Paid`, `Pending`, `Overdue`.
- Context-sensitive actions:
  - **Paid**: One-tap official PDF receipt generation.
  - **Pending**: Courteous "Remind" nudge trigger.
  - **Overdue**: High-priority "Urgent Ping" action.

### 4. Client Portfolio & Corporate Sponsors
- Executive profiles (e.g., Aria Thorne at Nexus Health, Marcus Sterling at FinScale).
- Corporate sponsorship notes (enterprise L&D, executive committee budgets).
- Client Lifetime Value (LTV) tracking and billing health indicators.

### 5. Communication Outbox & Tone Tuning
- High-trust scripts for senior executives:
  - **Gentle Nudge**: Courteous check-in on pending retainers.
  - **Milestone Follow-up**: Linked to upcoming coaching sprint reviews.
  - **Urgent Ping**: Professional follow-up with AP coordination options.
- Delivery audit trail logging sent pings, delivery timestamps, and channels (Email/SMS).

### 6. Analytics & DSO Velocity
- Monthly revenue acceleration charts.
- Days Sales Outstanding (DSO) tracking (benchmark &lt; 6 days).
- Top retainer accounts by lifetime value.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Plus Jakarta Sans, Lucide Icons, Recharts
- **Storage**: Offline-First IndexedDB via Dexie.js
- **Exports**: jsPDF, jsPDF-AutoTable
- **Mobile Container**: Android WebView with `WebViewAssetLoader`, Edge-to-Edge insets, and hardware acceleration
- **CI/CD Automation**: GitHub Actions workflow (`.github/workflows/android-build.yml`) for automated APK generation

---

## 📱 GitHub Actions Automated Android APK Builds

Whenever changes are pushed to `main`:
1. GitHub Actions initiates the **Android APK Build** workflow.
2. Sets up Node.js 20, builds web assets, and syncs them to Android.
3. Sets up JDK 21 and Gradle 9.3.1.
4. Restores signing keystore and accepts SDK licenses.
5. Assembles `app-release.apk` and uploads it to GitHub Actions Artifacts for download.
