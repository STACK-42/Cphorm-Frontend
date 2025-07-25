import { useState } from "react";
import logo from "@/assets/logo.svg";
import pfp from "@/assets/pfp.jpg";

const initialPatients = [
  // Example patient data
  // { full_name: "John Doe", date_of_birth: "1990-01-01", gender: "Male", contact_information: "1234567890", location: "City" }
];

const profilePlaceholder = "https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff";

const Patients = () => {
  const [patients, setPatients] = useState<any[]>(initialPatients);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    occupation: "",
    address: "",
    contact_information: "",
    location: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    setPatients([...patients, form]);
    setForm({
      full_name: "",
      date_of_birth: "",
      gender: "",
      occupation: "",
      address: "",
      contact_information: "",
      location: ""
    });
    setModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="sidebar bg-white w-64 flex-shrink-0 shadow-md h-full z-10 hidden md:block">
        <div className="p-4 border-b border-gray-200">
          <img src={logo} alt="Logo" className="h-10 w-auto mb-2" />
          <h2 className="text-xl font-bold text-primary">Cphorm</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li><a href="/dashboard" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"><span className="material-icons mr-3">dashboard</span><span>Dashboard</span></a></li>
            <li><a href="/patients" className="flex items-center p-2 text-gray-700 bg-gray-100 rounded-lg font-semibold"><span className="material-icons mr-3">groups</span><span>Patients</span></a></li>
            <li><a href="/manage-forms" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"><span className="material-icons mr-3">description</span><span>Manage Forms</span></a></li>
            <li><a href="/insights" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"><span className="material-icons mr-3">bar_chart</span><span>Explore Data</span></a></li>
          </ul>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold text-gray-800">Patients</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img src={pfp} alt="User" className="h-8 w-8 rounded-full" />
                <span className="ml-2 text-sm font-medium hidden md:inline">Dr. User</span>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">Patients</h2>
              <button onClick={() => setModalOpen(true)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition">
                <span className="material-icons mr-2">add</span>Add Patient
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DOB</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.length > 0 ? patients.map((patient, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.full_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.date_of_birth}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.contact_information}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.location}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No patients found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      {/* Add Patient Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="px-4 pt-5 pb-4 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add Patient</h3>
              <form className="space-y-4" onSubmit={handleAddPatient}>
                <input type="text" name="full_name" placeholder="Full Name" required className="w-full border px-3 py-2 rounded" value={form.full_name} onChange={handleChange} />
                <input type="date" name="date_of_birth" required className="w-full border px-3 py-2 rounded" value={form.date_of_birth} onChange={handleChange} />
                <input type="text" name="gender" placeholder="Gender" required className="w-full border px-3 py-2 rounded" value={form.gender} onChange={handleChange} />
                <input type="text" name="occupation" placeholder="Occupation" required className="w-full border px-3 py-2 rounded" value={form.occupation} onChange={handleChange} />
                <input type="text" name="address" placeholder="Address" required className="w-full border px-3 py-2 rounded" value={form.address} onChange={handleChange} />
                <input type="text" name="contact_information" placeholder="Contact Information" required className="w-full border px-3 py-2 rounded" value={form.contact_information} onChange={handleChange} />
                <input type="text" name="location" placeholder="Location" required className="w-full border px-3 py-2 rounded" value={form.location} onChange={handleChange} />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-700">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary text-white">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients; 