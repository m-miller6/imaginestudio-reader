import { useState } from "react";
import { ChevronLeft, ChevronRight, BookmarkPlus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { PageFlipBook } from "@/components/PageFlipBook";
import { TurnFlipBook } from "@/components/TurnFlipBook";
import { useIsMobile } from "@/hooks/use-mobile";
import heroIllustration from "@/assets/story-hero-illustration.jpg";

const StoryReader = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const isMobile = useIsMobile();

  const storyPages = [
    {
      text: "Once upon a time, in a land far far away, a cry for help rang out and shook the forest trees. The brave hero knew this was the beginning of an incredible adventure.",
      illustration: heroIllustration
    },
    {
      text: "Through the enchanted forest they traveled, meeting magical creatures who shared ancient secrets and wisdom. Each step brought new wonders and discoveries.",
      illustration: heroIllustration
    },
    {
      text: "At the heart of the forest stood a magnificent castle, its towers reaching toward the stars. This was where the greatest challenge awaited our brave hero.",
      illustration: heroIllustration
    }
  ];

  const totalPages = storyPages.length;

  const handlePageChange = (page: number) => {
    if (page > totalPages) {
      setShowEndModal(true);
    } else {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      setShowEndModal(true);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEndChoice = (choice: string) => {
    if (choice === "yes") {
      setShowEndModal(false);
      setShowSubscriptionModal(true);
    } else {
      setShowEndModal(false);
      // Navigate back to homepage
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className={`flex-1 p-4 md:p-6 ${isMobile ? 'pb-20' : ''}`}>
        <div className="max-w-6xl mx-auto">
          {/* Mobile Progress Bar */}
          {isMobile && (
            <div className="mb-4">
              <div className="bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-out"
                  style={{ width: `${(currentPage / totalPages) * 100}%` }}
                />
              </div>
              <p className="text-center text-sm font-playful text-muted-foreground mt-2">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          )}

          {/* Desktop Page Navigation */}
          {!isMobile && (
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="shadow-soft touch-target"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="text-center">
                <p className="font-playful text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                className="shadow-soft touch-target"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Interactive Page Flip Book (turn.js) */}
          <div className="mb-8">
            <TurnFlipBook 
              pages={storyPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              className="no-select"
            />
            
            {/* Mobile Hint */}
            {isMobile && currentPage === 1 && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground text-center font-playful">
                  📖 Tap edges to flip or swipe left/right to turn pages
                </p>
              </div>
            )}
          </div>

          {/* Save Story Button */}
          <div className="text-center">
            <Button 
              variant="secondary" 
              size={isMobile ? "default" : "lg"} 
              className={`font-playful touch-target ${isMobile ? 'w-full' : ''}`}
            >
              <BookmarkPlus className="h-5 w-5 mr-2" />
              Save Story to Library
            </Button>
          </div>
        </div>
      </main>

      {/* End of Story Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-8 bg-card shadow-magical border-2 border-primary">
            <div className="text-center space-y-6">
              <div className="text-6xl animate-bounce-gentle">🎉</div>
              <h3 className="text-2xl font-headline font-bold text-primary">
                Great Work!
              </h3>
              <p className="font-playful text-lg text-foreground">
                Would you like to go on another adventure?
              </p>
              
              <div className="flex gap-4">
                <Button 
                  variant="whimsical" 
                  size="lg" 
                  className="flex-1 font-playful"
                  onClick={() => handleEndChoice("yes")}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Yes!
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 font-playful"
                  onClick={() => handleEndChoice("no")}
                >
                  No
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-8 bg-card shadow-magical border-2 border-primary">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-headline font-bold text-primary">
                Save Hero's Adventures to library, unlock new stories every week, and so much more!
              </h3>
              
              <div className="space-y-4">
                <Card className="p-4 border-2 border-primary bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-playful font-bold">Monthly Plan</span>
                    <span className="text-2xl font-headline font-bold text-primary">$47/month</span>
                  </div>
                </Card>
                
                <Card className="p-4 border-2 border-accent bg-accent/5 cursor-pointer hover:bg-accent/10 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-playful font-bold">Yearly Plan</span>
                      <div className="text-sm text-success-green font-semibold">Save 25%!</div>
                    </div>
                    <span className="text-2xl font-headline font-bold text-accent-foreground">$423/year</span>
                  </div>
                </Card>
              </div>
              
              <Button 
                variant="whimsical" 
                size="xl" 
                className="w-full font-playful"
                onClick={() => setShowSubscriptionModal(false)}
              >
                Save Adventures & Subscribe
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => setShowSubscriptionModal(false)}
                className="font-playful"
              >
                Maybe later
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StoryReader;