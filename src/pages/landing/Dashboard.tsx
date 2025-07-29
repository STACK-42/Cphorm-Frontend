import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Patient, PatientFormData } from "@/types";

const initialFormData: PatientFormData = {
  full_name: "",
  date_of_birth: "",
  gender: "",
  occupation: "",
  address: "",
  contact_information: "",
  location: "",
};

const mockPatients: Patient[] = [
  {
    id: 1,
    full_name: "John Doe",
    date_of_birth: "1985-06-15",
    gender: "Male",
    occupation: "Engineer",
    address: "123 Main St",
    contact_information: "+1-555-0123",
    location: "New York",
  },
  {
    id: 2,
    full_name: "Jane Smith",
    date_of_birth: "1990-03-22",
    gender: "Female",
    occupation: "Teacher",
    address: "456 Oak Ave",
    contact_information: "+1-555-0456",
    location: "California",
  },
];

const PatientTable: React.FC<{ patients: Patient[] }> = ({ patients }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.full_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.date_of_birth}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.gender}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.contact_information}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.location}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="link" asChild>
                  <Link to={`/patients/${patient.id}`}>View</Link>
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No patients found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const AddPatientModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PatientFormData) => void;
  formData: PatientFormData;
  setFormData: React.Dispatch<React.SetStateAction<PatientFormData>>;
}> = ({ open, onOpenChange, onSubmit, formData, setFormData }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent aria-label="Add Patient Modal">
      <DialogHeader>
        <DialogTitle>Add Patient</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit(formData);
        }}
        className="space-y-4"
      >
        <input type="text" id="full_name" placeholder="Full Name" value={formData.full_name} onChange={e => setFormData(f => ({ ...f, full_name: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 rounded-md" aria-label="Full Name" />
        <input type="date" id="date_of_birth" value={formData.date_of_birth} onChange={e => setFormData(f => ({ ...f, date_of_birth: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 rounded-md" aria-label="Date of Birth" />
        <input type="text" id="gender" placeholder="Gender" value={formData.gender} onChange={e => setFormData(f => ({ ...f, gender: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 rounded-md" aria-label="Gender" />
        <input type="text" id="occupation" placeholder="Occupation" value={formData.occupation} onChange={e => setFormData(f => ({ ...f, occupation: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 rounded-md" aria-label="Occupation" />
        <input type="text" id="address" placeholder="Address" value={formData.address} onChange={e => setFormData(f => ({ ...f, address: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 rounded-md" aria-label="Address" />
        <input type="text" id="contact_information" placeholder="Contact Information" value={formData.contact_information} onChange={e => setFormData(f => ({ ...f, contact_information: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 rounded-md" aria-label="Contact Information" />
        <input type="text" id="location" placeholder="Location" value={formData.location} onChange={e => setFormData(f => ({ ...f, location: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 rounded-md" aria-label="Location" />
        <DialogFooter>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);

const DoctorDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);

  // Mock user data (replace with real user context in production)
  const user = { username: "Smith", user_id: "1" };

  useEffect(() => {
    setPatients(mockPatients);
  }, []);

  const handleAddPatient = (data: PatientFormData) => {
    if (Object.values(data).some(v => !v)) {
      alert("Please fill in all fields");
      return;
    }
    setPatients(prev => [...prev, { ...data, id: prev.length + 1 }]);
    setFormData(initialFormData);
    setIsModalOpen(false);
    alert("Patient added successfully");
  };

  return (
    <SidebarProvider>
      <div className="bg-gray-50 h-screen flex overflow-hidden">
        {/* Sidebar */}
        {/* Replace with your sidebar navigation items as children if needed */}
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          {/* Header */}
          <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-xl font-semibold text-gray-800">Doctor Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <i className="fas fa-bell text-gray-500" aria-label="Notifications"></i>
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-600"></span>
                </div>
                <div className="flex items-center">
                  <img src={`https://ui-avatars.com/api/?name=Dr+${user.username}&background=2563eb&color=fff`} alt="User" className="h-8 w-8 rounded-full" />
                  <span className="ml-2 text-sm font-medium hidden md:inline">Dr. {user.username}</span>
                </div>
              </div>
            </div>
          </header>
          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">Patients</h2>
                <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <i className="fas fa-plus mr-2"></i>Add Patient
                </Button>
              </div>
              <PatientTable patients={patients} />
            </div>
          </main>
        </div>
        <AddPatientModal open={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={handleAddPatient} formData={formData} setFormData={setFormData} />
      </div>
    </SidebarProvider>
  );
};

export default DoctorDashboard;
