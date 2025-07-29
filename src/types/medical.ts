export interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  address: string;
  phone: string;
  // email: string;
  blood_type: string;
  allergies: string[];
  operations: string[];
  createdAt: string;
  // updatedAt?: string;
}

export interface Vitals {
  id: number;
  height: number; // in cm
  weight: number; // in kg
  temperature: number; // in celsius
  bp_systolic: number;
  bp_diastolic: number;
  created_at: string;
  respiratory_rate?: number;
  heart_rate?: number;
}

export interface MedicalReport {
  id: string;
  created_at?: string;
  patient_id: string;
  doctor_id: string;
  subjective: string;
  assessment: string;
  plan: string;
  medications?: string;
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