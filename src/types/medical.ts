export interface Patient {
  id: string;
  name: string;
  birthdate: string;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  address: string;
  phone: string;
  email: string;
  bloodType: string;
  allergies: string[];
  previousOperations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Vitals {
  height: number; // in cm
  weight: number; // in kg
  temperature: number; // in celsius
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  recordedAt: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  subjective: string;
  assessment: string;
  treatmentPlan: string;
  medication: string;
  diagnosis: string;
  vitals: Vitals;
  createdAt: string;
  doctorName: string;
}

export interface DashboardStats {
  totalPatients: number;
  reportsToday: number;
  pendingAppointments: number;
  criticalAlerts: number;
}

export const COMMON_DISEASES = [
  'Hypertension',
  'Diabetes Mellitus Type 2',
  'Diabetes Mellitus Type 1',
  'Asthma',
  'Chronic Obstructive Pulmonary Disease (COPD)',
  'Coronary Artery Disease',
  'Atrial Fibrillation',
  'Heart Failure',
  'Pneumonia',
  'Bronchitis',
  'Upper Respiratory Infection',
  'Urinary Tract Infection',
  'Gastroesophageal Reflux Disease (GERD)',
  'Irritable Bowel Syndrome',
  'Migraine',
  'Depression',
  'Anxiety Disorder',
  'Osteoarthritis',
  'Rheumatoid Arthritis',
  'Hypothyroidism',
  'Hyperthyroidism',
  'Anemia',
  'Chronic Kidney Disease',
  'Obesity',
  'Hyperlipidemia',
  'Osteoporosis',
  'Fibromyalgia',
  'Sleep Apnea'
];

export const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];