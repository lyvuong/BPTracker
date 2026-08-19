import React from 'react';
import {
  HeartPulse,
  Code2,
  Cpu,
  GitBranch,
  Globe,
  CheckCircle2,
  Activity,
  ExternalLink,
  Sparkles,
  Users,
  ShieldCheck,
  Bell,
  FileSpreadsheet,
  RotateCcw,
  Tag,
  Calendar,
  Server
} from 'lucide-react';
import { APP_VERSION, BUILD_DATE, BUILD_HASH, DISPLAY_VERSION } from '../../utils/version';

export const AboutPage: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const KEY_FEATURES = [
    {
      icon: Users,
      color: 'bg-rose-100 text-rose-700 border-rose-200',
      title: 'Multi-Patient Health Profiles',
      desc: 'Track yourself and family members side-by-side, each with an isolated measurement history and reminder schedule.'
    },
    {
      icon: Activity,
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      title: 'Interactive Trend Analytics',
      desc: 'Visualize systolic/diastolic trends, pulse pressure, and mean arterial pressure over time with interactive charts.'
    },
    {
      icon: ShieldCheck,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      title: 'AHA/ACC Clinical Advice Engine',
      desc: 'Automatic BP categorization and personalized health guidance based on official American Heart Association guidelines.'
    },
    {
      icon: Bell,
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      title: 'Measurement Reminders',
      desc: 'Schedule recurring reminders so readings stay consistent and no check-in gets missed.'
    },
    {
      icon: FileSpreadsheet,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      title: 'PDF & CSV Physician Reports',
      desc: 'Generate polished PDF reports and CSV exports to share your BP history with your doctor, with native mobile sharing support.'
    },
    {
      icon: RotateCcw,
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      title: 'Offline-First PWA',
      desc: 'Install as an app and keep logging measurements without a connection; data is stored locally via IndexedDB/LocalStorage.'
    }
  ];

  const TECH_STACK = [
    { name: 'Antigravity AI', category: 'AI Pair Programmer', desc: 'Google DeepMind Agentic Coding Platform 🚀' },
    { name: 'Gemini 3.6 Flash', category: 'LLM Engine', desc: 'Lightning Fast Zero-Defect Code & Architecture ⚡' },
    { name: 'React 19', category: 'UI Framework', desc: 'Concurrent State & Component Architecture' },
    { name: 'Vite 6', category: 'Build Tooling', desc: 'Fast ESM Production Bundling & HMR' },
    { name: 'TypeScript 5.8', category: 'Language', desc: 'Strict Clinical Type Definitions' },
    { name: 'Tailwind CSS 4', category: 'Styling Engine', desc: 'Modern Light Medical Interface' },
    { name: 'Cloudflare Pages', category: 'Hosting Platform', desc: 'Global Edge Network Distribution' },
    { name: 'PWA Offline', category: 'Storage Engine', desc: 'IndexedDB & LocalStorage Fallback' },
  ];

  const CLINICAL_CATEGORIES = [
    {
      range: '<120 AND <80 mmHg',
      category: 'Normal',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      advice: 'Healthy range. Maintain a balanced diet, hydration, and regular exercise.'
    },
    {
      range: '120-129 AND <80 mmHg',
      category: 'Elevated',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      advice: 'Likely to develop high blood pressure unless lifestyle changes are made.'
    },
    {
      range: '130-139 OR 80-89 mmHg',
      category: 'Hypertension Stage 1',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
      advice: 'Doctors often prescribe lifestyle changes or medication based on risk factors.'
    },
    {
      range: '140+ OR 90+ mmHg',
      category: 'Hypertension Stage 2',
      badgeClass: 'bg-red-100 text-red-800 border-red-200',
      advice: 'Combination of blood pressure medications and lifestyle adjustments recommended.'
    },
    {
      range: '>180 AND/OR >120 mmHg',
      category: 'Hypertensive Crisis',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-mono animate-pulse',
      advice: '⚠️ Emergency Alert: Consult your doctor immediately or seek emergency medical care.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Hero Brand Banner */}
      <div className="relative overflow-hidden bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs text-center sm:text-left">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-xs font-mono">
                Personal & Family Edition
              </span>
              <span className="text-xs font-mono font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                v{APP_VERSION} Stable
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight flex items-center justify-center sm:justify-start gap-3">
              <HeartPulse className="w-9 h-9 text-rose-600" />
              <span>BPTracker PWA</span>
            </h1>

            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              A Progressive Web Application for tracking blood pressure measurements for yourself or family members, featuring interactive trend analytics and automated clinical health advice based on AHA/ACC guidelines.
            </p>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
            <div className="p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center min-w-[140px]">
              <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">App Version</span>
              <span className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1.5 justify-center mt-0.5">
                <Tag className="w-3.5 h-3.5 text-rose-600" />
                v{APP_VERSION}
              </span>
              {BUILD_HASH && (
                <span className="text-[10px] text-rose-700 font-mono font-bold block mt-1 bg-rose-50 rounded-md px-1.5 py-0.5 border border-rose-200">
                  build #{BUILD_HASH}
                </span>
              )}
            </div>

            <div className="p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center min-w-[140px]">
              <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">Environment</span>
              <span className="text-sm font-bold text-emerald-700 font-mono flex items-center gap-1.5 justify-center mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Cloudflare Edge
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Information */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200">
            <Code2 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-900 font-display">Developer Information</h2>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-600 p-1 shadow-lg shadow-rose-500/20">
              <img 
                src="/avatar.png" 
                alt="Ly Vuong - Dragon Penguin Avatar" 
                className="w-full h-full rounded-[12px] object-cover bg-white"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-xs" title="Dragon & Penguin Enthusiast • Lead Developer">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Ly Vuong</h3>
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span>Creator & Lead Architect</span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200 font-mono">
                    🐉 🐧 Dragon & Penguin Fan
                  </span>
                </p>
              </div>

              <a
                href="https://github.com/lyvuong/BPTracker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition-all self-center sm:self-auto shadow-xs"
              >
                <GitBranch className="w-4 h-4 text-rose-600" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Designed for personal health tracking, family care, and caregivers. Engineered with privacy-first client-side data isolation, physician CSV export, and offline PWA capabilities.
            </p>

            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-3.5 rounded-xl border border-rose-200 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5 flex-wrap">
                <span>🤖 Pair Programmed with:</span>
                <span className="font-extrabold text-rose-600 font-mono">Google DeepMind Antigravity × Gemini 3.6 Flash</span>
              </span>
              <span className="text-[11px] font-black text-rose-700 bg-white px-2.5 py-0.5 rounded-md border border-rose-200 shadow-xs font-mono self-start sm:self-auto shrink-0">
                ⚡ Zero-Gravity Speed
              </span>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-rose-50 p-3.5 rounded-xl border border-slate-200 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                <span>🧠 Also maintained with:</span>
                <span className="font-extrabold text-rose-600 font-mono">Claude Code by Anthropic</span>
              </span>
              <span className="text-[11px] font-black text-slate-600 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-xs font-mono self-start sm:self-auto shrink-0">
                🛠️ Agentic CLI Engineering
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-900 font-display">Key Capabilities & Features</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KEY_FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${feature.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{feature.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AHA/ACC Blood Pressure Guidelines Matrix */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-900 font-display">AHA/ACC Blood Pressure Reference Standard</h2>
        </div>

        <div className="space-y-2.5">
          {CLINICAL_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${cat.badgeClass}`}>
                  {cat.category}
                </span>
                <p className="text-xs text-slate-700 pt-1">{cat.advice}</p>
              </div>

              <span className="text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                {cat.range}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 text-purple-700 rounded-xl border border-purple-200">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-900 font-display">Technology Architecture</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TECH_STACK.map((tech, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{tech.name}</span>
                <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  {tech.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Version & Release Specifications */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200">
            <Tag className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-900 font-display">Version & Release Specifications</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">App Version</span>
            <span className="text-sm font-extrabold text-rose-700 font-mono flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-rose-600" />
              v{APP_VERSION}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">Build / Commit</span>
            <span className="text-sm font-extrabold text-slate-900 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
              {BUILD_HASH ? `#${BUILD_HASH}` : 'Production'}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">Build Date</span>
            <span className="text-sm font-extrabold text-slate-900 font-mono flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-600" />
              {BUILD_DATE}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">Storage Engine</span>
            <span className="text-sm font-extrabold text-slate-900 font-mono flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-rose-600" />
              IndexedDB + Local
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info & Copyright */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700">
          <Globe className="w-4 h-4 text-rose-600" />
          <span>BPTracker Progressive Web Application • {DISPLAY_VERSION}</span>
        </div>
        <p className="text-xs text-slate-500">
          © {currentYear} Ly Vuong. All rights reserved. Open source under MIT license.
        </p>
      </div>

    </div>
  );
};
