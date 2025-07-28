import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  Phone,
  Mail,
  User,
  Calendar,
  Droplets,
} from "lucide-react";

// Mock data for demonstration
const mockPatients = [
  {
    id: "1",
    name: "John Smith",
    birthdate: "1985-03-15",
    gender: "male",
    occupation: "Engineer",
    address: "123 Main St, Springfield, IL 62701",
    phone: "+1 (555) 123-4567",
    email: "john.smith@email.com",
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    previousOperations: ["Appendectomy (2010)"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Mary Johnson",
    birthdate: "1978-11-22",
    gender: "female",
    occupation: "Teacher",
    address: "456 Oak Ave, Springfield, IL 62702",
    phone: "+1 (555) 987-6543",
    email: "mary.johnson@email.com",
    bloodType: "A+",
    allergies: ["Latex"],
    previousOperations: [],
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    name: "Robert Davis",
    birthdate: "1965-07-08",
    gender: "male",
    occupation: "Retired",
    address: "789 Pine St, Springfield, IL 62703",
    phone: "+1 (555) 555-0123",
    email: "robert.davis@email.com",
    bloodType: "B-",
    allergies: [],
    previousOperations: ["Knee Surgery (2018)", "Cataract Surgery (2020)"],
    createdAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z",
  },
];

// Simple UI Components for demo
const Button = ({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ placeholder, value, onChange, className = "" }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`border-b px-6 py-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-gray-300 text-gray-700",
    destructive: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Table = ({ children }) => (
  <table className="min-w-full divide-y divide-gray-200">{children}</table>
);

const TableHeader = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableBody = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);

const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-50">{children}</tr>
);

const TableHead = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
);

// Navigation mock
const navigate = (path) => {
  console.log("Navigate to:", path);
  alert(`Would navigate to: ${path}`);
};

export function PatientList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients] = useState(mockPatients);
  const [isMobileView, setIsMobileView] = useState(false);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Mobile Patient Card Component
  const PatientCard = ({ patient }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">
              {patient.occupation}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/patients/${patient.id}`)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/patients/${patient.id}/edit`)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {calculateAge(patient.birthdate)} yrs, {patient.gender}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="text-xs">
              {patient.bloodType}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{patient.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">
              {patient.email}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {patient.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {patient.allergies.slice(0, 2).map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {allergy}
                  </Badge>
                ))}
                {patient.allergies.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{patient.allergies.length - 2}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">
                No allergies
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(patient.updatedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Patients</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage and view all patient records
          </p>
        </div>
        <Button
          className="w-full md:w-auto"
          onClick={() => navigate("/add-patient")}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 md:flex-none"
                onClick={undefined}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              {/* Toggle view button for larger screens */}
              <div className="hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMobileView(!isMobileView)}
                >
                  {isMobileView ? "Table" : "Cards"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Statistics */}
      <div className="grid gap-3 grid-cols-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-lg md:text-2xl font-bold">
              {patients.length}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-lg md:text-2xl font-bold">
              {patients.filter((p) => p.allergies.length > 0).length}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Allergies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-lg md:text-2xl font-bold">
              {patients.filter((p) => p.previousOperations.length > 0).length}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Operations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View (default on mobile, optional on desktop) */}
      <div className="block md:hidden">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No patients found matching your search.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop Table View or Card View */}
      <div className="hidden md:block">
        {isMobileView ? (
          <div>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No patients found matching your search.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Patient Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Allergies</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{patient.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {patient.occupation}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{calculateAge(patient.birthdate)}</TableCell>
                        <TableCell className="capitalize">
                          {patient.gender}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{patient.bloodType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{patient.phone}</div>
                            <div className="text-muted-foreground">
                              {patient.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {patient.allergies.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {patient.allergies
                                .slice(0, 2)
                                .map((allergy, index) => (
                                  <Badge
                                    key={index}
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    {allergy}
                                  </Badge>
                                ))}
                              {patient.allergies.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{patient.allergies.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              None
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(patient.updatedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigate(`/patients/${patient.id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigate(`/patients/${patient.id}/edit`)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredPatients.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No patients found matching your search.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
