import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  User,
  Calendar,
  FileText,
  Activity,
  Stethoscope,
} from "lucide-react";
import { report } from "process";
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
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
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

export function ReportList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch reports from API
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("https://cphorme_be.cphorme.workers.dev/api/v1/report")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch reports");
        const text = await res.text();

        let parsedReports;
        try {
          parsedReports = JSON.parse(text);
          if (!Array.isArray(parsedReports)) parsedReports = [];
        } catch (parseError) {
          throw new Error("Invalid JSON response from server");
        }

        // Fetch patient and doctor names for each report
        const enrichedReports = await Promise.all(
          parsedReports.map(async (report) => {
            try {
              const [patientRes, doctorRes] = await Promise.all([
                fetch(
                  `https://cphorme_be.cphorme.workers.dev/api/v1/patient/${report.patient_id}`
                ),
                fetch(
                  `https://cphorme_be.cphorme.workers.dev/api/v1/doctor/${report.doctor_id}`
                ),
              ]);

              const patientData = await patientRes.json();
              const doctorData = await doctorRes.json();

              return {
                ...report,
                patient_name: patientData[0].name || "Unknown Patient",
                doctor_name: doctorData[0].name || "Unknown Doctor",
              };
            } catch (e) {
              // If fetch fails for either patient or doctor, fallback to IDs
              return {
                ...report,
                patient_name: report.patient_id,
                doctor_name: report.doctor_id,
              };
            }
          })
        );

        setReports(enrichedReports);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching reports");
        setReports([]); // Ensure reports is always an array
        setLoading(false);
      });
  }, []);

  const filteredReports = Array.isArray(reports)
    ? reports.filter(
        (report) =>
          (report.patientName &&
            report.patientName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (report.doctorName &&
            report.doctorName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (report.diagnosis &&
            report.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

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

  const getReportStatus = (report) => {
    if (!report.createdAt) return { text: "Unknown", variant: "outline" };

    const today = new Date();
    const reportDate = new Date(report.createdAt);
    const daysDiff = Math.floor((today - reportDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) return { text: "Today", variant: "success" };
    if (daysDiff <= 7) return { text: "Recent", variant: "default" };
    if (daysDiff <= 30) return { text: "This Month", variant: "warning" };
    return { text: "Older", variant: "outline" };
  };

  // Mobile Report Card Component
  const ReportCard = ({ report }) => {
    const status = getReportStatus(report);

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {report.patient_name || "Unknown Patient"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {report.doctor_name || "Unknown Doctor"}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/reports/${report.id}`)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/reports/${report.id}/edit`)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {report.diagnosis || "No diagnosis"}
              </span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <Badge variant={status.variant} className="text-xs">
                {status.text}
              </Badge>
            </div> */}
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {report.assessment
                  ? report.assessment.substring(0, 50) + "..."
                  : "No assessment"}
              </span>
            </div>
            {report.vitals &&
            Array.isArray(report.vitals) &&
            report.vitals.length > 0 ? (
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  BP: {report.vitals[0].bp_systolic || "N/A"}/
                  {report.vitals[0].bp_diastolic || "N/A"} | Temp:{" "}
                  {report.vitals[0].temperature || "N/A"}°C
                </span>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(report.createdAt)}
            </div>
            <Badge variant="outline" className="text-xs">
              Report #{report.id ? report.id.substring(0, 8) : "Unknown"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Medical Reports</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage and view all patient medical reports
          </p>
        </div>
        <Button
          className="w-full md:w-auto"
          onClick={() => navigate("/add-report")}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Report
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, doctor, or diagnosis..."
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
            <p className="text-muted-foreground">Loading reports...</p>
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

      {/* Report Statistics */}
      {!loading && !error && (
        <div className="grid gap-3 grid-cols-3 md:gap-4">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="text-lg md:text-2xl font-bold">
                {reports.length}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="text-lg md:text-2xl font-bold">
                {
                  reports.filter((r) => {
                    const today = new Date();
                    const reportDate = new Date(r.createdAt);
                    return reportDate.toDateString() === today.toDateString();
                  }).length
                }
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="text-lg md:text-2xl font-bold">
                {
                  reports.filter((r) => {
                    const today = new Date();
                    const reportDate = new Date(r.createdAt);
                    const daysDiff = Math.floor(
                      (today - reportDate) / (1000 * 60 * 60 * 24)
                    );
                    return daysDiff <= 7;
                  }).length
                }
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                This Week
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile Card View (default on mobile, optional on desktop) */}
      {!loading && !error && (
        <div className="block md:hidden">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No reports found matching your search.
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
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No reports found matching your search.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Medical Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead>Vitals</TableHead>
                        {/* <TableHead>Status</TableHead> */}
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => {
                        const status = getReportStatus(report);

                        return (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">
                              <div>
                                <div>
                                  {report.patient_name || "Unknown Patient"}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  ID:{" "}
                                  {report.patient_id
                                    ? report.patient_id.substring(0, 8)
                                    : "N/A"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              Dr. {report.doctor_name || "Unknown"}
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="font-medium">
                                  {report.diagnosis || "No diagnosis"}
                                </div>
                                {report.assessment && (
                                  <div className="text-sm text-muted-foreground truncate">
                                    {report.assessment.substring(0, 50)}...
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {report.vitals &&
                              Array.isArray(report.vitals) &&
                              report.vitals.length > 0 ? (
                                <div className="text-sm">
                                  <div>
                                    BP: {report.vitals[0].bp_systolic || "N/A"}/
                                    {report.vitals[0].bp_diastolic || "N/A"}
                                  </div>
                                  <div className="text-muted-foreground">
                                    Temp:{" "}
                                    {report.vitals[0].temperature || "N/A"}°C
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  No vitals
                                </span>
                              )}
                            </TableCell>
                            {/* <TableCell>
                              <Badge variant={status.variant}>
                                {status.text}
                              </Badge>
                            </TableCell> */}
                            <TableCell className="text-sm">
                              {formatDate(report.created_at)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    navigate(`/reports/${report.id}`)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    navigate(`/reports/${report.id}/edit`)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {filteredReports.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No reports found matching your search.
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
