import { Library, PlusCircle, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border p-4 md:static md:bg-transparent md:border-t-0 md:p-0">
      <div className="flex justify-center items-center gap-4 md:gap-6">
        <Link to="/">
          <Button 
            variant={location.pathname === "/" ? "default" : "ghost"} 
            size="sm" 
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">Home</span>
          </Button>
        </Link>
        
        <Link to="/library">
          <Button 
            variant={location.pathname === "/library" ? "default" : "ghost"} 
            size="sm" 
            className="flex items-center gap-2"
          >
            <Library className="h-4 w-4" />
            <span className="hidden md:inline">Library</span>
          </Button>
        </Link>
        
        <Link to="/create-character">
          <Button 
            variant="adventure" 
            size="lg" 
            className="flex items-center gap-2 font-playful"
          >
            <PlusCircle className="h-5 w-5" />
            Add Stories
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;