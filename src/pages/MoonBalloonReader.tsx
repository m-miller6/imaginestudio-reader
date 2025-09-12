import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { TurnFlipBook } from "@/components/TurnFlipBook";
import { moonBalloonPages } from "@/data/moonBalloonStory";

export default function MoonBalloonReader() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = moonBalloonPages.length;

  const handlePageChange = (page: number) => {
    if (page > totalPages) {
      // Story completed
      console.log("Story completed!");
      return;
    }
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <Navigation />
      
      {/* Mobile Progress Bar */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b px-4 py-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>The Moon Balloon</span>
          <span>{currentPage} of {totalPages}</span>
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="bg-gray-200 rounded-full h-2 w-48">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              />
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Story Book */}
        <div className="max-w-6xl mx-auto">
          <TurnFlipBook
            pages={moonBalloonPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            className="mx-auto"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Save Story to Library
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
            <BookOpen className="h-4 w-4" />
            Explore More Stories
          </Button>
        </div>
      </main>
    </div>
  );
}