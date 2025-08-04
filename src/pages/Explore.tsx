import { useState } from "react";
import { Search, Filter, MapPin, Clock, Star } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Import story covers
import dragonValleyCover from "@/assets/dragon-valley-cover.jpg";
import fairyKingdomCover from "@/assets/fairy-kingdom-cover.jpg";
import spaceExplorerCover from "@/assets/space-explorer-cover.jpg";
import princessCastleCover from "@/assets/princess-castle-cover.jpg";
import pirateTreasureCover from "@/assets/pirate-treasure-cover.jpg";
import wizardSchoolCover from "@/assets/wizard-school-cover.jpg";
import oceanAdventureCover from "@/assets/ocean-adventure-cover.jpg";
import forestFriendsCover from "@/assets/forest-friends-cover.jpg";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const featuredStories = [
    { title: "Dragon Valley", genre: "Fantasy", difficulty: "Beginner", duration: "15 min", rating: 4.8, image: dragonValleyCover, description: "Befriend mighty dragons in an enchanted valley" },
    { title: "Space Explorer", genre: "Sci-Fi", difficulty: "Intermediate", duration: "20 min", rating: 4.9, image: spaceExplorerCover, description: "Journey through the cosmos and discover new worlds" },
    { title: "Princess Castle", genre: "Fantasy", difficulty: "Beginner", duration: "12 min", rating: 4.7, image: princessCastleCover, description: "Royal adventures await in this magical kingdom" },
    { title: "Pirate Treasure", genre: "Adventure", difficulty: "Advanced", duration: "25 min", rating: 4.6, image: pirateTreasureCover, description: "Set sail on a thrilling treasure hunt" },
  ];

  const categories = [
    { name: "Fantasy", count: 45, color: "bg-purple-500" },
    { name: "Adventure", count: 38, color: "bg-green-500" },
    { name: "Sci-Fi", count: 29, color: "bg-blue-500" },
    { name: "Mystery", count: 22, color: "bg-orange-500" },
    { name: "Educational", count: 34, color: "bg-indigo-500" },
    { name: "Interactive", count: 41, color: "bg-pink-500" },
  ];

  const newReleases = [
    { title: "Fairy Kingdom", image: fairyKingdomCover, isNew: true },
    { title: "Wizard School", image: wizardSchoolCover, isNew: true },
    { title: "Ocean Adventure", image: oceanAdventureCover, isNew: true },
    { title: "Forest Friends", image: forestFriendsCover, isNew: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Search */}
      <section className="p-6 bg-hero-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary-foreground mb-4">
            Explore Magical Stories
          </h1>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Discover new adventures, educational journeys, and interactive tales
          </p>
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Story Categories */}
      <section className="p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-headline font-bold mb-6 text-foreground">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="card-magical cursor-pointer hover:scale-105 transition-transform">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${category.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{category.name[0]}</span>
                  </div>
                  <h3 className="font-headline font-bold text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} stories</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="p-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-headline font-bold text-foreground">Featured Stories</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStories.map((story, index) => (
              <Link key={index} to="/create-character">
                <Card className="card-magical bg-card border-2 border-border overflow-hidden hover:scale-105 transition-transform">
                  <div className="aspect-video relative">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-yellow-500 text-black">
                        <Star className="h-3 w-3 mr-1" />
                        {story.rating}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <h4 className="text-lg font-headline font-bold text-shadow-soft">
                        {story.title}
                      </h4>
                      <p className="font-playful text-sm">{story.description}</p>
                    </div>
                  </div>
                  
                  <CardFooter className="p-4">
                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <Badge variant="secondary">{story.genre}</Badge>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {story.duration}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{story.difficulty}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Releases */}
      <section className="p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-headline font-bold mb-6 text-foreground">New Releases</h2>
          
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {newReleases.map((story, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                  <Link to="/create-character">
                    <Card className="card-magical bg-card border-2 border-border overflow-hidden hover:scale-105 transition-transform">
                      <div className="aspect-video relative">
                        <img 
                          src={story.image} 
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        {story.isNew && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-green-500">NEW</Badge>
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 text-white">
                          <h4 className="text-lg font-headline font-bold text-shadow-soft">
                            {story.title}
                          </h4>
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

      {/* Spacer above navigation */}
      <div className="h-8"></div>

      <Navigation />
    </div>
  );
};

export default Explore;