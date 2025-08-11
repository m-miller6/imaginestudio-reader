import { Library, PlusCircle, Home, Compass } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const navItems = [
    {
      to: "/",
      icon: Home,
      label: "Home",
      isActive: location.pathname === "/"
    },
    {
      to: "/explore", 
      icon: Compass,
      label: "Explore",
      isActive: location.pathname === "/explore"
    },
    {
      to: "/library",
      icon: Library, 
      label: "Library",
      isActive: location.pathname === "/library"
    },
    {
      to: "/create-character",
      icon: PlusCircle,
      label: "Create",
      isActive: location.pathname === "/create-character"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t-2 border-border safe-area-bottom">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className="flex-1">
              <Button
                variant={item.isActive ? "default" : "ghost"}
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-1 w-full touch-target tap-highlight-none"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;