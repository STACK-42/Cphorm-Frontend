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

// Mock data - in real app, this would come from API/state management
const mockPatients: Patient[] = [
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

export function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const patient = mockPatients.find((p) => p.id === id);

  if (!patient) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-2">Patient Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The requested patient record could not be found.
        </p>
        <Button onClick={() => navigate("/patients")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>
      </div>
    );
  }

  const calculateAge = (birthdate: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
            <BreadcrumbPage>{patient.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{patient.name}</h1>
          <p className="text-muted-foreground">
            {calculateAge(patient.birthdate)} years old • {patient.occupation}
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
                <p className="font-medium">{formatDate(patient.birthdate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-4 w-4 flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">
                  {patient.gender === "male"
                    ? "M"
                    : patient.gender === "female"
                    ? "F"
                    : "O"}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium capitalize">{patient.gender}</p>
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
                  {patient.bloodType}
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
                <p className="font-medium">{patient.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{patient.address}</p>
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
              {patient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive">
                      {allergy}
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
              {patient.previousOperations.length > 0 ? (
                <div className="space-y-2">
                  {patient.previousOperations.map((operation, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                      <span className="text-sm">{operation}</span>
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
              <p className="font-medium">{formatDate(patient.createdAt)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDate(patient.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
