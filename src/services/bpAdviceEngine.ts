import type { BPCategory } from '../types';

export interface BPAdviceResult {
  category: BPCategory;
  title: string;
  badgeClass: string;
  badgeTextClass: string;
  bgClass: string;
  borderClass: string;
  summaryAdvice: string;
  detailedSteps: string[];
  isCrisis: boolean;
}

export const calculateMAP = (systolic: number, diastolic: number): number => {
  return Math.round(diastolic + (systolic - diastolic) / 3);
};

export const calculatePulsePressure = (systolic: number, diastolic: number): number => {
  return systolic - diastolic;
};

export const evaluateBP = (systolic: number, diastolic: number): BPAdviceResult => {
  // 1. Hypertensive Crisis
  if (systolic >= 180 || diastolic >= 120) {
    return {
      category: 'Crisis',
      title: 'Hypertensive Crisis Alert',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse font-mono',
      badgeTextClass: 'text-rose-700',
      bgClass: 'bg-rose-50',
      borderClass: 'border-rose-300',
      summaryAdvice: '⚠️ Extremely high blood pressure reading detected! Immediate attention required.',
      detailedSteps: [
        'Rest quietly in a comfortable sitting position for 5 minutes without talking.',
        'Re-test blood pressure to confirm accuracy.',
        'If reading remains above 180/120 and you experience headache, chest tightness, vision changes, or shortness of breath, call emergency services immediately.'
      ],
      isCrisis: true
    };
  }

  // 2. Stage 2 High Blood Pressure
  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: 'Stage 2',
      title: 'Stage 2 High Blood Pressure',
      badgeClass: 'bg-red-100 text-red-800 border-red-200 font-bold',
      badgeTextClass: 'text-red-700',
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
      summaryAdvice: 'High blood pressure reading. Regular monitoring and medical review recommended.',
      detailedSteps: [
        'Ensure you take any prescribed blood pressure medications as scheduled.',
        'Limit sodium (salt) intake and stay well hydrated with plain water.',
        'Share your weekly log report with your physician or primary care caregiver.'
      ],
      isCrisis: false
    };
  }

  // 3. Stage 1 High Blood Pressure
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      category: 'Stage 1',
      title: 'Stage 1 High Blood Pressure',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-200 font-bold',
      badgeTextClass: 'text-orange-700',
      bgClass: 'bg-orange-50',
      borderClass: 'border-orange-200',
      summaryAdvice: 'Mildly high blood pressure reading. Lifestyle adjustments can help bring it down.',
      detailedSteps: [
        'Practice 5 minutes of slow, rhythmic deep breathing exercises.',
        'Reduce dietary sodium and avoid energy drinks or heavy caffeine.',
        'Track morning and evening measurements for 7 consecutive days.'
      ],
      isCrisis: false
    };
  }

  // 4. Elevated Blood Pressure
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      category: 'Elevated',
      title: 'Elevated Blood Pressure',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200 font-bold',
      badgeTextClass: 'text-amber-700',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200',
      summaryAdvice: 'Slightly above optimal level. Good time for proactive heart-healthy habits.',
      detailedSteps: [
        'Incorporate 20-30 minutes of moderate daily walking or swimming.',
        'Maintain a diet rich in potassium (bananas, leafy greens, avocados).',
        'Avoid tobacco and minimize alcohol intake.'
      ],
      isCrisis: false
    };
  }

  // 5. Normal Optimal Reading
  return {
    category: 'Normal',
    title: 'Healthy Optimal Range',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold',
    badgeTextClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    summaryAdvice: '🎉 Excellent! Your blood pressure is within the healthy optimal range.',
    detailedSteps: [
      'Maintain your balanced diet, good hydration, and regular exercise routine.',
      'Continue logging measurements at consistent times (e.g. morning and evening).',
      'Keep up your routine health check-ups.'
    ],
    isCrisis: false
  };
};
