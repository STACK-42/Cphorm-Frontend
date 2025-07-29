import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

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

// Navigation

export function PatientList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch patients from API
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("https://cphorme_be.cphorme.workers.dev/api/v1/patient")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch patients");
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          // Ensure we have an array
          setPatients(Array.isArray(data) ? data : []);
        } catch (parseError) {
          throw new Error("Invalid JSON response from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching patients");
        setPatients([]); // Ensure patients is always an array
        setLoading(false);
      });
  }, []);

  const filteredPatients = Array.isArray(patients)
    ? patients.filter(
        (patient) =>
          (patient.name &&
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (patient.email &&
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (patient.phone && patient.phone.includes(searchTerm))
      )
    : [];

  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A";
    try {
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
      return isNaN(age) ? "N/A" : age;
    } catch (error) {
      return "N/A";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Mobile Patient Card Component
  const PatientCard = ({ patient }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {patient.name || "Unknown"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {patient.occupation || "N/A"}
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
              {calculateAge(patient.date_of_birth)} yrs,{" "}
              {patient.gender || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="text-xs">
              {patient.blood_type || "N/A"}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{patient.phone || "N/A"}</span>
          </div>
          {/* <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">
              {patient.email || "N/A"}
            </span>
          </div> */}
        </div>

        <div className="flex items-center justify-between">
          <div>
            {patient.allergies &&
            Array.isArray(patient.allergies) &&
            patient.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {patient.allergies.slice(0, 2).map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {typeof allergy === "string"
                      ? allergy
                      : allergy.allergen || "Unknown"}
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

      {/* Loading/Error */}
      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Loading patients...</p>
          </CardContent>
        </Card>
      )}
      {error && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Patient Statistics */}
      {!loading && !error && (
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
                {
                  patients.filter(
                    (p) =>
                      p.allergies &&
                      Array.isArray(p.allergies) &&
                      p.allergies.length > 0
                  ).length
                }
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Allergies
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="text-lg md:text-2xl font-bold">
                {
                  patients.filter(
                    (p) =>
                      p.operations &&
                      Array.isArray(p.operations) &&
                      p.operations.length > 0
                  ).length
                }
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Operations
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile Card View (default on mobile, optional on desktop) */}
      {!loading && !error && (
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
      )}

      {/* Desktop Table View or Card View */}
      {!loading && !error && (
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
                        {/* <TableHead>Last Updated</TableHead> */}
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{patient.name || "Unknown"}</div>
                              <div className="text-sm text-muted-foreground">
                                {patient.occupation || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {calculateAge(patient.date_of_birth)}
                          </TableCell>
                          <TableCell className="capitalize">
                            {patient.gender || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {patient.blood_type || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{patient.phone || "N/A"}</div>
                              {/* <div className="text-muted-foreground">
                                {patient.email || "N/A"}
                              </div> */}
                            </div>
                          </TableCell>
                          <TableCell>
                            {patient.allergies &&
                            Array.isArray(patient.allergies) &&
                            patient.allergies.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {patient.allergies
                                  .slice(0, 2)
                                  .map((allergy, index) => (
                                    <Badge
                                      key={index}
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      {typeof allergy === "string"
                                        ? allergy
                                        : allergy.allergen || "Unknown"}
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
                          {/* <TableCell className="text-sm">
                            {formatDate(patient.updatedAt)}
                          </TableCell> */}
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
      )}
    </div>
  );
}
