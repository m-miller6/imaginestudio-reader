import { Library, PlusCircle, Home, Compass } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="w-full bg-card/95 backdrop-blur-sm border-y-2 border-border py-4">
      <div className="max-w-4xl mx-auto flex justify-center items-center gap-6 md:gap-8 px-6">
        <Link to="/">
          <Button 
            variant={location.pathname === "/" ? "default" : "ghost"} 
            size="lg" 
            className="flex items-center gap-2 h-12 px-6"
          >
            <Home className="h-5 w-5" />
            <span className="hidden md:inline">Home</span>
          </Button>
        </Link>
        
        <Link to="/explore">
          <Button 
            variant={location.pathname === "/explore" ? "default" : "ghost"} 
            size="lg" 
            className="flex items-center gap-2 h-12 px-6"
          >
            <Compass className="h-5 w-5" />
            <span className="hidden md:inline">Explore</span>
          </Button>
        </Link>
        
        <Link to="/library">
          <Button 
            variant={location.pathname === "/library" ? "default" : "ghost"} 
            size="lg" 
            className="flex items-center gap-2 h-12 px-6"
          >
            <Library className="h-5 w-5" />
            <span className="hidden md:inline">Library</span>
          </Button>
        </Link>
        
        <Link to="/create-character">
          <Button 
            variant="adventure" 
            size="lg" 
            className="flex items-center gap-2 font-playful h-12 px-8"
          >
            <PlusCircle className="h-6 w-6" />
            Add Stories
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;