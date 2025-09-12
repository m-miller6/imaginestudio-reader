import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import MobileNavigation from "./components/MobileNavigation";
import Homepage from "./pages/Homepage";
import Explore from "./pages/Explore";
import CharacterCreation from "./pages/CharacterCreation";
import StoryReader from "./pages/StoryReader";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import StoryDetail from "./pages/StoryDetail";
import Signup from "./pages/Signup";
import MoonBalloonReader from "./pages/MoonBalloonReader";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen pb-safe mobile-scroll">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/create-character" element={<CharacterCreation />} />
              <Route path="/story-reader" element={<StoryReader />} />
              <Route path="/library" element={<Library />} />
              <Route path="/story/:storyId" element={<StoryDetail />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/moon-balloon" element={<MoonBalloonReader />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileNavigation />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
