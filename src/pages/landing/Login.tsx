import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Static credentials
    if (
      formData.email === "ahmed@offsechq.com" &&
      formData.password === "mypassword"
    ) {
      localStorage.setItem("user_id", "1");
      localStorage.setItem("username", "Ahmed");
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
    setIsLoading(false);
  };
  const handleCardSelection = (userType: string) => {
    if (userType === "doctor") {
      navigate("/login/doctor");
    } else if (userType === "organization") {
      navigate("/login/organization");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />

      <section className="flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-midnight">
              Login to Your Account
            </CardTitle>
            <CardDescription>
              Access your dashboard and manage your healthcare tools seamlessly.
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
            <div className="flex flex-col p-6">
              {/* Doctor Card */}
              <div
                className="p-3"
                onClick={() => handleCardSelection("doctor")}
              >
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full">
                  Login as Doctor
                </button>
              </div>
              {/* organization Card */}
              <div
                className="p-3"
                onClick={() => handleCardSelection("organization")}
              >
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full">
                  Login as Organization
                </button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-cool-blue hover:underline">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
