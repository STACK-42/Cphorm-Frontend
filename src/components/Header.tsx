import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { X, Menu } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            to="/insights"
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Explore Data
          </Link>
          <Link
            to="/login"
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Login
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="sm">
              Sign Up
            </Button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium py-2"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/insights"
              className="text-foreground hover:text-primary transition-colors font-medium py-2"
              onClick={closeMobileMenu}
            >
              Explore Data
            </Link>
            <Link
              to="/login"
              className="text-foreground hover:text-primary transition-colors font-medium py-2"
              onClick={closeMobileMenu}
            >
              Login
            </Link>
            <Link to="/signup" onClick={closeMobileMenu}>
              <Button variant="outline" size="sm" className="w-full">
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
