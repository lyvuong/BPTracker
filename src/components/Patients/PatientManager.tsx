import React from 'react';
import { Users, UserPlus, Edit2, Trash2, Target, FileText, CheckCircle2 } from 'lucide-react';
import type { Patient, BPMeasurement } from '../../types';
import { evaluateBP } from '../../services/bpAdviceEngine';

interface PatientManagerProps {
  patients: Patient[];
  measurements: BPMeasurement[];
  activePatientId: string;
  onSelectPatient: (id: string) => void;
  onOpenAddPatient: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
}

export const PatientManager: React.FC<PatientManagerProps> = ({
  patients,
  measurements,
  activePatientId,
  onSelectPatient,
  onOpenAddPatient,
  onEditPatient,
  onDeletePatient
}) => {
  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-display">Health Profiles Directory</h1>
          </div>
          <p className="text-xs text-slate-600">
            Manage personal and family health profiles, individualized blood pressure targets, and notes. Click any profile card to switch active user.
          </p>
        </div>

        <button
          onClick={onOpenAddPatient}
          className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-rose-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Add Health Profile
        </button>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patients.map((patient) => {
          const isActive = patient.id === activePatientId;
          const patientLogs = measurements
            .filter(m => m.patientId === patient.id)
            .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

          const latest = patientLogs.length > 0 ? patientLogs[0] : null;
          const advice = latest ? evaluateBP(latest.systolic, latest.diastolic) : null;

          return (
            <div 
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectPatient(patient.id);
                }
              }}
              className={`p-6 rounded-3xl border transition-all space-y-4 relative cursor-pointer group outline-none ${
                isActive 
                  ? 'bg-rose-50/30 border-rose-500 ring-2 ring-rose-500/20 shadow-md' 
                  : 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${patient.avatarColor} p-1 shadow-md flex items-center justify-center text-white font-black text-lg font-display shrink-0`}>
                    {patient.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 group-hover:text-rose-600 transition-colors">
                      {patient.name}
                      {isActive && (
                        <span className="text-[10px] uppercase font-black bg-rose-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {patient.age} y/o {patient.gender || ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPatient(patient);
                    }}
                    className="p-2 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all"
                    title="Edit Patient Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {patients.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePatient(patient.id);
                      }}
                      className="p-2 text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all"
                      title="Delete Patient Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Patient Vital Status Bar */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-extrabold block">Target BP</span>
                  <span className="text-sm font-bold text-rose-600 font-mono flex items-center gap-1 mt-0.5">
                    <Target className="w-3.5 h-3.5 text-rose-600" />
                    {patient.targetSystolic}/{patient.targetDiastolic} mmHg
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-extrabold block">Latest BP Status</span>
                  {latest && advice ? (
                    <span className={`text-xs font-bold font-mono ${advice.badgeTextClass} block mt-1`}>
                      {latest.systolic}/{latest.diastolic} ({advice.category})
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 block mt-1">No logs yet</span>
                  )}
                </div>
              </div>

              {patient.notes && (
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{patient.notes}</span>
                </p>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  {patientLogs.length} Log Entries Recorded
                </span>

                {isActive ? (
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active Patient Profile
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-rose-600 transition-colors flex items-center gap-1">
                    Click card to select →
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
