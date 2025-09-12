import { Link, useLocation } from "react-router-dom";
import { User, LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import talesOfYouLogo from "@/assets/tales-of-you-transparent.png";

const Header = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile, signIn, signOut } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      setEmail("");
      setPassword("");
      setIsDialogOpen(false);
    }
    
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <header className="bg-white p-6 shadow-soft relative overflow-hidden">
      {/* Magic Wand and Star Trail */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        {/* Wand Handle */}
        <div className="wand-handle"></div>
        
        {/* Main Star */}
        <div className="main-star">
          <div className="star-shape"></div>
        </div>
        
        {/* Star Trail */}
        <div className="star-trail">
          <div className="trail-star trail-star-1"></div>
          <div className="trail-star trail-star-2"></div>
          <div className="trail-star trail-star-3"></div>
          <div className="trail-star trail-star-4"></div>
          <div className="trail-star trail-star-5"></div>
          <div className="trail-sparkle trail-sparkle-1"></div>
          <div className="trail-sparkle trail-sparkle-2"></div>
          <div className="trail-sparkle trail-sparkle-3"></div>
          <div className="trail-sparkle trail-sparkle-4"></div>
        </div>
      </div>

      <div className="flex justify-between items-center relative z-20">
        <div className="flex-1" />
        
        <Link to="/" className="flex-1 flex justify-center">
          <img 
            src={talesOfYouLogo} 
            alt="Tales of You" 
            className="h-24 md:h-28 w-auto relative z-10 transform scale-125"
          />
        </Link>
        
        <div className="flex-1 flex justify-end items-center gap-3">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center gap-2 text-foreground hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
              
              <Link to="/profile">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">
                    {profile?.first_name || "Profile"}
                  </span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 text-foreground hover:bg-muted"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden md:inline">Log In</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] sm:min-h-[500px]">
                  <DialogHeader className="text-center">
                    <div className="mb-6">
                      <p className="text-lg font-playful text-foreground mb-2 text-center">
                        Welcome back to
                      </p>
                      <div className="flex flex-col items-center">
                        <img 
                          src={talesOfYouLogo} 
                          alt="Tales of You" 
                          className="h-16 w-auto transform scale-110"
                        />
                      </div>
                    </div>
                  </DialogHeader>
                  <form onSubmit={handleSignIn}>
                    <div className="grid gap-6 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Log In"}
                      </Button>
                      <div className="text-center">
                        <Link to="/signup" className="text-sm text-primary hover:underline">
                          New Adventurer? Create an account now!
                        </Link>
                      </div>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              
              <Link to="/signup">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Sign Up</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;