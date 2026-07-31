import React, { useMemo } from 'react';
import { LineChart, Activity, Calendar, Info } from 'lucide-react';
import type { Patient, BPMeasurement } from '../../types';

interface BPAnalyticsProps {
  patients: Patient[];
  activePatientId: string;
  measurements: BPMeasurement[];
}

export const BPAnalytics: React.FC<BPAnalyticsProps> = ({
  patients,
  activePatientId,
  measurements
}) => {
  const patientMap = useMemo(() => new Map(patients.map(p => [p.id, p])), [patients]);
  const activePatient = patientMap.get(activePatientId) || (patients.length > 0 ? patients[0] : null);

  const patientMeasurements = useMemo(() => {
    return measurements
      .filter(m => activePatient && m.patientId === activePatient.id)
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  }, [measurements, activePatient]);

  // Category counts & breakdown
  const categoryCounts = useMemo(() => {
    const counts = { Normal: 0, Elevated: 0, 'Stage 1': 0, 'Stage 2': 0, Crisis: 0 };
    patientMeasurements.forEach(m => {
      if (counts[m.category] !== undefined) {
        counts[m.category]++;
      }
    });
    return counts;
  }, [patientMeasurements]);

  const totalLogs = patientMeasurements.length;

  // Morning vs Evening averages
  const morningLogs = patientMeasurements.filter(m => {
    const hour = parseInt(m.time.split(':')[0] || '12', 10);
    return hour >= 5 && hour < 12;
  });

  const eveningLogs = patientMeasurements.filter(m => {
    const hour = parseInt(m.time.split(':')[0] || '12', 10);
    return hour >= 17 && hour < 23;
  });

  const avgMorningSys = morningLogs.length > 0 
    ? Math.round(morningLogs.reduce((sum, m) => sum + m.systolic, 0) / morningLogs.length)
    : 0;

  const avgEveningSys = eveningLogs.length > 0 
    ? Math.round(eveningLogs.reduce((sum, m) => sum + m.systolic, 0) / eveningLogs.length)
    : 0;

  if (!activePatient) {
    return (
      <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl text-slate-500 shadow-xs">
        No active profile found. Select a profile to view clinical analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl border border-purple-200">
              <LineChart className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-display">Blood Pressure Clinical Analytics</h1>
          </div>
          <p className="text-xs text-slate-600">
            Trend visualizer for <strong className="text-slate-900">{activePatient.name}</strong> • Target: {activePatient.targetSystolic}/{activePatient.targetDiastolic} mmHg
          </p>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-600" />
          <span>AHA/ACC Category Distribution ({totalLogs} Total Readings)</span>
        </h2>

        {totalLogs > 0 ? (
          <div className="space-y-3">
            
            {/* Normal */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-700">Normal (&lt;120/&lt;80 mmHg)</span>
                <span className="text-slate-700 font-mono">{categoryCounts.Normal} ({Math.round((categoryCounts.Normal / totalLogs) * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(categoryCounts.Normal / totalLogs) * 100}%` }}
                />
              </div>
            </div>

            {/* Elevated */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-700">Elevated (120-129/&lt;80 mmHg)</span>
                <span className="text-slate-700 font-mono">{categoryCounts.Elevated} ({Math.round((categoryCounts.Elevated / totalLogs) * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(categoryCounts.Elevated / totalLogs) * 100}%` }}
                />
              </div>
            </div>

            {/* Stage 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-orange-700">Hypertension Stage 1 (130-139/80-89 mmHg)</span>
                <span className="text-slate-700 font-mono">{categoryCounts['Stage 1']} ({Math.round((categoryCounts['Stage 1'] / totalLogs) * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${(categoryCounts['Stage 1'] / totalLogs) * 100}%` }}
                />
              </div>
            </div>

            {/* Stage 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-red-700">Hypertension Stage 2 (140+/90+ mmHg)</span>
                <span className="text-slate-700 font-mono">{categoryCounts['Stage 2']} ({Math.round((categoryCounts['Stage 2'] / totalLogs) * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${(categoryCounts['Stage 2'] / totalLogs) * 100}%` }}
                />
              </div>
            </div>

            {/* Crisis */}
            {categoryCounts.Crisis > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-rose-700 font-bold">Hypertensive Crisis (&gt;180/&gt;120 mmHg)</span>
                  <span className="text-rose-700 font-mono">{categoryCounts.Crisis} ({Math.round((categoryCounts.Crisis / totalLogs) * 100)}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-rose-600 rounded-full animate-pulse transition-all duration-500"
                    style={{ width: `${(categoryCounts.Crisis / totalLogs) * 100}%` }}
                  />
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs">
            No readings recorded to generate category distribution.
          </div>
        )}
      </div>

      {/* Time-of-Day Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Morning vs Evening */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Time of Day Variation (Diurnal Surge)</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[11px] text-slate-500 uppercase font-extrabold block">Morning Avg (5am-12pm)</span>
              <span className="text-2xl font-black text-teal-600 font-mono">
                {avgMorningSys > 0 ? `${avgMorningSys} mmHg` : 'N/A'}
              </span>
              <span className="text-[10px] text-slate-500 block">{morningLogs.length} Readings</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[11px] text-slate-500 uppercase font-extrabold block">Evening Avg (5pm-11pm)</span>
              <span className="text-2xl font-black text-indigo-600 font-mono">
                {avgEveningSys > 0 ? `${avgEveningSys} mmHg` : 'N/A'}
              </span>
              <span className="text-[10px] text-slate-500 block">{eveningLogs.length} Readings</span>
            </div>
          </div>
        </div>

        {/* Clinical Info Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-600" />
            <span>Clinical Indicators Explained</span>
          </h3>

          <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <p>
              <strong className="text-rose-600">MAP (Mean Arterial Pressure):</strong> Represents average arterial pressure during a single cardiac cycle. Normal range is typically 70 - 100 mmHg.
            </p>
            <p>
              <strong className="text-purple-600">Pulse Pressure:</strong> Difference between Systolic and Diastolic pressure (Sys - Dia). A pulse pressure consistently over 60 mmHg can indicate arterial stiffness.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
