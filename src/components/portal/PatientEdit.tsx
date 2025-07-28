import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PatientForm } from "@/components/portal/PatientForm";
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

export function PatientEdit() {
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
            <BreadcrumbLink
              onClick={() => navigate(`/patients/${patient.id}`)}
              className="cursor-pointer"
            >
              {patient.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Patient</h1>
          <p className="text-muted-foreground">
            Update {patient.name}'s information
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/patients/${patient.id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      <PatientForm patient={patient} isEditing={true} />
    </div>
  );
}
