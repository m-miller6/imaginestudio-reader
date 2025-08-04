import { BookOpen, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import neverlandCover from "@/assets/trip-to-neverland-cover.jpg";
import christmasCover from "@/assets/odyssey-first-christmas-cover.jpg";

const Library = () => {
  const savedStories = [
    {
      title: "Trip to NeverLand",
      image: neverlandCover,
      progress: 100,
      rating: 5,
      dateCompleted: "2024-01-15"
    },
    {
      title: "Odyssey First Christmas",
      image: christmasCover,
      progress: 65,
      rating: 0,
      dateCompleted: null
    },
    {
      title: "Ocean Adventure",
      image: neverlandCover,
      progress: 30,
      rating: 0,
      dateCompleted: null
    },
    {
      title: "Space Explorer",
      image: christmasCover,
      progress: 85,
      rating: 4,
      dateCompleted: null
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-headline font-bold text-primary mb-2">
              Your Story Library
            </h2>
            <p className="font-playful text-lg text-muted-foreground">
              All your magical adventures in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedStories.map((story, index) => (
              <Card key={index} className="card-magical shadow-soft border-2 border-border overflow-hidden">
                <CardHeader className="p-0">
                  <Link
                    to={story.title === "Trip to NeverLand" 
                      ? "/story/neverland" 
                      : story.title === "Odyssey First Christmas" 
                      ? "/story/christmas" 
                      : "/story-reader"
                    }
                  >
                    <div className="aspect-video relative cursor-pointer">
                      <img 
                        src={story.image} 
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-2 left-2 text-white">
                        <CardTitle className="text-lg font-headline font-bold text-shadow-soft">
                          {story.title}
                        </CardTitle>
                      </div>
                      
                      {story.progress === 100 && (
                        <div className="absolute top-2 right-2 bg-success-green text-white rounded-full p-2">
                          <BookOpen className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </Link>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-playful">Progress</span>
                        <span className="font-bold">{story.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${story.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Rating */}
                    {story.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < story.rating 
                                ? "fill-accent text-accent" 
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Link to="/story-reader" className="w-full">
                    <Button variant="outline" size="sm" className="w-full font-playful">
                      <Play className="h-4 w-4 mr-2" />
                      {story.progress === 100 ? "Read Again" : "Continue"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Add More Stories */}
          <div className="text-center pt-8">
            <Link to="/create-character">
              <Button variant="whimsical" size="lg" className="font-playful">
                <BookOpen className="h-5 w-5 mr-2" />
                Create New Adventure
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Library;