import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white p-6 shadow-soft relative overflow-hidden">
      {/* Shooting Star Animation */}
      <div className="absolute top-4 left-0 w-full h-full pointer-events-none">
        <div className="animate-[shootingStar_4s_ease-in-out_infinite] absolute top-1/2 -left-16 transform -translate-y-1/2">
          <div className="relative">
            <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg"></div>
            <div className="absolute top-0 left-0 w-16 h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-transparent opacity-80 -translate-y-0.5"></div>
            <div className="absolute top-0 left-2 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
            <div className="absolute top-1 left-4 w-0.5 h-0.5 bg-yellow-200 rounded-full animate-pulse delay-75"></div>
            <div className="absolute -top-1 left-6 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center relative z-10">
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