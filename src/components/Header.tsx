import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-hero-gradient p-6 shadow-soft relative">
      <div className="flex justify-between items-center">
        <div className="flex-1" />
        
        <Link to="/" className="flex-1 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary-foreground text-shadow-soft">
            Imagine Studios
          </h1>
          <p className="text-lg md:text-xl font-playful text-primary-foreground/90 mt-2">
            imAgIne studios
          </p>
        </Link>
        
        <div className="flex-1 flex justify-end">
          <Link to="/profile">
            <Button 
              variant={location.pathname === "/profile" ? "default" : "ghost"} 
              size="sm" 
              className="flex items-center gap-2 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
            >
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;