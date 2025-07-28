import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";

const Header = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </div>

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
        <Button variant="ghost" size="sm" className="md:hidden">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default Header;
