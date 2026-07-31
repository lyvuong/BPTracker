import React from 'react';
import { HeartPulse, PlusCircle, Wifi, WifiOff, UserPlus, Info } from 'lucide-react';
import type { Patient } from '../../types';

interface NavbarProps {
  patients: Patient[];
  activePatientId: string;
  onSelectPatient: (id: string) => void;
  onOpenAddMeasurement: () => void;
  onOpenAddPatient: () => void;
  onOpenAbout: () => void;
  isOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  patients,
  activePatientId,
  onSelectPatient,
  onOpenAddMeasurement,
  onOpenAddPatient,
  onOpenAbout,
  isOnline
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & App Name */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-xl shadow-md shadow-rose-500/20 ring-1 ring-white">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 font-display">
                BP<span className="text-rose-600">Tracker</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md tracking-wider">
                Personal & Family
              </span>
            </div>
          </div>

          {/* Health Profile Switcher Dropdown */}
          <div className="flex-1 max-w-xs sm:max-w-sm mx-2 flex items-center gap-1.5">
            {patients.length > 0 ? (
              <select
                value={activePatientId}
                onChange={(e) => onSelectPatient(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-rose-700 font-bold text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white cursor-pointer shadow-xs truncate"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id} className="bg-white text-slate-900 font-normal">
                    👤 {p.name} ({p.age} y/o)
                  </option>
                ))}
              </select>
            ) : (
              <button
                onClick={onOpenAddPatient}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 border-dashed flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-rose-600" />
                <span>+ Add Profile</span>
              </button>
            )}

            <button
              onClick={onOpenAddPatient}
              className="p-2 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all shrink-0"
              title="Add Health Profile"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* Network Online/Offline Badge */}
            <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
            }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
            </div>

            {/* Quick Log BP Entry Button */}
            <button
              onClick={onOpenAddMeasurement}
              disabled={patients.length === 0}
              className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-md shadow-rose-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Log BP</span>
            </button>

            {/* About Button */}
            <button
              onClick={onOpenAbout}
              className="p-2 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all"
              title="About BPTracker & App Info"
            >
              <Info className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
