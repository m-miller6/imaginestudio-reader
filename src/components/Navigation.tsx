import { Library, PlusCircle, Home, Compass } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Hide desktop navigation on mobile (mobile nav is handled separately)
  if (isMobile) return null;

  return (
    <nav className="w-full bg-card/95 backdrop-blur-sm border-y-2 border-border py-4">
      <div className="max-w-4xl mx-auto flex justify-center items-center gap-6 md:gap-8 px-6">
        <Link to="/">
          <Button 
            variant="ghost" 
            size="lg" 
            className={`flex items-center gap-2 h-12 px-6 touch-target ${location.pathname === "/" ? "squiggly-underline" : ""}`}
          >
            <Home className="h-5 w-5" />
            <span className="hidden md:inline">Home</span>
          </Button>
        </Link>
        
        <Link to="/explore">
          <Button 
            variant="ghost" 
            size="lg" 
            className={`flex items-center gap-2 h-12 px-6 touch-target ${location.pathname === "/explore" ? "squiggly-underline" : ""}`}
          >
            <Compass className="h-5 w-5" />
            <span className="hidden md:inline">Explore</span>
          </Button>
        </Link>
        
        <Link to="/library">
          <Button 
            variant="ghost" 
            size="lg" 
            className={`flex items-center gap-2 h-12 px-6 touch-target ${location.pathname === "/library" ? "squiggly-underline" : ""}`}
          >
            <Library className="h-5 w-5" />
            <span className="hidden md:inline">Library</span>
          </Button>
        </Link>
        
        <Link to="/create-character">
          <Button 
            variant="adventure" 
            size="lg" 
            className="flex items-center gap-2 font-playful h-12 px-8 touch-target"
          >
            <PlusCircle className="h-6 w-6" />
            Create
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;