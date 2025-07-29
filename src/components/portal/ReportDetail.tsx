import { useParams, useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Stethoscope,
  Activity,
  Pill,
  ClipboardList,
  Heart,
  Thermometer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";

interface ReportData {
  id: string;
  patient_id: string;
  doctor_id: string;
  subjective: string;
  assessment: string;
  plan: string;
  medications: string;
  diagnosis: string;
  vitals: {
    height: number;
    weight: number;
    temperature: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    recordedAt: string;
  };
  created_at: string;
  updated_at?: string;
  patient_name?: string;
  doctor_name?: string;
}

export function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`https://cphorme_be.cphorme.workers.dev/api/v1/report/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Report not found");
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          const reportData = Array.isArray(data) ? data[0] : data;

          // Fetch patient and doctor names
          try {
            const [patientRes, doctorRes] = await Promise.all([
              fetch(
                `https://cphorme_be.cphorme.workers.dev/api/v1/patient/${reportData.patient_id}`
              ),
              fetch(
                `https://cphorme_be.cphorme.workers.dev/api/v1/doctor/${reportData.doctor_id}`
              ),
            ]);

            const patientData = await patientRes.json();
            const doctorData = await doctorRes.json();

            setReport({
              ...reportData,
              patient_name: patientData[0]?.name || "Unknown Patient",
              doctor_name: doctorData[0]?.name || "Unknown Doctor",
            });
          } catch (nameError) {
            // If fetching names fails, use the report data without names
            setReport({
              ...reportData,
              patient_name: reportData.patient_id,
              doctor_name: reportData.doctor_id,
            });
          }
        } catch (parseError) {
          throw new Error("Invalid JSON response from server");
        }
      })
      .catch((err) => setError(err.message || "Error fetching report data"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
        <p className="text-muted-foreground mb-4">
          {error || "The requested medical report could not be found."}
        </p>
        <Button onClick={() => navigate("/reports")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const formatDateOnly = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Additional safety check for empty report object
  if (!report || Object.keys(report).length === 0) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-2">No Report Data</h1>
        <p className="text-muted-foreground mb-4">
          Report data is empty or corrupted.
        </p>
        <Button onClick={() => navigate("/reports")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => navigate("/reports")}
              className="cursor-pointer"
            >
              Reports
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              Report #{report.id ? report.id.substring(0, 8) : "Unknown"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medical Report</h1>
          <p className="text-muted-foreground">
            Patient: {report.patient_name || "Unknown Patient"} • Doctor:{" "}
            {report.doctor_name || "Unknown Doctor"}
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button onClick={() => navigate(`/reports/${report.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Report
          </Button>/ */}
          <Button
            variant="outline"
            onClick={() => navigate(`/patients/${report.patient_id}`)}
          >
            <User className="h-4 w-4 mr-2" />
            View Patient
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Report Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(report.created_at)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Primary Diagnosis
                </p>
                <Badge variant="outline" className="mt-1">
                  {report.diagnosis || "N/A"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Attending Doctor
                </p>
                <p className="font-medium">
                  {report.doctor_name || "Unknown Doctor"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Patient</p>
                <p className="font-medium">
                  {report.patient_name || "Unknown Patient"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vital Signs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Vital Signs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.vitals ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">
                        H
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="font-medium">
                        {report.vitals[0].height || "N/A"} cm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">
                        W
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="font-medium">
                        {report.vitals[0].weight || "N/A"} kg
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Temperature
                      </p>
                      <p className="font-medium">
                        {report.vitals[0].temperature || "N/A"}°C
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Blood Pressure
                      </p>
                      <p className="font-medium">
                        {report.vitals[0].bp_systolic || "N/A"}/
                        {report.vitals[0].bp_diastolic || "N/A"} mmHg
                      </p>
                    </div>
                  </div>
                </div>

                {report.vitals.recordedAt && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Recorded: {formatDate(report.vitals.recordedAt)}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground italic">
                No vital signs recorded
              </p>
            )}
          </CardContent>
        </Card>

        {/* Clinical Assessment */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Clinical Assessment (SOAP)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                Subjective (Patient's Description)
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm leading-relaxed">
                  {report.subjective || "No subjective findings recorded."}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                Assessment (Clinical Findings)
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm leading-relaxed">
                  {report.assessment || "No assessment recorded."}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                Plan (Treatment Plan)
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm leading-relaxed">
                  {report.plan || "No treatment plan recorded."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medications & Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                {report.medications || "No medications prescribed."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Back Button */}
      <div className="flex justify-start pt-4">
        <Button variant="outline" onClick={() => navigate("/reports")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
      </div>
    </div>
  );
}
