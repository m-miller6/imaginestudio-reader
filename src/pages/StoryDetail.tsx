import { Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import neverlandCover from "@/assets/trip-to-neverland-cover.jpg";
import christmasCover from "@/assets/odyssey-first-christmas-cover.jpg";

const StoryDetail = () => {
  const { storyId } = useParams();

  const storyData = {
    neverland: {
      title: "Trip to NeverLand",
      image: neverlandCover,
      description: "Join our hero on an incredible journey to the magical land of NeverLand, where dreams come true and adventures never end!"
    },
    christmas: {
      title: "Odyssey First Christmas",
      image: christmasCover,
      description: "Experience the wonder and magic of Christmas through the eyes of our young hero in this heartwarming holiday adventure!"
    }
  };

  const story = storyData[storyId as keyof typeof storyData];

  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-4xl font-headline font-bold mb-4 text-primary">Story Not Found</h1>
            <p className="text-xl font-playful text-muted-foreground mb-4">The story you're looking for doesn't exist.</p>
            <Link to="/library" className="text-primary hover:text-primary/80 underline font-playful">
              Return to Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-headline font-bold text-primary mb-4">
              {story.title}
            </h2>
            <div className="max-w-2xl mx-auto">
              <img 
                src={story.image}
                alt={story.title}
                className="w-full rounded-xl shadow-magical"
              />
              <div className="mt-6 p-6 bg-card rounded-xl border-2 border-border">
                <p className="font-playful text-lg text-foreground leading-relaxed">
                  {story.description}
                </p>
                <Link to="/story-reader" className="block mt-4">
                  <Button variant="whimsical" size="lg" className="font-playful">
                    <Play className="h-5 w-5 mr-2" />
                    Start Adventure
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryDetail;