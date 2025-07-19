import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User } from "lucide-react";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({ userId: "", username: "" });
  const [patientData, setPatientData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    occupation: "",
    address: "",
    contact_information: "",
    location: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication (same logic as original)
    const userId = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');

    if (!userId || !username) {
      toast({
        title: "Unauthorized",
        description: "Please sign up or log in.",
        variant: "destructive"
      });
      navigate('/signup');
      return;
    }

    setUserInfo({ userId, username });
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      toast({
        title: "Patient created",
        description: `Patient ID: ${result.patient_id}`,
      });

      // Reset form
      setPatientData({
        full_name: "",
        date_of_birth: "",
        gender: "",
        occupation: "",
        address: "",
        contact_information: "",
        location: ""
      });
    } catch (error: any) {
      setError('Error creating patient: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!userInfo.userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-cool-blue" />
            <span className="text-lg font-semibold text-midnight">
              Welcome, Dr. {userInfo.username} (ID: {userInfo.userId})
            </span>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-midnight">
                Add New Patient
              </CardTitle>
              <CardDescription>
                Create a new patient record in the system.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert className="mb-4 border-destructive">
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handlePatientSubmit} className="space-y-4">
                <div>
                  <Input
                    name="full_name"
                    placeholder="Full Name"
                    value={patientData.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    name="date_of_birth"
                    type="date"
                    placeholder="Date of Birth"
                    value={patientData.date_of_birth}
                    onChange={(e) => handleChange("date_of_birth", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Select
                    name="gender"
                    value={patientData.gender}
                    onValueChange={(value) => handleChange("gender", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Input
                    name="occupation"
                    placeholder="Occupation"
                    value={patientData.occupation}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Textarea
                    name="address"
                    placeholder="Address"
                    value={patientData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    name="contact_information"
                    placeholder="Contact Information"
                    value={patientData.contact_information}
                    onChange={(e) => handleChange("contact_information", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    name="location"
                    placeholder="Location"
                    value={patientData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-cool-blue hover:bg-cool-blue/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Patient..." : "Create Patient"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;