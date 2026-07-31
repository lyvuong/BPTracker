# 🩺 BPTracker - Personal & Family Blood Pressure & Health Advisor PWA

**BPTracker** is a modern, responsive, offline-ready **Progressive Web Application (PWA)** built with **React 19**, **TypeScript 5.8**, **Vite 6**, and **Tailwind CSS 4**, designed to help individuals and families monitor blood pressure measurements, receive clinical AHA/ACC health advice, and export reports for healthcare providers.

---

## ✨ Features & Highlights

- 👨‍👩‍👧 **Personal & Family Health Profiles**: Effortlessly track and switch between multiple health profiles (Myself, Grandma, Spouse, Dad) with customized target BP ranges.
- 🩺 **AHA/ACC Blood Pressure Advice Engine**: Classifies readings in real-time into Normal, Elevated, Stage 1, Stage 2, and Hypertensive Crisis with tailored clinical health advice.
- 📊 **Interactive Analytics & Trends**: 7-day rolling averages, Mean Arterial Pressure (MAP), Pulse Pressure, and diurnal morning/evening variation tracking.
- ⏰ **Medication & BP Measurement Alarms**: Set scheduled daily BP check alarms and medication dosage reminders.
- 💾 **Doctor-Ready CSV & JSON Data Export**: Export full CSV logs formatted for physicians, or backup/restore complete app states via JSON.
- 🎨 **Clean Light Theme UI & Scalable SVG Icon**: Crisp accessible interface, fast touch controls, and high-DPI SVG vector icons.
- ⚡ **Offline-First PWA Capabilities**: Instant loading, service worker support, and offline LocalStorage fallback.
- 🚀 **Cloudflare Pages Deployment**: Optimized SPA build configuration for global edge deployment on Cloudflare Pages.

---

## 📱 How to Use BPTracker (User Guide & Screenshots)

### 1. 👤 Managing Health Profiles

Switch between yourself and family members, set custom target blood pressure ranges, and add personal notes:
- Click **Profiles** in the navigation bar to open the **Health Profiles Directory**.
- Click any profile card to instantly switch active users.
- Use **+ Add Health Profile** to create a new profile.

![Health Profiles Directory](docs/screenshots/profiles.png)

---

### 2. 📝 Logging Blood Pressure Readings

Log new measurements with instant clinical feedback:
- Click the **+ Log BP** button in the header or dashboard.
- Enter **Systolic**, **Diastolic**, and **Pulse** values.
- Select **Arm Used** (Left/Right) and **Body Position** (Sitting, Lying, Standing).
- Select context tags (e.g., `#Morning`, `#Fasting`, `#Post-Medication`, `#Resting`).
- Review live **AHA/ACC Clinical Evaluation** feedback before saving.

![Log BP Reading Modal](docs/screenshots/log_bp_modal.png)

---

### 3. 📊 Dashboard Overview & Health Advice

View a comprehensive snapshot of active profile vitals:
- **Latest Measurement**: Displays your most recent reading with color-coded AHA category badges.
- **7-Day Rolling Average**: Automatically calculates your 7-day average blood pressure and pulse.
- **Friendly Health Advice**: Provides actionable clinical guidance and recommended lifestyle steps based on AHA/ACC guidelines.
- **Hypertensive Crisis Warning**: Prominently alerts you if a reading exceeds 180/120 mmHg.

![Dashboard Overview](docs/screenshots/dashboard.png)

---

### 4. 📋 Reviewing Logs & Exporting Physician Reports

Review, search, and export blood pressure history:
- Filter entries by **Profile**, **AHA Category**, or **Date / Systolic Sort**.
- Search notes and context tags in real time using the search bar.
- Click **Export CSV** to download a spreadsheet formatted for doctor visits.
- Click **Print Report** for a clean printout of your logs.

![BP Logs History](docs/screenshots/bp_logs.png)

---

### 5. 📈 Clinical Analytics & Diurnal Variation

Analyze blood pressure trends and cardiac indicators:
- **Category Distribution**: View progress bars showing percentage breakdown across Normal, Elevated, Stage 1, Stage 2, and Crisis ranges.
- **Diurnal Surge Variation**: Compare morning (5 AM – 12 PM) vs. evening (5 PM – 11 PM) average systolic pressures.
- **Clinical Explanations**: Learn about **Mean Arterial Pressure (MAP)** and **Pulse Pressure** indicators.

![Clinical Analytics](docs/screenshots/analytics.png)

---

### 6. ⏰ Setting Alarms & Medication Reminders

Never miss a measurement or medication dose:
- Navigate to the **Reminders** tab.
- Click **+ Add Schedule Reminder**.
- Set daily alarm times for morning/evening BP checks or medication intake (with optional dosage details).

![Reminders & Alarms](docs/screenshots/reminders.png)

---

## 🚀 How to Host on Cloudflare Pages

BPTracker is fully optimized for **Cloudflare Pages** edge hosting. You can deploy it either via **GitHub Integration (Continuous Deployment)** or directly via **Wrangler CLI**.

### Option A: GitHub Integration (Recommended for Automated CD)

1. **Push Repository**: Ensure your latest changes are pushed to GitHub (`https://github.com/lyvuong/BPTracker`).
2. **Log in to Cloudflare**: Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
3. **Create Pages Project**:
   - Click **Create Application** → **Pages** → **Connect to Git**.
   - Select your GitHub account and authorize access to the `BPTracker` repository.
4. **Configure Build Settings**:
   - **Project Name**: `bptracker` (or your preferred name)
   - **Production Branch**: `main`
   - **Framework Preset**: `Vite` (or `None`)
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
5. **Set Node.js Version**:
   - Expand **Environment Variables (Advanced)**.
   - Add a variable: `NODE_VERSION` = `20` (Cloudflare Pages will also automatically detect Node 20 from `.nvmrc`).
6. **Deploy**: Click **Save and Deploy**. Cloudflare will build the Vite bundle and deploy it globally to a `*.pages.dev` domain in under 30 seconds!

---

### Option B: Deploy via Wrangler CLI (Command Line)

You can also deploy directly from your local terminal using Cloudflare's Wrangler CLI:

```bash
# 1. Install Wrangler CLI (if not already installed)
npm install -g wrangler

# 2. Build production bundle
npm run build

# 3. Deploy dist output folder to Cloudflare Pages
npx wrangler pages deploy dist --project-name=bptracker
```

---

### ℹ️ SPA Routing Note (`public/_redirects`)

Cloudflare Pages automatically reads `public/_redirects` included in this repository:
```text
/*  /index.html  200
```
This ensures client-side React routes and direct page refreshes resolve cleanly without `404 Not Found` errors.

---

## 🛠️ Technology Stack

- **Core**: React 19, TypeScript 5.8, Vite 6
- **Styling**: Tailwind CSS 4, Lucide Icons, Clean Light Design System
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

# Build for production
npm run build
```

---

## 👨‍💻 Developer & Author

- **Developer**: Ly Vuong (🐉 🐧 Dragon & Penguin Fan)
- **Repository**: [https://github.com/lyvuong/BPTracker](https://github.com/lyvuong/BPTracker)
- **License**: MIT
