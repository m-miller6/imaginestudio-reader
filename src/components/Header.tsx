import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white p-6 shadow-soft relative">
      <div className="flex justify-between items-center">
        <div className="flex-1" />
        
        <Link to="/" className="flex-1 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-black">
            <span className="text-black">im</span>
            <span className="text-yellow-500">A</span>
            <span className="text-black">g</span>
            <span className="text-yellow-500">I</span>
            <span className="text-black">ne</span>
          </h1>
          <p className="text-lg md:text-xl font-playful text-black mt-1">
            Studios
          </p>
        </Link>
        
        <div className="flex-1 flex justify-end">
          <Link to="/profile">
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-2"
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