export type BPCategory = 'Normal' | 'Elevated' | 'Stage 1' | 'Stage 2' | 'Crisis';

export type ArmPosition = 'Left' | 'Right';
export type BodyPosition = 'Sitting' | 'Lying' | 'Standing';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender?: 'Male' | 'Female' | 'Other';
  targetSystolic: number;
  targetDiastolic: number;
  notes?: string;
  avatarColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface BPMeasurement {
  id: string;
  patientId: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  arm?: ArmPosition;
  bodyPosition?: BodyPosition;
  tags?: string[];
  notes?: string;
  category: BPCategory;
  meanArterialPressure: number; // MAP = Diastolic + (Systolic - Diastolic) / 3
  pulsePressure: number; // Systolic - Diastolic
  createdAt: string;
}

export interface BPReminder {
  id: string;
  patientId: string;
  title: string;
  time: string;
  daysOfWeek: number[]; // 0 = Sun, 6 = Sat
  isMedication: boolean;
  dosage?: string;
  isActive: boolean;
}

export type ActiveTab = 'dashboard' | 'patients' | 'logs' | 'analytics' | 'reminders' | 'about';
