// import Footer from "@/components/Footer";
// import Header from "@/components/Header";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Login: React.FC = () => {
//   const navigate = useNavigate();
//   const [selectedCard, setSelectedCard] = useState<string | null>(null);
//   const handleCardSelection = (userType: string) => {
//     setSelectedCard(userType);
//     if (userType === "doctor") {
//       navigate("/login/doctor");
//     } else if (userType === "organization") {
//       navigate("/login/organization");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background font-inter">
//       <Header />
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
//         <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-3xl w-full border border-gray-200">
//           {/* Logo */}
//           <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold">
//             +
//           </div>

//           {/* Header */}
//           <h1 className="text-3xl font-semibold text-gray-900 mb-3">
//             Welcome to HealthCare Portal
//           </h1>
//           <p className="text-lg text-gray-600 mb-8">
//             Please select your login type to continue
//           </p>

//           {/* Login Options */}
//           <div className="flex gap-8 justify-center flex-wrap lg:flex-nowrap">
//             {/* Doctor Card */}
//             <div
//               className={`bg-white rounded-2xl p-10 shadow-xl transition-all duration-300 cursor-pointer border-4 border-transparent hover:border-blue-400 hover:transform hover:-translate-y-3 hover:shadow-2xl w-full max-w-sm relative overflow-hidden ${
//                 selectedCard === "doctor" ? "transform scale-95" : ""
//               }`}
//               onClick={() => handleCardSelection("doctor")}
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-opacity-20 to-transparent transform -translate-x-full hover:translate-x-full transition-transform duration-700"></div>

//               <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl shadow-lg">
//                 👨‍⚕️
//               </div>

//               <h2 className="text-3xl font-semibold text-gray-800 mb-4">
//                 Doctor Login
//               </h2>

//               <p className="text-gray-600 text-lg leading-relaxed mb-6">
//                 Access your patient records, appointments, and medical tools
//               </p>

//               <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full">
//                 Login as Doctor
//               </button>
//             </div>

//             {/* Organization Card */}
//             <div
//               className={`bg-white rounded-2xl p-10 shadow-xl transition-all duration-300 cursor-pointer border-4 border-transparent hover:border-blue-400 hover:transform hover:-translate-y-3 hover:shadow-2xl w-full max-w-sm relative overflow-hidden ${
//                 selectedCard === "organization" ? "transform scale-95" : ""
//               }`}
//               onClick={() => handleCardSelection("organization")}
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-opacity-20 to-transparent transform -translate-x-full hover:translate-x-full transition-transform duration-700"></div>

//               <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl shadow-lg">
//                 🏥
//               </div>

//               <h2 className="text-3xl font-semibold text-gray-800 mb-4">
//                 Organization Login
//               </h2>

//               <p className="text-gray-600 text-lg leading-relaxed mb-6">
//                 Manage your healthcare facility, staff, and administrative tasks
//               </p>

//               <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full">
//                 Login as Organization
//               </button>
//             </div>
//           </div>

//           {/* Footer Links */}
//           <div className="mt-12 text-gray-500">
//             <p>
//               Need help?
//               <a
//                 href="#support"
//                 className="text-blue-600 font-medium hover:underline ml-1"
//               >
//                 Contact Support
//               </a>
//               <span className="mx-2">|</span>
//               <a
//                 href="#privacy"
//                 className="text-blue-600 font-medium hover:underline"
//               >
//                 Privacy Policy
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Login;

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
