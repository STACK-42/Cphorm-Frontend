// Patient interface for patient-related data
export interface Patient {
  id?: number;
  full_name: string;
  date_of_birth: string;
  gender: string;
  occupation: string;
  address: string;
  contact_information: string;
  location: string;
}

// FormData for patient creation/editing
export type PatientFormData = Omit<Patient, 'id'>; 