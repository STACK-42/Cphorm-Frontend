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
import { useEffect, useState } from "react";

// Replace mock data with API fetching
export function PatientEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPatient() {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(
          `https://cphorme_be.cphorme.workers.dev/api/v1/patient/${id}`
        );
        if (!res.ok) {
          setNotFound(true);
          setPatient(null);
        } else {
          const data = await res.json();
          setPatient(data[0]);
        }
      } catch {
        setNotFound(true);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPatient();
  }, [id]);

  async function handleUpdate(updatedPatient: Patient) {
    try {
      const res = await fetch(
        `https://cphorme_be.cphorme.workers.dev/api/v1/patient/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPatient),
        }
      );
      if (res.ok) {
        navigate(`/patients/${id}`);
      } else {
        // handle error (could show a toast or error message)
        alert("Failed to update patient.");
      }
    } catch {
      alert("Failed to update patient.");
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (notFound || !patient) {
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

      <PatientForm patient={patient} isEditing={true} onSubmit={handleUpdate} />
    </div>
  );
}
