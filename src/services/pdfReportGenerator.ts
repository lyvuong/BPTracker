import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Patient, BPMeasurement } from '../types';
import { evaluateBP } from './bpAdviceEngine';

export const createPDFDocument = (
  measurements: BPMeasurement[],
  patients: Patient[],
  activePatientId?: string
): { doc: jsPDF; filename: string } => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];
  const patientMeasurements = activePatientId
    ? measurements.filter(m => m.patientId === activePatientId)
    : measurements;

  // Primary palette colors
  const primaryColor: [number, number, number] = [225, 29, 72]; // Rose-600 #e11d48
  const darkTextColor: [number, number, number] = [15, 23, 42]; // Slate-900 #0f172a
  const mutedTextColor: [number, number, number] = [71, 85, 105]; // Slate-600 #475569

  // 1. Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('BPTracker Clinical Blood Pressure Report', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated: ${reportDate}`, 196, 15, { align: 'right' });

  // 2. Profile Summary Section
  doc.setTextColor(...darkTextColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(activePatient ? `Health Profile: ${activePatient.name}` : 'All Profiles Summary', 14, 34);

  if (activePatient) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedTextColor);
    doc.text(
      `Age: ${activePatient.age} y/o  |  Gender: ${activePatient.gender || 'N/A'}  |  Target Range: ${activePatient.targetSystolic}/${activePatient.targetDiastolic} mmHg  |  Total Logs: ${patientMeasurements.length}`,
      14,
      40
    );

    if (activePatient.notes) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.text(`Notes: ${activePatient.notes}`, 14, 45);
    }
  }

  // Divider Line
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.4);
  const startY = activePatient && activePatient.notes ? 49 : 44;
  doc.line(14, startY, 196, startY);

  // 3. Summary Statistics Table
  const latest = patientMeasurements.length > 0 ? patientMeasurements[0] : null;

  // Calculate 7-day average
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recent7Days = patientMeasurements.filter(m => new Date(m.date) >= sevenDaysAgo);
  
  const avg7Sys = recent7Days.length > 0
    ? Math.round(recent7Days.reduce((acc, m) => acc + m.systolic, 0) / recent7Days.length)
    : '-';
  const avg7Dia = recent7Days.length > 0
    ? Math.round(recent7Days.reduce((acc, m) => acc + m.diastolic, 0) / recent7Days.length)
    : '-';
  const avgPulse = patientMeasurements.length > 0
    ? Math.round(patientMeasurements.reduce((acc, m) => acc + (m.pulse || 0), 0) / patientMeasurements.length)
    : '-';

  autoTable(doc, {
    startY: startY + 4,
    head: [['Latest Measurement', '7-Day Rolling Average', 'Average Pulse', 'Mean Arterial Pressure (MAP)']],
    body: [[
      latest ? `${latest.systolic}/${latest.diastolic} mmHg (${latest.category})` : 'N/A',
      avg7Sys !== '-' ? `${avg7Sys}/${avg7Dia} mmHg (${recent7Days.length} logs)` : 'N/A',
      avgPulse !== '-' ? `${avgPulse} BPM` : 'N/A',
      latest ? `${latest.meanArterialPressure} mmHg` : 'N/A'
    ]],
    theme: 'grid',
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: {
      textColor: [30, 41, 59],
      fontSize: 9,
      fontStyle: 'bold',
    },
    margin: { left: 14, right: 14 },
  });

  const statsTableY = (doc as any).lastAutoTable.finalY || 70;
  let nextSectionY = statsTableY + 8;

  // 4. Warm & Friendly Clinical Advice Box
  if (latest) {
    const advice = evaluateBP(latest.systolic, latest.diastolic);
    const boxY = statsTableY + 5;
    
    // Calculate required box height based on summary text wrapping & steps count
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const summaryLines = doc.splitTextToSize(advice.summaryAdvice, 174);
    const textHeight = summaryLines.length * 4;
    const stepsHeight = advice.detailedSteps.length * 4;
    const totalBoxHeight = 14 + textHeight + stepsHeight;

    // Draw Rose Callout Card
    doc.setFillColor(255, 241, 242); // Rose-50
    doc.setDrawColor(254, 205, 211); // Rose-200
    doc.setLineWidth(0.3);
    doc.roundedRect(14, boxY, 182, totalBoxHeight, 3, 3, 'FD');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(159, 18, 57); // Rose-900
    doc.text(`Friendly Health Analysis: ${advice.category} Range`, 18, boxY + 6);

    // Warm Advice Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text(summaryLines, 18, boxY + 11);

    // Recommended Action Steps
    const stepsHeaderY = boxY + 11 + textHeight + 1;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(190, 18, 60); // Rose-700
    doc.text('Recommended Personal Care Steps:', 18, stepsHeaderY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85); // Slate-700
    advice.detailedSteps.forEach((step, idx) => {
      doc.text(`• ${step}`, 20, stepsHeaderY + 4 + (idx * 4));
    });

    nextSectionY = boxY + totalBoxHeight + 8;
  }

  // 5. Detailed BP Logs Table
  const tableRows = patientMeasurements.map(m => {
    const patientName = patients.find(p => p.id === m.patientId)?.name || 'Profile';
    return [
      `${m.date} ${m.time}`,
      activePatientId ? '' : patientName,
      `${m.systolic}/${m.diastolic}`,
      m.category,
      m.pulse ? `${m.pulse} BPM` : '-',
      `${m.meanArterialPressure} / ${m.pulsePressure}`,
      `${m.arm || '-'} / ${m.bodyPosition || '-'}`,
      [...(m.tags || []), m.notes].filter(Boolean).join(' • ') || '-'
    ].filter((_, idx) => !activePatientId || idx !== 1);
  });

  const tableHeaders = activePatientId
    ? ['Date & Time', 'BP (mmHg)', 'AHA Category', 'Pulse', 'MAP/PP', 'Arm / Posture', 'Notes & Tags']
    : ['Date & Time', 'Profile', 'BP (mmHg)', 'AHA Category', 'Pulse', 'MAP/PP', 'Arm / Posture', 'Notes & Tags'];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkTextColor);
  doc.text('Measurement History Log', 14, nextSectionY);

  autoTable(doc, {
    startY: nextSectionY + 4,
    head: [tableHeaders],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [225, 29, 72],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { fontStyle: 'bold', cellWidth: 22 },
      2: { cellWidth: 28 },
      3: { cellWidth: 18 },
      4: { cellWidth: 20 },
      5: { cellWidth: 24 },
    },
    margin: { left: 14, right: 14, bottom: 20 },
    didDrawPage: (data) => {
      const pageCount = (doc as any).internal.getNumberOfPages();
      const currentPage = data.pageNumber;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);

      doc.text(
        'Medical Disclaimer: Generated for tracking purposes based on AHA/ACC clinical reference standards. Consult your doctor for medical decisions.',
        14,
        287
      );

      doc.text(`Page ${currentPage} of ${pageCount}`, 196, 287, { align: 'right' });
    },
  });

  const filename = activePatient
    ? `BPTracker_Report_${activePatient.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    : `BPTracker_Clinical_Report_${new Date().toISOString().split('T')[0]}.pdf`;

  return { doc, filename };
};

export const exportLogsAsPDF = (
  measurements: BPMeasurement[],
  patients: Patient[],
  activePatientId?: string
): void => {
  const { doc, filename } = createPDFDocument(measurements, patients, activePatientId);
  doc.save(filename);
};

export const shareLogsAsPDF = async (
  measurements: BPMeasurement[],
  patients: Patient[],
  activePatientId?: string
): Promise<boolean> => {
  const { doc, filename } = createPDFDocument(measurements, patients, activePatientId);
  const pdfBlob = doc.output('blob');
  const file = new File([pdfBlob], filename, { type: 'application/pdf' });

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: 'BPTracker Clinical PDF Report',
        text: 'Clinical blood pressure report generated by BPTracker PWA.',
        files: [file],
      });
      return true;
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing PDF file:', err);
      }
      return false;
    }
  } else {
    doc.save(filename);
    return false;
  }
};
