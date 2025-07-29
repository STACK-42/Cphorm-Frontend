import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMMON_DISEASES, MedicalReport, Vitals } from "@/types/medical";
import { useToast } from "@/hooks/use-toast";

// Constant doctor ID
const DOCTOR_ID = "5a2f0bc2-6f27-4ab0-8418-e505a08b07e4";

const reportSchema = z.object({
  patient_id: z.string().min(1, "Please select a patient"),
  subjective: z
    .string()
    .min(10, "Subjective findings must be at least 10 characters"),
  assessment: z.string().min(10, "Assessment must be at least 10 characters"),
  plan: z.string().min(10, "Treatment plan must be at least 10 characters"),
  medications: z.string().min(1, "Medication information is required"),
  diagnosis: z.string().min(1, "Please select a diagnosis"),
  // Vitals
  height: z.number().min(30).max(300),
  weight: z.number().min(1).max(500),
  temperature: z.number().min(30).max(45),
  bp_systolic: z.number().min(70).max(250),
  bp_diastolic: z.number().min(40).max(150),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface ReportFormProps {
  report?: unknown;
  isEditing?: boolean;
}

export function ReportForm({ report, isEditing = false }: ReportFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<string>(
    report?.patient_id || ""
  );
  const [patients, setPatients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: report
      ? {
          patient_id: report.patient_id || "",
          subjective: report.subjective || "",
          assessment: report.assessment || "",
          plan: report.plan || "",
          medications: report.medications || "",
          diagnosis: report.diagnosis || "",
          height: report.vitals?.height || 170,
          weight: report.vitals?.weight || 70,
          temperature: report.vitals?.temperature || 37.0,
          bp_systolic: report.vitals?.bloodPressureSystolic || 120,
          bp_diastolic: report.vitals?.bloodPressureDiastolic || 80,
        }
      : {
          height: 170,
          weight: 70,
          temperature: 37.0,
          bp_systolic: 120,
          bp_diastolic: 80,
        },
  });

  // Fetch patients from API
  useEffect(() => {
    setLoadingPatients(true);
    fetch("https://cphorme_be.cphorme.workers.dev/api/v1/patient")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch patients");
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setPatients(Array.isArray(data) ? data : []);
        } catch (parseError) {
          throw new Error("Invalid JSON response from server");
        }
      })
      .catch((err) => {
        console.error("Error fetching patients:", err);
        toast({
          title: "Error",
          description: "Failed to load patients. Please refresh the page.",
          variant: "destructive",
        });
        setPatients([]);
      })
      .finally(() => setLoadingPatients(false));
  }, [toast]);

  const onSubmit = async (data: ReportFormData) => {
    console.log("onSubmit called with data:", data);
    setIsSubmitting(true);

    const reportData = {
      patient_id: data.patient_id,
      doctor_id: DOCTOR_ID, // Add the constant doctor ID
      subjective: data.subjective,
      assessment: data.assessment,
      plan: data.plan,
      medications: data.medications,
      diagnosis: data.diagnosis,
      vitals: {
        height: data.height,
        weight: data.weight,
        temperature: data.temperature,
        bloodPressureSystolic: data.bp_systolic,
        bloodPressureDiastolic: data.bp_diastolic,
        recordedAt: new Date().toISOString(),
      },
    };

    try {
      let response;

      if (isEditing && report) {
        // Update existing report
        response = await fetch(
          `https://cphorme_be.cphorme.workers.dev/api/v1/reports/${report.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reportData),
          }
        );
      } else {
        // Create new report
        response = await fetch(
          "https://cphorme_be.cphorme.workers.dev/api/v1/report",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reportData),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to ${isEditing ? "update" : "create"} report: ${errorData}`
        );
      }

      const savedReport = await response.json();

      console.log(
        isEditing
          ? "Report updated successfully:"
          : "Report created successfully:",
        savedReport
      );

      toast({
        title: isEditing
          ? "Report Updated Successfully"
          : "Report Created Successfully",
        description: `Medical report has been ${
          isEditing ? "updated" : "saved to the patient's record"
        }.`,
      });

      if (isEditing && report) {
        // Navigate back to report detail page
        navigate(`/reports/${report.id}`);
      } else {
        // Navigate to the new report's detail page or reset form
        if (savedReport.id) {
          navigate(`/reports/${savedReport.id}`);
        } else {
          // Fallback: reset form for new report
          form.reset({
            patient_id: "",
            subjective: "",
            assessment: "",
            plan: "",
            medications: "",
            diagnosis: "",
            height: 170,
            weight: 70,
            temperature: 37.0,
            bp_systolic: 120,
            bp_diastolic: 80,
          });
          setSelectedPatient("");
        }
      }
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          isEditing ? "update" : "create"
        } report. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Medical Report" : "Create Medical Report"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? "Update the medical report details"
            : "Generate a comprehensive medical report for a patient"}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Form validation errors:", errors);
            toast({
              title: "Validation Error",
              description: "Please check all required fields and try again.",
              variant: "destructive",
            });
          })}
          className="space-y-6"
        >
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Patient</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedPatient(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingPatients
                                ? "Loading patients..."
                                : "Choose a patient"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingPatients ? (
                          <SelectItem value="loading" disabled>
                            Loading patients...
                          </SelectItem>
                        ) : patients.length > 0 ? (
                          patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name || "Unknown Patient"}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-patients" disabled>
                            No patients available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="170"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="70"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature (°C)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="37.0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bp_systolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Systolic BP (mmHg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="120"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bp_diastolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diastolic BP (mmHg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="80"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Clinical Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Clinical Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="subjective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subjective (Patient's Description)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Patient reports symptoms, concerns, and history..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assessment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessment (Clinical Findings)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Physical examination findings, test results, clinical judgment..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Plan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Proposed treatment approach, follow-up care, patient education..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Diagnosis and Medication */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis & Medication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Diagnosis</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary diagnosis" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {COMMON_DISEASES.map((disease) => (
                          <SelectItem key={disease} value={disease}>
                            {disease}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication & Dosage</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Prescribed medications, dosages, frequency, duration..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 md:flex-none">
              Create Report
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setSelectedPatient("");
              }}
            >
              Reset Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
