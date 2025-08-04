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
    { title: "Ocean Adventure", category: "suggested", progress: 0, image: neverlandCover, description: "Dive deep into the blue seas" },
    { title: "Space Explorer", category: "continue", progress: 35, image: christmasCover, description: "Journey through the cosmos" },
    { title: "Forest Friends", category: "new", progress: 0, image: neverlandCover, description: "Meet woodland creatures" },
    { title: "Princess Castle", category: "suggested", progress: 0, image: christmasCover, description: "Royal adventures await" },
    { title: "Dinosaur Discovery", category: "continue", progress: 60, image: neverlandCover, description: "Prehistoric adventures" },
    { title: "Magic Garden", category: "new", progress: 0, image: christmasCover, description: "Enchanted plant kingdom" },
    { title: "Pirate Treasure", category: "suggested", progress: 0, image: neverlandCover, description: "Hunt for buried gold" },
    { title: "Fairy Kingdom", category: "continue", progress: 20, image: christmasCover, description: "Magical realm awaits" },
    { title: "Robot Friends", category: "new", progress: 0, image: neverlandCover, description: "Future technology adventures" },
    { title: "Dragon Valley", category: "continue", progress: 75, image: christmasCover, description: "Befriend mighty dragons" },
    { title: "Underwater City", category: "continue", progress: 45, image: neverlandCover, description: "Explore Atlantis mysteries" },
    { title: "Time Traveler", category: "continue", progress: 15, image: christmasCover, description: "Journey through time" },
    { title: "Jungle Explorer", category: "continue", progress: 80, image: neverlandCover, description: "Discover hidden temples" },
    { title: "Ice Kingdom", category: "continue", progress: 30, image: christmasCover, description: "Frozen wonderland adventure" },
    { title: "Superhero Academy", category: "new", progress: 0, image: neverlandCover, description: "Train your superpowers" },
    { title: "Alien Encounter", category: "new", progress: 0, image: christmasCover, description: "Meet friendly aliens" },
    { title: "Wizard School", category: "new", progress: 0, image: neverlandCover, description: "Learn magical spells" },
    { title: "Animal Rescue", category: "new", progress: 0, image: christmasCover, description: "Save endangered animals" },
    { title: "Mystery Mansion", category: "new", progress: 0, image: neverlandCover, description: "Solve spooky puzzles" },
    { title: "Sports Champion", category: "new", progress: 0, image: christmasCover, description: "Become a sports star" },
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
                
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {storyCategories
                      .filter(story => {
                        const categoryKey = category.toLowerCase().replace(/\s+/g, '');
                        if (categoryKey === 'suggested') return story.category === 'suggested';
                        if (categoryKey === 'continuereading') return story.category === 'continue';
                        if (categoryKey === 'newthisweek') return story.category === 'new';
                        return false;
                      })
                      .map((story, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                          <Link to="/create-character" className="block">
                            <Card className="card-magical bg-card border-2 border-border overflow-hidden">
                              <div className="aspect-video relative">
                                <img 
                                  src={story.image} 
                                  alt={story.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                  <h4 className="text-lg font-headline font-bold text-shadow-soft">
                                    {story.title}
                                  </h4>
                                  <p className="font-playful text-sm">{story.description}</p>
                                </div>
                              </div>
                              
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
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
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