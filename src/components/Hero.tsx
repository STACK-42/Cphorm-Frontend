import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-soft-gray via-background to-background dark:from-background dark:via-muted/10 dark:to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent" />
      
      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up">
            Revolutionizing
            <span className="text-primary block md:inline md:ml-4 animate-fade-in-up-delay-100">
              Healthcare
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay-200">
            Cphorm is a modern medical system designed to streamline patient management, 
            enhance diagnostics, and empower healthcare providers with AI-driven tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delay-300">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Learn More
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-border animate-fade-in">
            <p className="text-sm text-muted-foreground mb-4">Trusted by healthcare providers</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-lg font-semibold text-foreground transition-all duration-300 hover:opacity-100 hover:scale-105">500+ Clinics</div>
              <div className="text-lg font-semibold text-foreground transition-all duration-300 hover:opacity-100 hover:scale-105">1M+ Patients</div>
              <div className="text-lg font-semibold text-foreground transition-all duration-300 hover:opacity-100 hover:scale-105">99.9% Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;