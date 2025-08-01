import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BLOOD_TYPES, Patient } from "@/types/medical";
import { useToast } from "@/hooks/use-toast";

const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  birthdate: z.date({
    required_error: "Please select a birth date",
  }),
  gender: z.enum(["male", "female", "other"]),
  occupation: z.string().min(1, "Occupation is required"),
  address: z.string().min(10, "Please provide a complete address"),
  phone: z.string().min(10, "Please provide a valid phone number"),
  origin_state: z.string().min(3, "Please provide a valid origin state"),
  emergency_contact: z
    .string()
    .min(8, "Please provide a valid emergency contact"),
  email: z
    .string()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal("")),
  bloodType: z.string().min(1, "Please select a blood type"),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient;
  isEditing?: boolean;
}

export function PatientForm({ patient, isEditing = false }: PatientFormProps) {
  const [allergies, setAllergies] = useState<string[]>(
    patient?.allergies || []
  );
  const [operations, setOperations] = useState<string[]>(
    patient?.operations || []
  );
  const [newAllergy, setNewAllergy] = useState("");
  const [newOperation, setNewOperation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient
      ? {
          name: patient.name,
          birthdate: new Date(patient.date_of_birth),
          gender: patient.gender,
          occupation: patient.occupation,
          address: patient.address,
          phone: patient.phone,
          bloodType: patient.blood_type,
        }
      : undefined,
  });

  useEffect(() => {
    if (patient) {
      setAllergies(patient.allergies);
      setOperations(patient.operations);
    }
  }, [patient]);

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const addOperation = () => {
    if (newOperation.trim() && !operations.includes(newOperation.trim())) {
      setOperations([...operations, newOperation.trim()]);
      setNewOperation("");
    }
  };

  const removeOperation = (index: number) => {
    setOperations(operations.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);

    const patientData = {
      name: data.name,
      date_of_birth: data.birthdate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      gender: data.gender,
      occupation: data.occupation,
      address: data.address,
      phone: data.phone,
      email: data.email || "",
      origin_state: data.origin_state,
      emergency_contact: data.emergency_contact,
      blood_type: data.bloodType,
      allergies,
      operations,
    };

    try {
      let response;

      if (isEditing && patient) {
        // Update existing patient
        response = await fetch(
          `https://cphorme_be.cphorme.workers.dev/api/v1/patient/${patient.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(patientData),
          }
        );
      } else {
        // Create new patient
        response = await fetch(
          "https://cphorme_be.cphorme.workers.dev/api/v1/patient",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(patientData),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to ${isEditing ? "update" : "create"} patient: ${errorData}`
        );
      }

      const savedPatient = await response.json();

      console.log(
        isEditing
          ? "Patient updated successfully:"
          : "Patient created successfully:",
        savedPatient
      );

      toast({
        title: isEditing
          ? "Patient Updated Successfully"
          : "Patient Added Successfully",
        description: `${data.name} has been ${
          isEditing ? "updated" : "added to the system"
        }.`,
      });

      if (isEditing && patient) {
        // Navigate back to patient detail page
        navigate(`/patients/${patient.id}`);
      } else {
        // Navigate to the new patient's detail page or reset form
        if (savedPatient.id) {
          navigate(`/patients/${savedPatient.id}`);
        } else {
          // Fallback: reset form for new patient
          form.reset({
            name: "",
            birthdate: undefined,
            gender: undefined,
            occupation: "",
            address: "",
            phone: "",
            origin_state: "",
            emergency_contact: "",
            email: "",
            bloodType: "",
          });
          setAllergies([]);
          setOperations([]);
        }
      }
    } catch (error) {
      console.error("Error saving patient:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          isEditing ? "update" : "add"
        } patient. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEditing ? "Edit Patient" : "Add New Patient"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log("Form validation errors:", errors);
                toast({
                  title: "Validation Error",
                  description:
                    "Please check all required fields and try again.",
                  variant: "destructive",
                });
              })}
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter patient's full name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Birth Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BLOOD_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter occupation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergency_contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter emergency contact"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="origin_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin State</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter origin state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter complete address"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Allergies Section */}
              <div className="space-y-3">
                <FormLabel>Allergies</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add allergy"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addAllergy())
                    }
                  />
                  <Button type="button" onClick={addAllergy} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy, index) => (
                    <div
                      key={index}
                      className="bg-destructive/10 text-destructive px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span className="text-sm">{allergy}</span>
                      <button
                        type="button"
                        onClick={() => removeAllergy(index)}
                        className="hover:bg-destructive/20 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Previous Operations Section */}
              <div className="space-y-3">
                <FormLabel>Previous Operations</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add previous operation"
                    value={newOperation}
                    onChange={(e) => setNewOperation(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addOperation())
                    }
                  />
                  <Button type="button" onClick={addOperation} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {operations.map((operation, index) => (
                    <div
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span className="text-sm">{operation}</span>
                      <button
                        type="button"
                        onClick={() => removeOperation(index)}
                        className="hover:bg-primary/20 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 md:flex-none"
                  disabled={isSubmitting}
                  onClick={() => console.log("Submit button clicked")}
                >
                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Adding..."
                    : isEditing
                    ? "Update Patient"
                    : "Add Patient"}
                </Button>
                {!isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      console.log("Reset button clicked");
                      form.reset();
                      setAllergies([]);
                      setOperations([]);
                    }}
                    disabled={isSubmitting}
                  >
                    Reset Form
                  </Button>
                )}
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/patients/${patient?.id}`)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
