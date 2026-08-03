import React from 'react';
import { 
  HeartPulse, 
  Activity, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  User,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Download,
  Share2
} from 'lucide-react';
import type { Patient, BPMeasurement, BPReminder } from '../../types';
import { evaluateBP } from '../../services/bpAdviceEngine';
import { exportLogsAsCSV, shareLogsAsCSV } from '../../services/storage';
import { exportLogsAsPDF, shareLogsAsPDF } from '../../services/pdfReportGenerator';

interface DashboardOverviewProps {
  activePatient: Patient | null;
  measurements: BPMeasurement[];
  reminders: BPReminder[];
  onOpenAddMeasurement: () => void;
  onOpenAddPatient: () => void;
  onSelectTab: (tab: 'patients' | 'logs' | 'analytics' | 'reminders') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  activePatient,
  measurements,
  reminders,
  onOpenAddMeasurement,
  onOpenAddPatient,
  onSelectTab
}) => {
  // Filter measurements for active patient
  const patientMeasurements = measurements
    .filter(m => activePatient && m.patientId === activePatient.id)
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  const latest = patientMeasurements.length > 0 ? patientMeasurements[0] : null;
  const advice = latest ? evaluateBP(latest.systolic, latest.diastolic) : null;

  // 7-day averages
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentMeasurements = patientMeasurements.filter(m => new Date(m.date) >= sevenDaysAgo);

  const avgSys = recentMeasurements.length > 0
    ? Math.round(recentMeasurements.reduce((sum, m) => sum + m.systolic, 0) / recentMeasurements.length)
    : (latest ? latest.systolic : 0);

  const avgDia = recentMeasurements.length > 0
    ? Math.round(recentMeasurements.reduce((sum, m) => sum + m.diastolic, 0) / recentMeasurements.length)
    : (latest ? latest.diastolic : 0);

  const avgPulse = recentMeasurements.length > 0
    ? Math.round(recentMeasurements.reduce((sum, m) => sum + (m.pulse || 0), 0) / recentMeasurements.length)
    : (latest?.pulse || 0);

  const pendingReminders = reminders.filter(r => activePatient && r.patientId === activePatient.id && r.isActive);

  if (!activePatient) {
    return (
      <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
        <User className="w-16 h-16 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Profile Selected</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          BPTracker allows tracking blood pressure measurements for yourself or family members. Add your first profile to get started!
        </p>
        <button
          onClick={onOpenAddPatient}
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-rose-600/20 transition-all"
        >
          + Add New Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Hypertensive Crisis Warning Banner */}
      {advice && advice.isCrisis && (
        <div className="p-5 rounded-3xl border-2 border-rose-500 bg-rose-50 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-600 text-white rounded-2xl shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-rose-900 uppercase tracking-wide">
                Hypertensive Crisis Warning ({latest?.systolic}/{latest?.diastolic} mmHg)
              </h3>
              <p className="text-xs text-rose-700 font-medium">
                {advice.summaryAdvice} Please rest quietly for 5 minutes and re-test. Seek emergency care if symptoms exist.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAddMeasurement}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shrink-0 shadow-md"
          >
            Re-Test BP Now
          </button>
        </div>
      )}

      {/* Patient Caregiver Profile Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${activePatient.avatarColor} p-1 shadow-md flex items-center justify-center text-white font-black text-xl font-display`}>
            {activePatient.name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 font-display">{activePatient.name}</h1>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-mono">
                {activePatient.age} y/o {activePatient.gender || ''}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Target BP: <strong className="text-rose-600 font-mono">{activePatient.targetSystolic}/{activePatient.targetDiastolic} mmHg</strong> • Total Logs: <strong className="text-slate-900">{patientMeasurements.length}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => activePatient && shareLogsAsPDF(patientMeasurements, [activePatient], activePatient.id)}
            className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
            title="Share PDF Report via Native Share Sheet (Email, WhatsApp, AirDrop)"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share PDF</span>
          </button>

          <button
            onClick={() => activePatient && exportLogsAsPDF(patientMeasurements, [activePatient], activePatient.id)}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-rose-200 shadow-xs transition-all"
            title="Download Doctor-Ready PDF Report"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          <button
            onClick={() => activePatient && shareLogsAsCSV(patientMeasurements, [activePatient])}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all"
            title="Share CSV Spreadsheet via Native Share Sheet"
          >
            <Share2 className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Share CSV</span>
          </button>

          <button
            onClick={() => activePatient && exportLogsAsCSV(patientMeasurements, [activePatient])}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all"
            title="Download CSV Spreadsheet for Physicians"
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenAddMeasurement}
            className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-rose-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Log BP Reading
          </button>
        </div>
      </div>

      {/* Top Vital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Latest Reading */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Latest BP Measurement</span>
            {latest && (
              <span className="text-[11px] text-slate-500 font-mono">
                {latest.date} {latest.time}
              </span>
            )}
          </div>

          {latest ? (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight">
                  {latest.systolic}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-400 font-mono">
                  /{latest.diastolic}
                </span>
                <span className="text-xs text-slate-500 font-medium">mmHg</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {advice && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${advice.badgeClass}`}>
                    {advice.category}
                  </span>
                )}

                {latest.pulse && (
                  <span className="text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full font-mono">
                    ❤️ {latest.pulse} BPM
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-slate-400 text-xs">
              No measurements logged yet for this patient.
            </div>
          )}
        </div>

        {/* Card 2: 7-Day Average BP */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">7-Day Average BP</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>

          {recentMeasurements.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-teal-600 font-mono tracking-tight">
                  {avgSys}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-400 font-mono">
                  /{avgDia}
                </span>
                <span className="text-xs text-slate-500 font-medium">mmHg</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>Avg Pulse: <strong className="text-slate-800 font-mono">{avgPulse} BPM</strong></span>
                <span>Readings: <strong className="text-teal-600 font-bold">{recentMeasurements.length}</strong></span>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-slate-400 text-xs">
              Need 7 days of readings to compute rolling average.
            </div>
          )}
        </div>

        {/* Card 3: Target Comparison & Reminders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Daily Action & Reminders</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-600">Target Range</span>
              <span className="font-bold text-slate-900 font-mono">
                {activePatient.targetSystolic}/{activePatient.targetDiastolic} mmHg
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-600">Active Reminders</span>
              <span className="font-bold text-rose-600 font-mono">
                {pendingReminders.length} Scheduled
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Friendly Clinical Health Advice Box */}
      {advice && (
        <div className={`p-6 rounded-3xl border ${advice.borderClass} ${advice.bgClass} space-y-4 shadow-xs`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Clinical Health Advice & Recommended Steps</h2>
                <p className="text-xs text-slate-500">Based on AHA/ACC clinical blood pressure category evaluation.</p>
              </div>
            </div>

            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${advice.badgeClass}`}>
              {advice.category}
            </span>
          </div>

          <p className="text-sm text-slate-800 font-semibold leading-relaxed">
            {advice.summaryAdvice}
          </p>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs uppercase font-extrabold text-slate-500 block tracking-wider">Recommended Action Steps:</span>
            <ul className="space-y-1.5">
              {advice.detailedSteps.map((step, idx) => (
                <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recent Measurement Log Timeline */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold text-slate-900">Recent Blood Pressure Timeline</h2>
          </div>
          <button
            onClick={() => onSelectTab('logs')}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            View All Logs ({patientMeasurements.length})
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {patientMeasurements.length > 0 ? (
          <div className="space-y-3">
            {patientMeasurements.slice(0, 4).map((m) => {
              const itemAdvice = evaluateBP(m.systolic, m.diastolic);
              return (
                <div 
                  key={m.id} 
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center shrink-0">
                      <span className="text-2xl font-black text-slate-900 font-mono">{m.systolic}</span>
                      <span className="text-lg font-bold text-slate-400 font-mono">/{m.diastolic}</span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${itemAdvice.badgeClass}`}>
                          {m.category}
                        </span>
                        {m.pulse && (
                          <span className="text-[11px] text-slate-600">❤️ {m.pulse} BPM</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        📅 {m.date} at {m.time} {m.arm ? `• ${m.arm} Arm` : ''} {m.bodyPosition ? `• ${m.bodyPosition}` : ''}
                      </p>
                      {m.notes && (
                        <p className="text-xs text-slate-600 italic">"{m.notes}"</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-500 block font-mono">MAP: {m.meanArterialPressure} mmHg</span>
                    <span className="text-[11px] text-slate-500 block font-mono">Pulse Press: {m.pulsePressure}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-xs">
            No readings logged yet. Click "+ Log BP Reading" above to record the first measurement!
          </div>
        )}
      </div>

    </div>
  );
};
