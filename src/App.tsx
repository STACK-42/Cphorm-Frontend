import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/landing/Index";
import Login from "./pages/landing/Login";
import DoctorLogin from "./pages/landing/DoctorLogin";
import OrgLogin from "./pages/landing/OrgLogin";
import Signup from "./pages/landing/Signup";
import Dashboard from "./pages/landing/Dashboard";
import Insights from "./pages/landing/Insights";
import NotFound from "./pages/landing/NotFound";
import Patients from "./pages/landing/Patients";

import { Layout } from "@/components/portal/Layout";
import ProtalIndex from "./pages/portal/Index";
import PatientsPage from "./pages/portal/PatientsPage";
import PatientDetailPage from "./pages/portal/PatientDetailPage";
import PatientEditPage from "./pages/portal/PatientEditPage";
import AddPatientPage from "./pages/portal/AddPatientPage";
import ReportsPage from "./pages/portal/ReportsPage";
import AddReportPage from "./pages/portal/AddReportPage";
import ReportDetailsPage from "./pages/portal/ReportDetailsPage";
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient();

const PortalLayout = ({ children }) => <Layout>{children}</Layout>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="cphorm-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* landing routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/doctor" element={<DoctorLogin />} />
            <Route path="/login/organization" element={<OrgLogin />} />
            <Route path="/logout" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/insights" element={<Insights />} />
            {/* <Route path="/patients" element={<Patients />} /> */}

            {/* portal routes */}
            <Route
              path="/dashboard"
              element={
                <PortalLayout>
                  <ProtalIndex />
                </PortalLayout>
              }
            />
            <Route
              path="/patients"
              element={
                <PortalLayout>
                  <PatientsPage />
                </PortalLayout>
              }
            />
            <Route
              path="/patients/:id"
              element={
                <PortalLayout>
                  <PatientDetailPage />
                </PortalLayout>
              }
            />
            <Route
              path="/patients/:id/edit"
              element={
                <PortalLayout>
                  <PatientEditPage />
                </PortalLayout>
              }
            />
            <Route
              path="/add-patient"
              element={
                <PortalLayout>
                  <AddPatientPage />
                </PortalLayout>
              }
            />
            <Route
              path="/reports"
              element={
                <PortalLayout>
                  <ReportsPage />
                </PortalLayout>
              }
            />
            <Route
              path="/add-report"
              element={
                <PortalLayout>
                  <AddReportPage />
                </PortalLayout>
              }
            />
            <Route
              path="/reports/:id"
              element={
                <PortalLayout>
                  <ReportDetailsPage />
                </PortalLayout>
              }
            />


          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    <Analytics/>
  </QueryClientProvider>
);

export default App;
