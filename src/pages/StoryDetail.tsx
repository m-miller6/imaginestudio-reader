import { Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
// Import all story covers
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
    },
    "ocean-adventure": {
      title: "Ocean Adventure",
      image: oceanAdventureCover,
      description: "Dive deep into the blue seas and discover underwater treasures, meet colorful sea creatures, and explore mysterious ocean depths!"
    },
    "space-explorer": {
      title: "Space Explorer",
      image: spaceExplorerCover,
      description: "Journey through the cosmos, visit distant planets, meet alien friends, and discover the wonders of the universe!"
    },
    "forest-friends": {
      title: "Forest Friends",
      image: forestFriendsCover,
      description: "Meet woodland creatures in their magical forest home and learn about friendship, nature, and caring for the environment!"
    },
    "princess-castle": {
      title: "Princess Castle",
      image: princessCastleCover,
      description: "Royal adventures await in a magnificent castle where brave princesses solve problems and help their kingdom!"
    },
    "dinosaur-discovery": {
      title: "Dinosaur Discovery",
      image: dinosaurDiscoveryCover,
      description: "Travel back in time to the age of dinosaurs and learn about these magnificent creatures in an exciting prehistoric adventure!"
    },
    "magic-garden": {
      title: "Magic Garden",
      image: magicGardenCover,
      description: "Discover a secret garden where flowers sing, vegetables dance, and every plant has a magical story to tell!"
    },
    "pirate-treasure": {
      title: "Pirate Treasure",
      image: pirateTreasureCover,
      description: "Sail the seven seas with friendly pirates on an exciting treasure hunt filled with maps, clues, and amazing discoveries!"
    },
    "fairy-kingdom": {
      title: "Fairy Kingdom",
      image: fairyKingdomCover,
      description: "Enter a magical realm where fairies live among flowers, grant wishes, and teach the importance of kindness and magic!"
    },
    "robot-friends": {
      title: "Robot Friends",
      image: robotFriendsCover,
      description: "Meet helpful robots in a futuristic world and learn about technology, friendship, and how machines can make life better!"
    },
    "dragon-valley": {
      title: "Dragon Valley",
      image: dragonValleyCover,
      description: "Befriend mighty dragons in an enchanted valley and discover that even the most fearsome creatures can be gentle friends!"
    },
    "underwater-city": {
      title: "Underwater City",
      image: underwaterCityCover,
      description: "Explore a magnificent city beneath the waves where merpeople live and protect the secrets of the deep ocean!"
    },
    "time-traveler": {
      title: "Time Traveler",
      image: timeTravelerCover,
      description: "Journey through different time periods, meet historical figures, and learn how the world has changed throughout history!"
    },
    "jungle-explorer": {
      title: "Jungle Explorer",
      image: jungleExplorerCover,
      description: "Trek through dense rainforests, meet exotic animals, and discover the amazing biodiversity of the jungle ecosystem!"
    },
    "ice-kingdom": {
      title: "Ice Kingdom",
      image: iceKingdomCover,
      description: "Venture into a frozen wonderland where ice queens rule with kindness and snow creatures become loyal friends!"
    },
    "superhero-academy": {
      title: "Superhero Academy",
      image: superheroAcademyCover,
      description: "Train at a special school for young heroes and learn that real superpowers come from helping others and being brave!"
    },
    "alien-encounter": {
      title: "Alien Encounter",
      image: alienEncounterCover,
      description: "Meet friendly aliens from distant planets and learn about different worlds, cultures, and the importance of understanding others!"
    },
    "wizard-school": {
      title: "Wizard School",
      image: wizardSchoolCover,
      description: "Attend a magical academy where young wizards learn spells, make potions, and discover that wisdom is the greatest magic!"
    },
    "animal-rescue": {
      title: "Animal Rescue",
      image: animalRescueCover,
      description: "Help rescue and care for animals in need while learning about compassion, responsibility, and protecting wildlife!"
    },
    "mystery-mansion": {
      title: "Mystery Mansion",
      image: mysteryMansionCover,
      description: "Solve puzzles and mysteries in a spooky but friendly mansion where every room holds a new surprise and adventure!"
    },
    "sports-champion": {
      title: "Sports Champion",
      image: sportsChampionCover,
      description: "Train to become a sports star and learn about teamwork, perseverance, and the joy of playing fair and having fun!"
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
                <Link to="/create-character" className="block mt-4">
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