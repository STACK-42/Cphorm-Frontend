import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "Health Data Insights",
      description: "Advanced analytics and data visualization tools to track disease patterns and healthcare trends.",
      icon: "📊"
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
      title: "Disease Surveillance",
      description: "Real-time monitoring and reporting tools to track disease outbreaks and health trends across regions.",
      icon: "🔍"
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
    <section id="features" className="py-20 bg-background dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
            Powerful Features for Modern Healthcare
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up-delay-100">
            Discover how Cphorm's features can transform your healthcare practice
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`border-border hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 bg-card hover:bg-card/80 dark:hover:bg-card/60 group cursor-pointer animate-fade-in-up`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce-in">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed group-hover:text-foreground transition-colors duration-300">
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