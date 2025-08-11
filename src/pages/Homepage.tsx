import { Search, Filter, Star, BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import neverlandCover from "@/assets/trip-to-neverland-cover.jpg";
import christmasCover from "@/assets/odyssey-first-christmas-cover.jpg";
import spaceExplorerCover from "@/assets/space-explorer-cover.jpg";
import princessCastleCover from "@/assets/princess-castle-cover.jpg";
import oceanAdventureCover from "@/assets/ocean-adventure-cover.jpg";
import forestFriendsCover from "@/assets/forest-friends-cover.jpg";
import dinosaurDiscoveryCover from "@/assets/dinosaur-discovery-cover.jpg";
import magicGardenCover from "@/assets/magic-garden-cover.jpg";
import pirateTreasureCover from "@/assets/pirate-treasure-cover.jpg";
import fairyKingdomCover from "@/assets/fairy-kingdom-cover.jpg";
import robotFriendsCover from "@/assets/robot-friends-cover.jpg";
import dragonValleyCover from "@/assets/dragon-valley-cover.jpg";
import underwaterCityCover from "@/assets/underwater-city-cover.jpg";
import timeTravelerCover from "@/assets/time-traveler-cover.jpg";
import jungleExplorerCover from "@/assets/jungle-explorer-cover.jpg";
import iceKingdomCover from "@/assets/ice-kingdom-cover.jpg";
import superheroAcademyCover from "@/assets/superhero-academy-cover.jpg";
import alienEncounterCover from "@/assets/alien-encounter-cover.jpg";
import wizardSchoolCover from "@/assets/wizard-school-cover.jpg";
import animalRescueCover from "@/assets/animal-rescue-cover.jpg";
import mysteryMansionCover from "@/assets/mystery-mansion-cover.jpg";
import sportsChampionCover from "@/assets/sports-champion-cover.jpg";

const Homepage = () => {
  const [showTopTen, setShowTopTen] = useState(false);
  const [showInteractive, setShowInteractive] = useState(false);
  const [showEducational, setShowEducational] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

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
      image: spaceExplorerCover,
      description: "Journey to distant galaxies"
    },
    {
      title: "Princess Castle",
      image: princessCastleCover,
      description: "Royal adventures await"
    },
    {
      title: "Ocean Adventure",
      image: oceanAdventureCover,
      description: "Dive into underwater mysteries"
    }
  ];

  const storyCategories = [
    { title: "Ocean Adventure", category: "suggested", progress: 0, image: oceanAdventureCover, description: "Dive deep into the blue seas", ranking: 3, interactive: true, genre: "Adventure", educational: true, subject: "Science" },
    { title: "Space Explorer", category: "continue", progress: 35, image: spaceExplorerCover, description: "Journey through the cosmos", ranking: 1, interactive: true, genre: "Sci-Fi", educational: true, subject: "Science" },
    { title: "Forest Friends", category: "new", progress: 0, image: forestFriendsCover, description: "Meet woodland creatures", ranking: 7, interactive: false, genre: "Nature", educational: false, subject: null },
    { title: "Princess Castle", category: "suggested", progress: 0, image: princessCastleCover, description: "Royal adventures await", ranking: 4, interactive: true, genre: "Fantasy", educational: true, subject: "History" },
    { title: "Dinosaur Discovery", category: "continue", progress: 60, image: dinosaurDiscoveryCover, description: "Prehistoric adventures", ranking: 2, interactive: true, genre: "Adventure", educational: true, subject: "Science" },
    { title: "Magic Garden", category: "new", progress: 0, image: magicGardenCover, description: "Enchanted plant kingdom", ranking: 8, interactive: true, genre: "Fantasy", educational: true, subject: "Science" },
    { title: "Pirate Treasure", category: "suggested", progress: 0, image: pirateTreasureCover, description: "Hunt for buried gold", ranking: 5, interactive: true, genre: "Adventure", educational: true, subject: "History" },
    { title: "Fairy Kingdom", category: "continue", progress: 20, image: fairyKingdomCover, description: "Magical realm awaits", ranking: 9, interactive: true, genre: "Fantasy", educational: false, subject: null },
    { title: "Robot Friends", category: "new", progress: 0, image: robotFriendsCover, description: "Future technology adventures", ranking: 6, interactive: true, genre: "Sci-Fi", educational: true, subject: "Technology" },
    { title: "Dragon Valley", category: "continue", progress: 75, image: dragonValleyCover, description: "Befriend mighty dragons", ranking: 10, interactive: false, genre: "Fantasy", educational: false, subject: null },
    { title: "Underwater City", category: "continue", progress: 45, image: underwaterCityCover, description: "Explore Atlantis mysteries", interactive: true, genre: "Adventure", educational: true, subject: "History" },
    { title: "Time Traveler", category: "continue", progress: 15, image: timeTravelerCover, description: "Journey through time", interactive: true, genre: "Sci-Fi", educational: true, subject: "History" },
    { title: "Jungle Explorer", category: "continue", progress: 80, image: jungleExplorerCover, description: "Discover hidden temples", interactive: false, genre: "Adventure", educational: true, subject: "Geography" },
    { title: "Ice Kingdom", category: "continue", progress: 30, image: iceKingdomCover, description: "Frozen wonderland adventure", interactive: true, genre: "Fantasy", educational: true, subject: "Science" },
    { title: "Superhero Academy", category: "new", progress: 0, image: superheroAcademyCover, description: "Train your superpowers", interactive: true, genre: "Action", educational: true, subject: "Math" },
    { title: "Alien Encounter", category: "new", progress: 0, image: alienEncounterCover, description: "Meet friendly aliens", interactive: false, genre: "Sci-Fi", educational: true, subject: "Science" },
    { title: "Wizard School", category: "new", progress: 0, image: wizardSchoolCover, description: "Learn magical spells", interactive: true, genre: "Fantasy", educational: true, subject: "Math" },
    { title: "Animal Rescue", category: "new", progress: 0, image: animalRescueCover, description: "Save endangered animals", interactive: false, genre: "Nature", educational: true, subject: "Science" },
    { title: "Mystery Mansion", category: "new", progress: 0, image: mysteryMansionCover, description: "Solve spooky puzzles", interactive: true, genre: "Mystery", educational: true, subject: "Math" },
    { title: "Sports Champion", category: "new", progress: 0, image: sportsChampionCover, description: "Become a sports star", interactive: false, genre: "Sports", educational: true, subject: "Health" },
  ];

  const getFilteredStories = (category: string) => {
    const filtered = storyCategories.filter(story => {
      const categoryKey = category.toLowerCase().replace(/\s+/g, '');
      const matchesSearch = searchQuery === "" || 
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.genre.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (categoryKey === 'suggested') return story.category === 'suggested' && matchesSearch;
      if (categoryKey === 'continuereading') return story.category === 'continue' && matchesSearch;
      if (categoryKey === 'newthisweek') return story.category === 'new' && matchesSearch;
      return false;
    });

    return filtered;
  };

  const getTopTenStories = () => {
    return storyCategories
      .filter(story => {
        const matchesSearch = searchQuery === "" || 
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.genre.toLowerCase().includes(searchQuery.toLowerCase());
        return story.ranking && story.ranking <= 10 && matchesSearch;
      })
      .sort((a, b) => (a.ranking || 999) - (b.ranking || 999));
  };

  const getInteractiveStoriesByGenre = () => {
    const interactiveStories = storyCategories.filter(story => {
      const matchesSearch = searchQuery === "" || 
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.genre.toLowerCase().includes(searchQuery.toLowerCase());
      return story.interactive && matchesSearch;
    });
    const genres = [...new Set(interactiveStories.map(story => story.genre))];
    
    return genres.map(genre => ({
      genre,
      stories: interactiveStories.filter(story => story.genre === genre)
    })).filter(genreGroup => genreGroup.stories.length > 0);
  };

  const getEducationalStoriesBySubject = () => {
    const educationalStories = storyCategories.filter(story => {
      const matchesSearch = searchQuery === "" || 
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (story.subject && story.subject.toLowerCase().includes(searchQuery.toLowerCase()));
      return story.educational && matchesSearch;
    });
    const subjects = [...new Set(educationalStories.map(story => story.subject).filter(Boolean))];
    
    return subjects.map(subject => ({
      subject,
      stories: educationalStories.filter(story => story.subject === subject)
    })).filter(subjectGroup => subjectGroup.stories.length > 0);
  };

  return (
    <div className={`min-h-screen bg-background ${isMobile ? 'pb-20' : ''}`}>
      <Header />
      <Navigation />
      
      {/* Hero Section with Featured Books */}
      <section className={`${isMobile ? 'p-4' : 'p-6'} bg-hero-gradient`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-headline font-bold text-center text-primary-foreground mb-6`}>
            Featured Adventures
          </h2>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredBooks.map((book, index) => (
                <CarouselItem key={index} className={`pl-2 md:pl-4 ${isMobile ? 'basis-4/5' : 'md:basis-1/2 lg:basis-1/3'}`}>
                  <Link 
                    to={book.title === "Trip to NeverLand" 
                      ? "/story/neverland" 
                      : book.title === "Odyssey First Christmas" 
                      ? "/story/christmas" 
                      : "/create-character"
                    } 
                    className="block tap-highlight-none"
                  >
                    <Card className="card-magical bg-card/95 backdrop-blur-sm border-2 border-white/20 overflow-hidden touch-target">
                      <div className={`${isMobile ? 'aspect-[4/3]' : 'aspect-video'} relative`}>
                        <img 
                          src={book.image} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-headline font-bold text-shadow-soft`}>
                            {book.title}
                          </h3>
                          <p className={`font-playful ${isMobile ? 'text-xs' : 'text-sm'}`}>{book.description}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            {!isMobile && (
              <>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </>
            )}
          </Carousel>
        </div>
      </section>

      {/* Filters and Search */}
      <section className={`${isMobile ? 'p-4' : 'p-6'} mobile-scroll`}>
        <div className="max-w-6xl mx-auto">
          <div className={`${isMobile ? 'space-y-4' : 'flex flex-col md:flex-row gap-4 items-center justify-between'} mb-6`}>
            <div className={`flex ${isMobile ? 'overflow-x-auto mobile-scroll' : 'flex-wrap'} gap-2 ${isMobile ? 'pb-2' : ''}`}>
              <Button 
                variant={showTopTen ? "default" : "outline"} 
                size={isMobile ? "sm" : "sm"} 
                className={`font-playful touch-target ${isMobile ? 'flex-shrink-0' : ''}`}
                onClick={() => {
                  setShowTopTen(!showTopTen);
                  setShowInteractive(false);
                  setShowEducational(false);
                }}
              >
                <Star className="h-4 w-4 mr-1" />
                Top 10
              </Button>
              <Button 
                variant={showInteractive ? "default" : "outline"} 
                size={isMobile ? "sm" : "sm"} 
                className={`font-playful touch-target ${isMobile ? 'flex-shrink-0' : ''}`}
                onClick={() => {
                  setShowInteractive(!showInteractive);
                  setShowTopTen(false);
                  setShowEducational(false);
                }}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Interactive
              </Button>
              <Button 
                variant={showEducational ? "default" : "outline"} 
                size={isMobile ? "sm" : "sm"} 
                className={`font-playful touch-target ${isMobile ? 'flex-shrink-0' : ''}`}
                onClick={() => {
                  setShowEducational(!showEducational);
                  setShowTopTen(false);
                  setShowInteractive(false);
                }}
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Educational
              </Button>
            </div>
            
            <div className={`relative ${isMobile ? 'w-full' : 'w-full md:w-80'}`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 rounded-xl border-2 border-border focus:border-primary touch-target ${isMobile ? 'text-base' : ''}`}
                inputMode="search"
              />
            </div>
          </div>

          {/* Story Categories, Top 10, or Interactive */}
          {showTopTen ? (
            <div>
              <h3 className="text-xl font-headline font-bold mb-4 text-foreground">
                Top 10 Stories
              </h3>
              
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'}`}>
                 {getTopTenStories().map((story, index) => (
                   <Link 
                     key={index} 
                     to={`/story/${story.title.toLowerCase().replace(/\s+/g, '-')}`}
                     className="block tap-highlight-none"
                   >
                    <Card className="card-magical bg-card border-2 border-border overflow-hidden touch-target">
                      <div className={`${isMobile ? 'aspect-[4/3]' : 'aspect-video'} relative`}>
                        <img 
                          src={story.image} 
                          alt={story.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <Badge className={`absolute top-2 right-2 bg-primary text-primary-foreground font-bold ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1'}`}>
                          #{story.ranking}
                        </Badge>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h4 className={`${isMobile ? 'text-base' : 'text-lg'} font-headline font-bold text-shadow-soft`}>
                            {story.title}
                          </h4>
                          <p className={`font-playful ${isMobile ? 'text-xs' : 'text-sm'}`}>{story.description}</p>
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
                ))}
              </div>
            </div>
          ) : showInteractive ? (
            <div className="space-y-8">
              {getInteractiveStoriesByGenre().map((genreGroup) => (
                <div key={genreGroup.genre}>
                  <h3 className="text-xl font-headline font-bold mb-4 text-foreground">
                    {genreGroup.genre}
                  </h3>
                  
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {genreGroup.stories.map((story, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                           <Link 
                             to={`/story/${story.title.toLowerCase().replace(/\s+/g, '-')}`}
                             className="block"
                           >
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
          ) : showEducational ? (
            <div className="space-y-8">
              {getEducationalStoriesBySubject().map((subjectGroup) => (
                <div key={subjectGroup.subject}>
                  <h3 className="text-xl font-headline font-bold mb-4 text-foreground">
                    {subjectGroup.subject}
                  </h3>
                  
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {subjectGroup.stories.map((story, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                           <Link 
                             to={`/story/${story.title.toLowerCase().replace(/\s+/g, '-')}`}
                             className="block"
                           >
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
          ) : (
            <div className="space-y-8">
              {["Suggested", "Continue Reading", "New this Week"].map((category) => (
                <div key={category}>
                  <h3 className="text-xl font-headline font-bold mb-4 text-foreground">
                    {category}
                  </h3>
                  
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {getFilteredStories(category).map((story, index) => (
                          <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                             <Link 
                               to={`/story/${story.title.toLowerCase().replace(/\s+/g, '-')}`}
                               className="block"
                             >
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
          )}
        </div>
      </section>

    </div>
  );
};

export default Homepage;