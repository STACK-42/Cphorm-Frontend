import { Activity, Users, FileText, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/medical-hero.jpg";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: "positive" | "negative";
}

function StatsCard({ title, value, icon, change, changeType }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={`text-xs ${
              changeType === "positive" ? "text-success" : "text-destructive"
            }`}
          >
            {change} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative p-6 md:p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, Dr. Abdelghani
            </h1>
            <p className="text-lg opacity-90">
              Manage your patients and track their health progress with ease.
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-transparent to-transparent opacity-20">
          <img
            src={heroImage}
            alt="Medical Dashboard"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Patients"
          value="1,234"
          icon={<Users className="h-4 w-4" />}
          change="+12%"
          changeType="positive"
        />
        <StatsCard
          title="Reports Today"
          value="23"
          icon={<FileText className="h-4 w-4" />}
          change="+8%"
          changeType="positive"
        />
        <StatsCard
          title="Pending Reviews"
          value="8"
          icon={<Activity className="h-4 w-4" />}
          change="-3%"
          changeType="negative"
        />
        <StatsCard
          title="Critical Alerts"
          value="2"
          icon={<AlertTriangle className="h-4 w-4" />}
          change="+1"
          changeType="negative"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "John Smith",
                  condition: "Hypertension Follow-up",
                  time: "10:30 AM",
                },
                {
                  name: "Omar Doe",
                  condition: "Diabetes Check",
                  time: "11:15 AM",
                },
                {
                  name: "Jane Doe",
                  condition: "Annual Physical",
                  time: "2:00 PM",
                },
                {
                  name: "Ahmed Musa",
                  condition: "Medication Review",
                  time: "3:30 PM",
                },
              ].map((patient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {patient.condition}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{patient.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <button
                className="p-4 text-left bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                onClick={() => navigate("/add-patient")}
              >
                <div className="font-medium">Add New Patient</div>
                <div className="text-sm text-muted-foreground">
                  Register a new patient in the system
                </div>
              </button>
              <button className="p-4 text-left bg-accent hover:bg-accent/80 rounded-lg transition-colors">
                <div className="font-medium">Create Report</div>
                <div className="text-sm text-muted-foreground">
                  Generate a new medical report
                </div>
              </button>
              <button className="p-4 text-left bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                <div className="font-medium">View Analytics</div>
                <div className="text-sm text-muted-foreground">
                  Check patient statistics and trends
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
