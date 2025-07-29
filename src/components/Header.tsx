import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileNavigation } from "@/components/mobile-navigation";
import logo from "@/assets/logo.svg";

const Header = () => {
  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Explore Data", href: "/insights" },
    { label: "Login", href: "/login" },
    { label: "Sign Up", href: "/signup", variant: "outline" as const },
  ];

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-12 w-auto transition-transform duration-300 hover:scale-105" />
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/insights"
            className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
          >
            Explore Data
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/login"
            className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
          >
            Login
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105">
              Sign Up
            </Button>
          </Link>
          <ModeToggle />
        </nav>

        {/* Mobile menu and theme toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <ModeToggle />
          <MobileNavigation navigationItems={navigationItems} />
        </div>
      </div>
    </header>
  );
};

export default Header;
