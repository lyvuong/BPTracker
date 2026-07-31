import React, { useState, useEffect } from 'react';
import { X, HeartPulse, Sparkles } from 'lucide-react';
import type { Patient, BPMeasurement, ArmPosition, BodyPosition } from '../../types';
import { evaluateBP } from '../../services/bpAdviceEngine';

interface MeasurementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<BPMeasurement>) => void;
  patients: Patient[];
  activePatientId: string;
  initialMeasurement?: BPMeasurement | null;
}

export const MeasurementFormModal: React.FC<MeasurementFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patients,
  activePatientId,
  initialMeasurement
}) => {
  const [patientId, setPatientId] = useState(activePatientId || (patients.length > 0 ? patients[0].id : ''));
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [pulse, setPulse] = useState<number>(72);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [arm, setArm] = useState<ArmPosition>('Left');
  const [bodyPosition, setBodyPosition] = useState<BodyPosition>('Sitting');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Morning', 'Resting']);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialMeasurement) {
      setPatientId(initialMeasurement.patientId);
      setSystolic(initialMeasurement.systolic);
      setDiastolic(initialMeasurement.diastolic);
      setPulse(initialMeasurement.pulse || 72);
      setDate(initialMeasurement.date);
      setTime(initialMeasurement.time);
      setArm(initialMeasurement.arm || 'Left');
      setBodyPosition(initialMeasurement.bodyPosition || 'Sitting');
      setSelectedTags(initialMeasurement.tags || []);
      setNotes(initialMeasurement.notes || '');
    } else {
      setPatientId(activePatientId || (patients.length > 0 ? patients[0].id : ''));
      setSystolic(120);
      setDiastolic(80);
      setPulse(72);
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toTimeString().slice(0, 5));
      setArm('Left');
      setBodyPosition('Sitting');
      setSelectedTags(['Morning', 'Resting']);
      setNotes('');
    }
  }, [initialMeasurement, isOpen, activePatientId, patients]);

  if (!isOpen) return null;

  const liveAdvice = evaluateBP(systolic, diastolic);

  const TAG_OPTIONS = ['Morning', 'Evening', 'Fasting', 'Post-Medication', 'Post-Exercise', 'Resting', 'Stressed'];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      patientId,
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      pulse: pulse ? Number(pulse) : undefined,
      date,
      time,
      arm,
      bodyPosition,
      tags: selectedTags,
      notes: notes.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-xl w-full p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 shadow-xl relative my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 font-display">
              {initialMeasurement ? 'Edit BP Measurement Log' : 'Log Blood Pressure Reading'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-xl border border-slate-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Profile Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Profile</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer font-bold focus:bg-white"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>👤 {p.name} ({p.age} y/o)</option>
              ))}
            </select>
          </div>

          {/* Systolic & Diastolic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Systolic (mmHg)</label>
              <input
                type="number"
                required
                min={50}
                max={300}
                value={systolic}
                onChange={(e) => setSystolic(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-rose-600 font-mono font-extrabold text-xl px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Diastolic (mmHg)</label>
              <input
                type="number"
                required
                min={30}
                max={200}
                value={diastolic}
                onChange={(e) => setDiastolic(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono font-extrabold text-xl px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Pulse (BPM)</label>
              <input
                type="number"
                min={30}
                max={220}
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-teal-600 font-mono font-bold text-xl px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Real-time Category & Live Advice Preview */}
          <div className={`p-4 rounded-2xl border ${liveAdvice.borderClass} ${liveAdvice.bgClass} space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-600" />
                Live AHA/ACC Clinical Evaluation:
              </span>
              <span className={`text-xs font-extrabold px-3 py-0.5 rounded-full border ${liveAdvice.badgeClass}`}>
                {liveAdvice.category}
              </span>
            </div>
            <p className="text-xs text-slate-800 font-medium">
              {liveAdvice.summaryAdvice}
            </p>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono focus:bg-white"
              />
            </div>
          </div>

          {/* Arm & Position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Arm Used</label>
              <select
                value={arm}
                onChange={(e: any) => setArm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer focus:bg-white"
              >
                <option value="Left">Left Arm</option>
                <option value="Right">Right Arm</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Body Position</label>
              <select
                value={bodyPosition}
                onChange={(e: any) => setBodyPosition(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer focus:bg-white"
              >
                <option value="Sitting">Sitting</option>
                <option value="Lying">Lying Down</option>
                <option value="Standing">Standing</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Context Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {TAG_OPTIONS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs font-semibold px-3 py-1 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Symptoms (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Took reading 30 min after morning coffee, feeling relaxed..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-rose-500/20 active:scale-95 transition-all"
            >
              Save BP Reading Log
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
