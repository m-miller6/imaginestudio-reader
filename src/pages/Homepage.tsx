import { Search, Filter, Star, BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import neverlandCover from "@/assets/trip-to-neverland-cover.jpg";
import christmasCover from "@/assets/odyssey-first-christmas-cover.jpg";

const Homepage = () => {
  const featuredBooks = [
    {
      title: "Trip to NeverLand",
      image: neverlandCover,
      description: "A magical adventure awaits!"
    },
    {
      title: "Odyssey First Christmas",
      image: christmasCover,
      description: "A heartwarming holiday tale"
    },
    {
      title: "Space Explorer",
      image: neverlandCover,
      description: "Journey to distant galaxies"
    },
    {
      title: "Princess Castle",
      image: christmasCover,
      description: "Royal adventures await"
    },
    {
      title: "Ocean Adventure",
      image: neverlandCover,
      description: "Dive into underwater mysteries"
    }
  ];

  const storyCategories = [
    { title: "Ocean Adventure", category: "suggested", progress: 0 },
    { title: "Space Explorer", category: "continue", progress: 35 },
    { title: "Forest Friends", category: "new", progress: 0 },
    { title: "Princess Castle", category: "suggested", progress: 0 },
    { title: "Dinosaur Discovery", category: "continue", progress: 60 },
    { title: "Magic Garden", category: "new", progress: 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Featured Books */}
      <section className="p-6 bg-hero-gradient">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-center text-primary-foreground mb-8">
            Featured Adventures
          </h2>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredBooks.map((book, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Link to="/create-character" className="block">
                    <Card className="card-magical bg-card/95 backdrop-blur-sm border-2 border-white/20 overflow-hidden">
                      <div className="aspect-video relative">
                        <img 
                          src={book.image} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-headline font-bold text-shadow-soft">
                            {book.title}
                          </h3>
                          <p className="font-playful text-sm">{book.description}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="font-playful">
                <Star className="h-4 w-4 mr-1" />
                Top 10
              </Button>
              <Button variant="outline" size="sm" className="font-playful">
                <Sparkles className="h-4 w-4 mr-1" />
                Interactive
              </Button>
              <Button variant="outline" size="sm" className="font-playful">
                <BookOpen className="h-4 w-4 mr-1" />
                Educational
              </Button>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search stories..."
                className="pl-10 rounded-xl border-2 border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Story Categories */}
          <div className="space-y-8">
            {["Suggested", "Continue Reading", "New this Week"].map((category) => (
              <div key={category}>
                <h3 className="text-xl font-headline font-bold mb-4 text-foreground">
                  {category}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {storyCategories
                    .filter(story => story.category === category.toLowerCase().replace(' ', '').replace(' ', ''))
                    .map((story, index) => (
                      <Link key={index} to="/create-character">
                        <Card className="card-magical bg-card border-2 border-border overflow-hidden">
                          <CardContent className="p-0">
                            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <div className="text-center p-4">
                                <BookOpen className="h-12 w-12 mx-auto mb-2 text-primary" />
                                <h4 className="font-headline font-bold text-lg">{story.title}</h4>
                              </div>
                            </div>
                          </CardContent>
                          
                          {story.progress > 0 && (
                            <CardFooter className="p-4">
                              <div className="w-full">
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
                            </CardFooter>
                          )}
                        </Card>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Navigation />
    </div>
  );
};

export default Homepage;