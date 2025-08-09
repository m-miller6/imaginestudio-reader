import { Link, useLocation } from "react-router-dom";
import { User, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
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
        
        <Link to="/" className="flex-1 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-black relative z-10">
            <span className="text-black">im</span>
            <span className="text-yellow-500">A</span>
            <span className="text-black">g</span>
            <span className="text-yellow-500">I</span>
            <span className="text-black">ne</span>
          </h1>
          <p className="text-lg md:text-xl font-playful text-black mt-1 relative z-10">
            Studios
          </p>
        </Link>
        
        <div className="flex-1 flex justify-end items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 text-black hover:bg-gray-100"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden md:inline">Log In</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] sm:min-h-[500px]">
              <DialogHeader className="text-center">
                <div className="mb-6">
                  <p className="text-lg font-playful text-muted-foreground mb-2">
                    Welcome back to
                  </p>
                  <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-headline font-bold text-black">
                      <span className="text-black">im</span>
                      <span className="text-yellow-500">A</span>
                      <span className="text-black">g</span>
                      <span className="text-yellow-500">I</span>
                      <span className="text-black">ne</span>
                    </h1>
                    <p className="text-lg font-playful text-black">
                      Studios
                    </p>
                  </div>
                </div>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  />
                </div>
                <Button type="submit" className="w-full">
                  Log In
                </Button>
                <div className="text-center">
                  <Link to="/signup" className="text-sm text-primary hover:underline">
                    New Adventurer? Create an account now!
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
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