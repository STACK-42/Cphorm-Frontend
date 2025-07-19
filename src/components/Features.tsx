import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "AI-Powered Diagnostics",
      description: "Advanced machine learning algorithms assist healthcare providers with accurate and rapid diagnostic insights.",
      icon: "🧠"
    },
    {
      title: "Patient Management",
      description: "Comprehensive patient records, appointment scheduling, and treatment tracking in one unified platform.",
      icon: "👥"
    },
    {
      title: "Secure & HIPAA Compliant",
      description: "Enterprise-grade security ensuring patient data privacy and regulatory compliance.",
      icon: "🔒"
    },
    {
      title: "Real-time Analytics",
      description: "Insights and reporting tools to optimize healthcare operations and improve patient outcomes.",
      icon: "📊"
    },
    {
      title: "Mobile Access",
      description: "Access patient information and manage healthcare operations from anywhere, on any device.",
      icon: "📱"
    },
    {
      title: "Integration Ready",
      description: "Seamlessly integrates with existing healthcare systems and electronic health records.",
      icon: "🔗"
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-midnight mb-4">
            Powerful Features for Modern Healthcare
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how Cphorm's innovative features can transform your healthcare practice
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card"
            >
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-semibold text-midnight">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;