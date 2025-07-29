const Footer = () => {
  return (
    <footer className="bg-muted/30 dark:bg-muted/10 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-fade-in-up">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-foreground mb-4">Cphorm</h3>
            <p className="text-muted-foreground mb-4 max-w-md leading-relaxed">
              Revolutionizing healthcare with AI-driven medical systems that empower 
              healthcare providers and improve patient outcomes.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground transition-colors duration-300">
            &copy; 2025 Cphorm. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;