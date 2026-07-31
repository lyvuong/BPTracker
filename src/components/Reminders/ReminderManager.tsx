import React, { useState } from 'react';
import { Bell, Plus, Pill, Clock, Trash2 } from 'lucide-react';
import type { Patient, BPReminder } from '../../types';

interface ReminderManagerProps {
  reminders: BPReminder[];
  patients: Patient[];
  activePatientId: string;
  onSaveReminder: (reminder: BPReminder) => void;
  onDeleteReminder: (id: string) => void;
  onToggleReminder: (id: string) => void;
}

export const ReminderManager: React.FC<ReminderManagerProps> = ({
  reminders,
  patients,
  activePatientId,
  onSaveReminder,
  onDeleteReminder,
  onToggleReminder
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00');
  const [isMedication, setIsMedication] = useState(false);
  const [dosage, setDosage] = useState('');

  const patientMap = new Map(patients.map(p => [p.id, p]));
  const activePatient = patientMap.get(activePatientId) || (patients.length > 0 ? patients[0] : null);

  const patientReminders = reminders.filter(r => activePatient && r.patientId === activePatient.id);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !title.trim()) return;

    const newReminder: BPReminder = {
      id: `rem-${Date.now()}`,
      patientId: activePatient.id,
      title: title.trim(),
      time,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      isMedication,
      dosage: isMedication ? dosage.trim() : undefined,
      isActive: true
    };

    onSaveReminder(newReminder);
    setTitle('');
    setDosage('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-display">BP & Medication Reminders</h1>
          </div>
          <p className="text-xs text-slate-600">
            Schedule daily blood pressure measurement alarms and medication schedules for <strong className="text-slate-900">{activePatient?.name || 'patient'}</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-rose-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Schedule Reminder
        </button>
      </div>

      {/* Reminder Cards Grid */}
      {patientReminders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patientReminders.map((r) => (
            <div 
              key={r.id}
              className={`bg-white p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                r.isActive ? 'border-slate-200 shadow-xs' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border shrink-0 ${
                  r.isMedication 
                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {r.isMedication ? <Pill className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>

                <div className="space-y-0.5">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    {r.title}
                    {r.isMedication && (
                      <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                        Medication
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-rose-600 font-mono font-semibold">
                    ⏰ {r.time} • Daily Schedule
                  </p>
                  {r.dosage && (
                    <p className="text-xs text-slate-500 font-mono">Dosage: {r.dosage}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleReminder(r.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    r.isActive 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {r.isActive ? 'Active' : 'Paused'}
                </button>

                <button
                  onClick={() => onDeleteReminder(r.id)}
                  className="p-2 text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all"
                  title="Delete Reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl space-y-3 text-slate-500 shadow-xs">
          <Bell className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Active Reminders</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Set morning/evening blood pressure measurement reminders or medication schedules.
          </p>
        </div>
      )}

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl space-y-4 border border-slate-200 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Add Reminder / Alarm Schedule</h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Title / Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning BP Check, Amlodipine 5mg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Schedule Time</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isMed"
                  checked={isMedication}
                  onChange={(e) => setIsMedication(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 bg-slate-50 border-slate-300"
                />
                <label htmlFor="isMed" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Is this a Medication Intake Reminder?
                </label>
              </div>

              {isMedication && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dosage (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 5mg oral tablet, 1 pill"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-rose-600/20"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
