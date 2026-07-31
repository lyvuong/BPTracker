import React, { useState, useMemo } from 'react';
import { ClipboardList, Search, Plus, Download, Printer, Edit2, Trash2 } from 'lucide-react';
import type { Patient, BPMeasurement } from '../../types';
import { evaluateBP } from '../../services/bpAdviceEngine';
import { exportLogsAsCSV } from '../../services/storage';

interface MeasurementHistoryProps {
  measurements: BPMeasurement[];
  patients: Patient[];
  activePatientId: string;
  onOpenAddMeasurement: () => void;
  onEditMeasurement: (measurement: BPMeasurement) => void;
  onDeleteMeasurement: (id: string) => void;
}

export const MeasurementHistory: React.FC<MeasurementHistoryProps> = ({
  measurements,
  patients,
  activePatientId,
  onOpenAddMeasurement,
  onEditMeasurement,
  onDeleteMeasurement
}) => {
  const [selectedPatientFilter, setSelectedPatientFilter] = useState<string>(activePatientId || 'all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'sys-desc' | 'dia-desc'>('date-desc');

  const patientMap = useMemo(() => {
    return new Map(patients.map(p => [p.id, p]));
  }, [patients]);

  const filteredMeasurements = useMemo(() => {
    return measurements.filter(m => {
      if (selectedPatientFilter !== 'all' && m.patientId !== selectedPatientFilter) return false;
      if (selectedCategoryFilter !== 'all' && m.category !== selectedCategoryFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const patient = patientMap.get(m.patientId);
        const patientName = patient ? patient.name.toLowerCase() : '';
        const matchNotes = (m.notes || '').toLowerCase().includes(query);
        const matchTags = (m.tags || []).some(t => t.toLowerCase().includes(query));
        return patientName.includes(query) || matchNotes || matchTags || m.category.toLowerCase().includes(query);
      }

      return true;
    }).sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.time}`).getTime();
      const timeB = new Date(`${b.date}T${b.time}`).getTime();

      if (sortBy === 'date-desc') return timeB - timeA;
      if (sortBy === 'date-asc') return timeA - timeB;
      if (sortBy === 'sys-desc') return b.systolic - a.systolic;
      if (sortBy === 'dia-desc') return b.diastolic - a.diastolic;
      return 0;
    });
  }, [measurements, selectedPatientFilter, selectedCategoryFilter, searchQuery, sortBy, patientMap]);

  const handleExportCSV = () => {
    exportLogsAsCSV(filteredMeasurements, patients);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl border border-rose-200">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-display">Blood Pressure Log History</h1>
          </div>
          <p className="text-xs text-slate-600">
            Comprehensive measurement logs, clinical BP categories, and exportable physician reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition-all"
          >
            <Download className="w-4 h-4 text-teal-600" />
            Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition-all"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            Print Report
          </button>

          <button
            onClick={onOpenAddMeasurement}
            className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-rose-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Log BP Reading
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 no-print">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tags, notes, patient name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
          </div>

          {/* Filter Patient */}
          <select
            value={selectedPatientFilter}
            onChange={(e) => setSelectedPatientFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer focus:bg-white"
          >
            <option value="all">👤 All Profiles ({patients.length})</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Filter BP Category */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer focus:bg-white"
          >
            <option value="all">🩺 All BP Categories</option>
            <option value="Normal">Normal (&lt;120/80)</option>
            <option value="Elevated">Elevated (120-129/&lt;80)</option>
            <option value="Stage 1">Hypertension Stage 1 (130-139/80-89)</option>
            <option value="Stage 2">Hypertension Stage 2 (140+/90+)</option>
            <option value="Crisis">Hypertensive Crisis (&gt;180/&gt;120)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer focus:bg-white"
          >
            <option value="date-desc">📅 Newest First</option>
            <option value="date-asc">📅 Oldest First</option>
            <option value="sys-desc">📈 Highest Systolic</option>
            <option value="dia-desc">📉 Highest Diastolic</option>
          </select>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing <strong className="text-rose-600 font-bold">{filteredMeasurements.length}</strong> measurement logs</span>
        </div>
      </div>

      {/* Measurement List */}
      {filteredMeasurements.length > 0 ? (
        <div className="space-y-3">
          {filteredMeasurements.map((m) => {
            const patient = patientMap.get(m.patientId);
            const advice = evaluateBP(m.systolic, m.diastolic);

            return (
              <div 
                key={m.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-center bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
                    <span className="text-3xl font-black text-slate-900 font-mono block leading-none">{m.systolic}</span>
                    <span className="text-xl font-bold text-slate-400 font-mono block">/{m.diastolic}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block mt-1">mmHg</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border ${advice.badgeClass}`}>
                        {m.category}
                      </span>
                      {patient && (
                        <span className="text-xs font-bold text-rose-600">
                          👤 {patient.name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                      <span>📅 {m.date} at {m.time}</span>
                      {m.pulse && <span>❤️ {m.pulse} BPM</span>}
                      {m.arm && <span>• {m.arm} Arm</span>}
                      {m.bodyPosition && <span>• {m.bodyPosition}</span>}
                    </div>

                    {m.tags && m.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {m.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {m.notes && (
                      <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        "{m.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block font-mono">MAP: <strong className="text-slate-800">{m.meanArterialPressure} mmHg</strong></span>
                    <span className="text-xs text-slate-500 block font-mono">Pulse Press: <strong className="text-slate-800">{m.pulsePressure} mmHg</strong></span>
                  </div>

                  <div className="flex items-center gap-1 no-print">
                    <button
                      onClick={() => onEditMeasurement(m)}
                      className="p-2 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all"
                      title="Edit Entry"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteMeasurement(m.id)}
                      className="p-2 text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Measurement Logs Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No blood pressure logs match your current search or filter criteria.
          </p>
          <button
            onClick={onOpenAddMeasurement}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-rose-600/20 transition-all"
          >
            + Log First Reading
          </button>
        </div>
      )}

    </div>
  );
};
