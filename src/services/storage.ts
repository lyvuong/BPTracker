import type { Patient, BPMeasurement, BPReminder } from '../types';
import { evaluateBP, calculateMAP, calculatePulsePressure } from './bpAdviceEngine';

const PATIENTS_KEY = 'bptracker_patients_v1';
const MEASUREMENTS_KEY = 'bptracker_measurements_v1';
const REMINDERS_KEY = 'bptracker_reminders_v1';
const ACTIVE_PATIENT_KEY = 'bptracker_active_patient_id';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'demo-p1',
    name: 'Mary Elizabeth (Grandma)',
    age: 78,
    gender: 'Female',
    targetSystolic: 125,
    targetDiastolic: 80,
    notes: 'Caregiver log for Mary. Take morning readings after breakfast.',
    avatarColor: 'from-rose-500 to-pink-600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-p2',
    name: 'Robert Davis (Dad)',
    age: 64,
    gender: 'Male',
    targetSystolic: 120,
    targetDiastolic: 80,
    notes: 'Post-cardiac rehab tracking. Monitor evening pulse.',
    avatarColor: 'from-blue-500 to-cyan-600',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_MEASUREMENTS: BPMeasurement[] = [
  {
    id: 'demo-m1',
    patientId: 'demo-p1',
    systolic: 118,
    diastolic: 76,
    pulse: 68,
    date: '2026-07-31',
    time: '08:30',
    arm: 'Left',
    bodyPosition: 'Sitting',
    tags: ['Morning', 'Resting'],
    notes: 'Feeling great after breakfast tea.',
    category: evaluateBP(118, 76).category,
    meanArterialPressure: calculateMAP(118, 76),
    pulsePressure: calculatePulsePressure(118, 76),
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-m2',
    patientId: 'demo-p1',
    systolic: 134,
    diastolic: 84,
    pulse: 74,
    date: '2026-07-30',
    time: '19:45',
    arm: 'Left',
    bodyPosition: 'Sitting',
    tags: ['Evening', 'Post-Medication'],
    notes: 'Mild evening fatigue.',
    category: evaluateBP(134, 84).category,
    meanArterialPressure: calculateMAP(134, 84),
    pulsePressure: calculatePulsePressure(134, 84),
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-m3',
    patientId: 'demo-p2',
    systolic: 126,
    diastolic: 78,
    pulse: 65,
    date: '2026-07-31',
    time: '07:15',
    arm: 'Right',
    bodyPosition: 'Sitting',
    tags: ['Morning', 'Fasting'],
    notes: 'Odometer style check. Normal pulse.',
    category: evaluateBP(126, 78).category,
    meanArterialPressure: calculateMAP(126, 78),
    pulsePressure: calculatePulsePressure(126, 78),
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-m4',
    patientId: 'demo-p2',
    systolic: 142,
    diastolic: 92,
    pulse: 82,
    date: '2026-07-29',
    time: '18:20',
    arm: 'Right',
    bodyPosition: 'Sitting',
    tags: ['Evening', 'Stressed'],
    notes: 'After heavy garden yard work.',
    category: evaluateBP(142, 92).category,
    meanArterialPressure: calculateMAP(142, 92),
    pulsePressure: calculatePulsePressure(142, 92),
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_REMINDERS: BPReminder[] = [
  {
    id: 'demo-r1',
    patientId: 'demo-p1',
    title: 'Morning BP Measurement',
    time: '08:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    isMedication: false,
    isActive: true
  },
  {
    id: 'demo-r2',
    patientId: 'demo-p1',
    title: 'Amlodipine 5mg Medication',
    time: '09:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    isMedication: true,
    dosage: '5mg oral tablet',
    isActive: true
  },
  {
    id: 'demo-r3',
    patientId: 'demo-p2',
    title: 'Evening Pulse & BP Check',
    time: '19:30',
    daysOfWeek: [1, 3, 5],
    isMedication: false,
    isActive: true
  }
];

export const loadLocalPatients = (): Patient[] => {
  try {
    const raw = localStorage.getItem(PATIENTS_KEY);
    if (!raw) {
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(INITIAL_PATIENTS));
      return INITIAL_PATIENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load local patients:', err);
    return INITIAL_PATIENTS;
  }
};

export const saveLocalPatients = (patients: Patient[]): void => {
  try {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  } catch (err) {
    console.error('Failed to save local patients:', err);
  }
};

export const loadLocalMeasurements = (): BPMeasurement[] => {
  try {
    const raw = localStorage.getItem(MEASUREMENTS_KEY);
    if (!raw) {
      localStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(INITIAL_MEASUREMENTS));
      return INITIAL_MEASUREMENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load local measurements:', err);
    return INITIAL_MEASUREMENTS;
  }
};

export const saveLocalMeasurements = (measurements: BPMeasurement[]): void => {
  try {
    localStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(measurements));
  } catch (err) {
    console.error('Failed to save local measurements:', err);
  }
};

export const loadLocalReminders = (): BPReminder[] => {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    if (!raw) {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(INITIAL_REMINDERS));
      return INITIAL_REMINDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load local reminders:', err);
    return INITIAL_REMINDERS;
  }
};

export const saveLocalReminders = (reminders: BPReminder[]): void => {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  } catch (err) {
    console.error('Failed to save local reminders:', err);
  }
};

export const getActivePatientId = (): string => {
  const active = localStorage.getItem(ACTIVE_PATIENT_KEY);
  if (active) return active;
  const patients = loadLocalPatients();
  return patients.length > 0 ? patients[0].id : '';
};

export const setActivePatientId = (id: string): void => {
  localStorage.setItem(ACTIVE_PATIENT_KEY, id);
};

export const clearDemoData = (): void => {
  try {
    const patients = loadLocalPatients().filter(p => !p.id.startsWith('demo-'));
    const measurements = loadLocalMeasurements().filter(m => !m.id.startsWith('demo-') && !m.patientId.startsWith('demo-'));
    const reminders = loadLocalReminders().filter(r => !r.id.startsWith('demo-') && !r.patientId.startsWith('demo-'));
    saveLocalPatients(patients);
    saveLocalMeasurements(measurements);
    saveLocalReminders(reminders);
  } catch (err) {
    console.error('Failed to clear demo data:', err);
  }
};

export const restoreSampleData = (): void => {
  saveLocalPatients(INITIAL_PATIENTS);
  saveLocalMeasurements(INITIAL_MEASUREMENTS);
  saveLocalReminders(INITIAL_REMINDERS);
};

export const exportLogsAsCSV = (measurements: BPMeasurement[], patients: Patient[]): void => {
  const patientMap = new Map(patients.map(p => [p.id, p.name]));
  const headers = ['Patient Name', 'Date', 'Time', 'Systolic (mmHg)', 'Diastolic (mmHg)', 'Pulse (BPM)', 'Category', 'MAP (mmHg)', 'Pulse Pressure', 'Arm', 'Position', 'Tags', 'Notes'];
  const rows = measurements.map(m => [
    `"${patientMap.get(m.patientId) || 'Patient'}"`,
    `"${m.date}"`,
    `"${m.time}"`,
    m.systolic,
    m.diastolic,
    m.pulse || '',
    `"${m.category}"`,
    m.meanArterialPressure,
    m.pulsePressure,
    `"${m.arm || ''}"`,
    `"${m.bodyPosition || ''}"`,
    `"${(m.tags || []).join('; ')}"`,
    `"${(m.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `BPTracker_Clinical_Report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportDataAsJSON = (
  patients: Patient[], 
  measurements: BPMeasurement[], 
  reminders: BPReminder[]
): void => {
  const backupObj = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    patients,
    measurements,
    reminders
  };
  const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `BPTracker_Full_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importJSONBackup = (jsonString: string): { patients: Patient[]; measurements: BPMeasurement[]; reminders: BPReminder[] } => {
  try {
    const data = JSON.parse(jsonString);
    if (!data.patients || !Array.isArray(data.patients)) {
      throw new Error('Invalid BPTracker JSON backup structure.');
    }
    const patients: Patient[] = data.patients || [];
    const measurements: BPMeasurement[] = data.measurements || [];
    const reminders: BPReminder[] = data.reminders || [];

    saveLocalPatients(patients);
    saveLocalMeasurements(measurements);
    saveLocalReminders(reminders);

    return { patients, measurements, reminders };
  } catch (err: any) {
    throw new Error(err.message || 'Failed to parse JSON backup file.');
  }
};
