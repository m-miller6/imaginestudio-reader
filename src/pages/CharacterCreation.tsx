import { useState } from "react";
import { Upload, RefreshCw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const CharacterCreation = () => {
  const [activeTab, setActiveTab] = useState("create-new");
  const [heroName, setHeroName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload process
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 2000);
    }
  };

  const handleStartAdventure = () => {
    setIsCreating(true);
    // Simulate character creation
    setTimeout(() => {
      setIsCreating(false);
      // Navigate to story reader
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="flex-1 p-6">
        {/* Toggle Bar */}
        <div className="flex justify-center mb-6">
          <ToggleGroup 
            type="single" 
            value={activeTab} 
            onValueChange={(value) => value && setActiveTab(value)}
            className="bg-card border-2 border-border rounded-xl p-1"
          >
            <ToggleGroupItem 
              value="create-new" 
              className="px-6 py-2 font-playful text-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-lg"
            >
              Create New Character
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="library" 
              className="px-6 py-2 font-playful text-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-lg"
            >
              Character Library
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {activeTab === "create-new" ? (
              <Card className="shadow-magical border-2 border-primary/20 bg-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-headline font-bold text-primary mb-2">
                    It's time to create a character!
                  </CardTitle>
                  <p className="font-playful text-lg text-muted-foreground">
                    Upload a photo and give your hero a name to begin the adventure
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Photo Upload */}
                  <div className="text-center">
                    <label className="block mb-2 font-headline font-semibold text-foreground">
                      Upload a photo
                    </label>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      
                      <label
                        htmlFor="photo-upload"
                        className="block w-full h-48 border-2 border-dashed border-primary/50 rounded-xl cursor-pointer hover:border-primary transition-colors bg-primary/5 hover:bg-primary/10"
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          {isUploading ? (
                            <>
                              <RefreshCw className="h-12 w-12 text-primary animate-spin mb-2" />
                              <p className="font-playful text-primary">Uploading...</p>
                            </>
                          ) : uploadedImage ? (
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                              <img 
                                src={uploadedImage} 
                                alt="Hero" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <>
                              <Upload className="h-12 w-12 text-primary mb-2" />
                              <p className="font-playful text-primary">Click to upload a photo</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                PNG, JPG up to 10MB
                              </p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Hero Name Input */}
                  <div>
                    <label className="block mb-2 font-headline font-semibold text-foreground">
                      What is our Hero's name?
                    </label>
                    <Input
                      value={heroName}
                      onChange={(e) => setHeroName(e.target.value)}
                      placeholder="Enter hero's name..."
                      className="text-center font-playful text-lg h-12 rounded-xl border-2 border-border focus:border-primary"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="flex-1 font-playful"
                    >
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Regenerate
                    </Button>
                    
                    <Link to="/story-reader" className="flex-1">
                      <Button 
                        variant="whimsical" 
                        size="lg" 
                        className="w-full font-playful"
                        disabled={!heroName.trim() || isCreating}
                        onClick={handleStartAdventure}
                      >
                        {isCreating ? (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            Creating Hero...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 mr-2" />
                            Start Adventure!
                          </>
                        )}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-magical border-2 border-primary/20 bg-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-headline font-bold text-primary mb-2">
                    Character Library
                  </CardTitle>
                  <p className="font-playful text-lg text-muted-foreground">
                    Choose from your saved characters or create a new one
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="text-center py-12">
                    <p className="font-playful text-xl text-muted-foreground mb-4">
                      No characters saved yet
                    </p>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="font-playful"
                      onClick={() => setActiveTab("create-new")}
                    >
                      Create Your First Character
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Creating Hero Overlay */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="p-8 bg-card shadow-magical border-2 border-primary">
            <div className="text-center">
              <RefreshCw className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
              <h3 className="text-2xl font-headline font-bold text-primary mb-2">
                Creating Hero...
              </h3>
              <p className="font-playful text-muted-foreground">
                Preparing your magical adventure
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CharacterCreation;