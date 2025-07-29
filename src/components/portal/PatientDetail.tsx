import { useParams, useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  ArrowLeft,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
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
import { Patient } from "@/types/medical";
import { useEffect, useState } from "react";

export function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`https://cphorme_be.cphorme.workers.dev/api/v1/patient/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Patient not found");
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setPatient(data[0]);
        } catch (parseError) {
          throw new Error("Invalid JSON response from server");
        }
      })
      .catch((err) => setError(err.message || "Error fetching patient data"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-2">Patient Not Found</h1>
        <p className="text-muted-foreground mb-4">
          {error || "The requested patient record could not be found."}
        </p>
        <Button onClick={() => navigate("/patients")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>
      </div>
    );
  }

  const calculateAge = (birthdate: string) => {
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

  const formatDate = (dateString: string) => {
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

  // Additional safety check for empty patient object
  if (!patient || Object.keys(patient).length === 0) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-2">No Patient Data</h1>
        <p className="text-muted-foreground mb-4">
          Patient data is empty or corrupted.
        </p>
        <Button onClick={() => navigate("/patients")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
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
              onClick={() => navigate("/patients")}
              className="cursor-pointer"
            >
              Patients
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{patient.name || "Unknown Patient"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>{" "}
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {patient.name || "Unknown Patient"}
          </h1>
          <p className="text-muted-foreground">
            {calculateAge(patient.date_of_birth)} years old •{" "}
            {patient.occupation || "N/A"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/patients/${patient.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Birth Date</p>
                <p className="font-medium">
                  {formatDate(patient.date_of_birth)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-4 w-4 flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">
                  {patient.gender === "male"
                    ? "M"
                    : patient.gender === "female"
                    ? "F"
                    : patient.gender
                    ? "O"
                    : "N/A"}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium capitalize">
                  {patient.gender || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-4 w-4 flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">
                  B
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Type</p>
                <Badge variant="outline" className="mt-1">
                  {patient.blood_type || "N/A"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{patient.phone || "N/A"}</p>
              </div>
            </div>

            {/* <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
            </div> */}

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{patient.address || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Allergies</p>
              {patient.allergies &&
              Array.isArray(patient.allergies) &&
              patient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive">
                      {typeof allergy === "string"
                        ? allergy
                        : allergy.allergen || "Unknown allergy"}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No known allergies
                </p>
              )}
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Previous Operations
              </p>
              {patient.operations &&
              Array.isArray(patient.operations) &&
              patient.operations.length > 0 ? (
                <div className="space-y-2">
                  {patient.operations.map((operation, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                      <span className="text-sm">
                        {typeof operation === "string"
                          ? operation
                          : operation.name || "Unknown operation"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No previous operations
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Record Information */}
        <Card>
          <CardHeader>
            <CardTitle>Record Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(patient.created_at)}</p>
            </div>

            {/* <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDate(patient.updatedAt)}</p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
