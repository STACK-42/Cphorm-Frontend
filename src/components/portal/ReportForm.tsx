import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COMMON_DISEASES } from '@/types/medical';
import { useToast } from '@/hooks/use-toast';

const reportSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
  subjective: z.string().min(10, 'Subjective findings must be at least 10 characters'),
  assessment: z.string().min(10, 'Assessment must be at least 10 characters'),
  treatmentPlan: z.string().min(10, 'Treatment plan must be at least 10 characters'),
  medication: z.string().min(1, 'Medication information is required'),
  diagnosis: z.string().min(1, 'Please select a diagnosis'),
  // Vitals
  height: z.number().min(30).max(300),
  weight: z.number().min(1).max(500),
  temperature: z.number().min(30).max(45),
  bloodPressureSystolic: z.number().min(70).max(250),
  bloodPressureDiastolic: z.number().min(40).max(150),
});

type ReportFormData = z.infer<typeof reportSchema>;

// Mock patients for selection
const mockPatients = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Mary Johnson' },
  { id: '3', name: 'Robert Davis' },
];

export function ReportForm() {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<string>('');

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      height: 170,
      weight: 70,
      temperature: 37.0,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
    },
  });

  const onSubmit = (data: ReportFormData) => {
    const reportData = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      doctorName: 'Dr. Sarah Johnson',
      vitals: {
        height: data.height,
        weight: data.weight,
        temperature: data.temperature,
        bloodPressureSystolic: data.bloodPressureSystolic,
        bloodPressureDiastolic: data.bloodPressureDiastolic,
        recordedAt: new Date().toISOString(),
      },
    };

    console.log('Report data:', reportData);
    
    toast({
      title: "Report Created Successfully",
      description: "Medical report has been saved to the patient's record.",
    });

    form.reset();
    setSelectedPatient('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Medical Report</h1>
        <p className="text-muted-foreground">
          Generate a comprehensive medical report for a patient
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Patient</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedPatient(value);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockPatients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
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
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodPressureSystolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Systolic BP (mmHg)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="120"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodPressureDiastolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diastolic BP (mmHg)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="80"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
                name="treatmentPlan"
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="medication"
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
            <Button type="button" variant="outline" onClick={() => {
              form.reset();
              setSelectedPatient('');
            }}>
              Reset Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}