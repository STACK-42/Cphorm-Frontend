import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface MobileNavigationProps {
  navigationItems: Array<{
    label: string;
    href: string;
    variant?: "default" | "outline";
  }>;
}

export function MobileNavigation({ navigationItems }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden transition-all duration-300 hover:scale-105">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMenu}
              className="h-6 w-6 transition-all duration-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="flex flex-col space-y-4">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                onClick={closeMenu}
                className="block"
              >
                {item.variant === "outline" ? (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start transition-all duration-300 hover:scale-105"
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-base font-medium transition-all duration-300 hover:scale-105"
                  >
                    {item.label}
                  </Button>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}