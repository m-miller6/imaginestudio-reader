import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Explore from "./pages/Explore";
import CharacterCreation from "./pages/CharacterCreation";
import StoryReader from "./pages/StoryReader";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import StoryDetail from "./pages/StoryDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create-character" element={<CharacterCreation />} />
          <Route path="/story-reader" element={<StoryReader />} />
          <Route path="/library" element={<Library />} />
          <Route path="/story/:storyId" element={<StoryDetail />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
