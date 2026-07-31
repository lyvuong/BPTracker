# 🩺 BPTracker - Multi-Patient Blood Pressure & Health Advisor PWA

**BPTracker** is a modern, responsive, offline-ready **Progressive Web Application (PWA)** built with **React 19**, **TypeScript 5.8**, **Vite 6**, and **Tailwind CSS 4**, designed to help individuals and caregivers monitor blood pressure measurements for multiple patients, receive clinical AHA/ACC health advice, and export reports for healthcare providers.

---

## ✨ Features & Highlights

- 👨‍👩‍👧 **Multi-Patient Caregiver Engine**: Effortlessly track and switch between multiple patient profiles (Grandma, Spouse, Dad, Self) with customized target BP ranges.
- 🩺 **AHA/ACC Blood Pressure Advice Engine**: Classifies readings in real-time into Normal, Elevated, Stage 1, Stage 2, and Hypertensive Crisis with tailored clinical health advice.
- 📊 **Interactive Analytics & Trends**: 7-day rolling averages, Mean Arterial Pressure (MAP), Pulse Pressure, and diurnal morning/evening variation tracking.
- ⏰ **Medication & BP Measurement Alarms**: Set scheduled daily BP check alarms and medication dosage reminders.
- 💾 **Doctor-Ready CSV & JSON Data Export**: Export full CSV logs formatted for physicians, or backup/restore complete app states via JSON.
- ⚡ **Offline-First PWA Capabilities**: Instant loading, service worker support, and offline LocalStorage fallback.
- 🚀 **Cloudflare Pages Deployment**: Optimized build configuration (`.nvmrc` set to Node 20 LTS) for global deployment on Cloudflare Pages.

---

## 🛠️ Technology Stack

- **Core**: React 19, TypeScript 5.8, Vite 6
- **Styling**: Tailwind CSS 4, Lucide Icons, Glassmorphism Design System
- **Hosting**: Cloudflare Pages (`public/_redirects` SPA rules)

---

## 💻 Local Development Setup

```bash
# Clone the repository
git clone https://github.com/lyvuong/BPTracker.git

# Navigate to project directory
cd BPTracker

# Install dependencies
npm install

# Start local dev server
npm run dev
```

---

## 👨‍💻 Developer & Author

- **Developer**: Ly Vuong
- **Repository**: [https://github.com/lyvuong/BPTracker](https://github.com/lyvuong/BPTracker)
- **License**: MIT
