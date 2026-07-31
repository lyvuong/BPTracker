import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { TabNavigation } from './components/Navigation/TabNavigation';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { PatientManager } from './components/Patients/PatientManager';
import { MeasurementHistory } from './components/Logs/MeasurementHistory';
import { BPAnalytics } from './components/Analytics/BPAnalytics';
import { ReminderManager } from './components/Reminders/ReminderManager';
import { AboutPage } from './components/About/AboutPage';
import { MeasurementFormModal } from './components/Modals/MeasurementFormModal';
import { PatientModal } from './components/Modals/PatientModal';
import { PWAInstallPrompt } from './components/PWA/PWAInstallPrompt';

import type { Patient, BPMeasurement, BPReminder, ActiveTab } from './types';
import { 
  loadLocalPatients, 
  saveLocalPatients, 
  loadLocalMeasurements, 
  saveLocalMeasurements, 
  loadLocalReminders, 
  saveLocalReminders,
  getActivePatientId, 
  setActivePatientId
} from './services/storage';

export const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(() => loadLocalPatients());
  const [measurements, setMeasurements] = useState<BPMeasurement[]>(() => loadLocalMeasurements());
  const [reminders, setReminders] = useState<BPReminder[]>(() => loadLocalReminders());
  const [activePatientId, setActivePatientIdState] = useState<string>(() => getActivePatientId());

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Modals state
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<BPMeasurement | null>(null);
  
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Online / Offline Detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync activePatientId to storage
  const handleSelectPatient = (id: string) => {
    setActivePatientIdState(id);
    setActivePatientId(id);
  };

  // Ensure active patient selection is valid
  useEffect(() => {
    if (patients.length > 0) {
      const exists = patients.some(p => p.id === activePatientId);
      if (!exists || !activePatientId) {
        handleSelectPatient(patients[0].id);
      }
    }
  }, [patients, activePatientId]);

  // Save to LocalStorage
  useEffect(() => {
    saveLocalPatients(patients);
  }, [patients]);

  useEffect(() => {
    saveLocalMeasurements(measurements);
  }, [measurements]);

  useEffect(() => {
    saveLocalReminders(reminders);
  }, [reminders]);

  const activePatient = patients.find(p => p.id === activePatientId) || null;

  // Handlers for Patient Management
  const handleSavePatient = (patientData: Omit<Patient, 'createdAt' | 'updatedAt'>) => {
    const isEdit = patients.some(p => p.id === patientData.id);
    const timestamp = new Date().toISOString();
    const existing = patients.find(p => p.id === patientData.id);

    const newPatient: Patient = {
      ...patientData,
      createdAt: isEdit && existing ? existing.createdAt : timestamp,
      updatedAt: timestamp
    };

    setPatients(prev => {
      const exists = prev.some(p => p.id === newPatient.id);
      if (exists) {
        return prev.map(p => p.id === newPatient.id ? newPatient : p);
      }
      return [newPatient, ...prev];
    });

    handleSelectPatient(newPatient.id);
    setIsPatientModalOpen(false);
    setEditingPatient(null);
  };

  const handleDeletePatient = (id: string) => {
    if (patients.length <= 1) {
      alert('Cannot delete the last patient profile.');
      return;
    }
    if (!confirm('Are you sure you want to delete this patient profile and all associated BP logs?')) return;

    setPatients(prev => prev.filter(p => p.id !== id));
    setMeasurements(prev => prev.filter(m => m.patientId !== id));
    setReminders(prev => prev.filter(r => r.patientId !== id));

    if (activePatientId === id) {
      const remaining = patients.filter(p => p.id !== id);
      if (remaining.length > 0) {
        handleSelectPatient(remaining[0].id);
      }
    }
  };

  // Handlers for Measurement Logs
  const handleSaveMeasurement = (measurementData: Partial<BPMeasurement>) => {
    if (!activePatientId) return;

    const isEdit = !!editingMeasurement;
    const measurementId = editingMeasurement ? editingMeasurement.id : `m-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const systolic = Number(measurementData.systolic) || 120;
    const diastolic = Number(measurementData.diastolic) || 80;

    // Import advice & MAP calculations dynamically
    const map = Math.round((diastolic + (systolic - diastolic) / 3) * 10) / 10;
    const pulsePress = systolic - diastolic;

    // Category evaluation
    let category: any = 'Normal';
    if (systolic >= 180 || diastolic >= 120) category = 'Crisis';
    else if (systolic >= 140 || diastolic >= 90) category = 'Stage 2';
    else if (systolic >= 130 || diastolic >= 80) category = 'Stage 1';
    else if (systolic >= 120 && diastolic < 80) category = 'Elevated';

    const newMeasurement: BPMeasurement = {
      id: measurementId,
      patientId: measurementData.patientId || activePatientId,
      systolic,
      diastolic,
      pulse: measurementData.pulse ? Number(measurementData.pulse) : undefined,
      date: measurementData.date || new Date().toISOString().split('T')[0],
      time: measurementData.time || new Date().toTimeString().slice(0, 5),
      arm: measurementData.arm || 'Left',
      bodyPosition: measurementData.bodyPosition || 'Sitting',
      tags: measurementData.tags || [],
      notes: measurementData.notes || '',
      category,
      meanArterialPressure: map,
      pulsePressure: pulsePress,
      createdAt: isEdit && editingMeasurement ? editingMeasurement.createdAt : timestamp
    };

    setMeasurements(prev => {
      const exists = prev.some(m => m.id === measurementId);
      if (exists) {
        return prev.map(m => m.id === measurementId ? newMeasurement : m);
      }
      return [newMeasurement, ...prev];
    });

    setIsMeasurementModalOpen(false);
    setEditingMeasurement(null);
  };

  const handleDeleteMeasurement = (id: string) => {
    if (!confirm('Delete this BP measurement log?')) return;
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  // Handlers for Reminders
  const handleSaveReminder = (reminder: BPReminder) => {
    setReminders(prev => [reminder, ...prev]);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleToggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const pendingRemindersCount = reminders.filter(r => activePatient && r.patientId === activePatient.id && r.isActive).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-24 lg:pb-0">
      
      {/* Navbar Header */}
      <Navbar
        patients={patients}
        activePatientId={activePatientId}
        onSelectPatient={handleSelectPatient}
        onOpenAddMeasurement={() => {
          setEditingMeasurement(null);
          setIsMeasurementModalOpen(true);
        }}
        onOpenAddPatient={() => {
          setEditingPatient(null);
          setIsPatientModalOpen(true);
        }}
        onOpenAbout={() => setActiveTab('about')}
        isOnline={isOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {activeTab === 'dashboard' && (
          <DashboardOverview
            activePatient={activePatient}
            measurements={measurements}
            reminders={reminders}
            onOpenAddMeasurement={() => {
              setEditingMeasurement(null);
              setIsMeasurementModalOpen(true);
            }}
            onOpenAddPatient={() => {
              setEditingPatient(null);
              setIsPatientModalOpen(true);
            }}
            onSelectTab={(tab: 'patients' | 'logs' | 'analytics' | 'reminders') => setActiveTab(tab)}
          />
        )}

        {activeTab === 'patients' && (
          <PatientManager
            patients={patients}
            measurements={measurements}
            activePatientId={activePatientId}
            onSelectPatient={handleSelectPatient}
            onOpenAddPatient={() => {
              setEditingPatient(null);
              setIsPatientModalOpen(true);
            }}
            onEditPatient={(p: Patient) => {
              setEditingPatient(p);
              setIsPatientModalOpen(true);
            }}
            onDeletePatient={handleDeletePatient}
          />
        )}

        {activeTab === 'logs' && (
          <MeasurementHistory
            measurements={measurements}
            patients={patients}
            activePatientId={activePatientId}
            onOpenAddMeasurement={() => {
              setEditingMeasurement(null);
              setIsMeasurementModalOpen(true);
            }}
            onEditMeasurement={(m: BPMeasurement) => {
              setEditingMeasurement(m);
              setIsMeasurementModalOpen(true);
            }}
            onDeleteMeasurement={handleDeleteMeasurement}
          />
        )}

        {activeTab === 'analytics' && (
          <BPAnalytics
            patients={patients}
            activePatientId={activePatientId}
            measurements={measurements}
          />
        )}

        {activeTab === 'reminders' && (
          <ReminderManager
            reminders={reminders}
            patients={patients}
            activePatientId={activePatientId}
            onSaveReminder={handleSaveReminder}
            onDeleteReminder={handleDeleteReminder}
            onToggleReminder={handleToggleReminder}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}

      </main>

      {/* Shared Modals */}
      <MeasurementFormModal
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
        onSave={handleSaveMeasurement}
        patients={patients}
        activePatientId={activePatientId}
        initialMeasurement={editingMeasurement}
      />

      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={handleSavePatient}
        initialPatient={editingPatient}
      />

      {/* Bottom Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingRemindersCount={pendingRemindersCount}
      />

      {/* PWA Prompt */}
      <PWAInstallPrompt />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <p>BPTracker Progressive Web App • Personal & Family Health Engine • Cloudflare Ready</p>
      </footer>

    </div>
  );
};

export default App;
