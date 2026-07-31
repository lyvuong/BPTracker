import React, { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import type { Patient } from '../../types';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patientData: Omit<Patient, 'createdAt' | 'updatedAt'>) => void;
  initialPatient?: Patient | null;
}

const AVATAR_THEMES = [
  { label: 'Rose / Pink', value: 'from-rose-500 to-pink-600' },
  { label: 'Blue / Cyan', value: 'from-blue-500 to-cyan-600' },
  { label: 'Purple / Indigo', value: 'from-purple-500 to-indigo-600' },
  { label: 'Emerald / Green', value: 'from-emerald-500 to-teal-600' },
  { label: 'Amber / Orange', value: 'from-amber-500 to-orange-600' },
];

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPatient
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(65);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [targetSystolic, setTargetSystolic] = useState<number>(120);
  const [targetDiastolic, setTargetDiastolic] = useState<number>(80);
  const [notes, setNotes] = useState('');
  const [avatarColor, setAvatarColor] = useState('from-rose-500 to-pink-600');

  useEffect(() => {
    if (initialPatient) {
      setName(initialPatient.name);
      setAge(initialPatient.age);
      setGender(initialPatient.gender || 'Female');
      setTargetSystolic(initialPatient.targetSystolic || 120);
      setTargetDiastolic(initialPatient.targetDiastolic || 80);
      setNotes(initialPatient.notes || '');
      setAvatarColor(initialPatient.avatarColor || 'from-rose-500 to-pink-600');
    } else {
      setName('');
      setAge(65);
      setGender('Female');
      setTargetSystolic(120);
      setTargetDiastolic(80);
      setNotes('');
      setAvatarColor('from-rose-500 to-pink-600');
    }
  }, [initialPatient, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialPatient ? initialPatient.id : `pat-${Date.now()}`,
      name: name.trim(),
      age: Number(age),
      gender,
      targetSystolic: Number(targetSystolic),
      targetDiastolic: Number(targetDiastolic),
      notes: notes.trim(),
      avatarColor
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 shadow-xl relative my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 font-display">
              {initialPatient ? 'Edit Profile' : 'Add New Profile'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-xl border border-slate-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name / Profile Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Myself, Mary Elizabeth, Dad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Age</label>
              <input
                type="number"
                required
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e: any) => setGender(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer focus:bg-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Target BP */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Systolic (mmHg)</label>
              <input
                type="number"
                required
                min={80}
                max={180}
                value={targetSystolic}
                onChange={(e) => setTargetSystolic(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-rose-600 font-mono font-bold text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Diastolic (mmHg)</label>
              <input
                type="number"
                required
                min={50}
                max={120}
                value={targetDiastolic}
                onChange={(e) => setTargetDiastolic(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Avatar Theme Color */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Avatar Color Theme</label>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_THEMES.map(theme => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => setAvatarColor(theme.value)}
                  className={`h-9 rounded-xl bg-gradient-to-tr ${theme.value} border-2 transition-all ${
                    avatarColor === theme.value ? 'border-slate-900 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={theme.label}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Personal Context</label>
            <textarea
              rows={2}
              placeholder="e.g. Personal health goals, morning medication schedule..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
          </div>

          {/* Actions */}
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
              Save Profile
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
