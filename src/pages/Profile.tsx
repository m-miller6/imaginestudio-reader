import { User, Crown, Settings, CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const Profile = () => {
  const user = {
    name: "Joe",
    email: "joe@example.com",
    avatar: null,
    subscription: {
      plan: "Premium",
      status: "Active",
      nextBilling: "2024-02-15"
    },
    stats: {
      storiesCompleted: 12,
      charactersCreated: 3,
      favoriteGenre: "Adventure"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* User Profile Header */}
          <Card className="shadow-magical border-2 border-primary/20 bg-hero-gradient">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-white shadow-soft">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="text-2xl font-headline font-bold bg-primary text-primary-foreground">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-3xl font-headline font-bold text-primary-foreground mb-2">
                    Hi {user.name}!
                  </h2>
                  <p className="font-playful text-primary-foreground/90 text-lg">
                    Welcome back to your magical journey
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <Crown className="h-5 w-5 text-accent" />
                    <span className="font-playful text-primary-foreground font-semibold">
                      {user.subscription.plan} Member
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="secondary" size="lg" className="h-auto p-6 font-playful">
              <div className="text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2" />
                <div className="font-bold">View Subscription</div>
                <div className="text-sm opacity-75">Manage your plan</div>
              </div>
            </Button>
            
            <Button variant="whimsical" size="lg" className="h-auto p-6 font-playful">
              <div className="text-center">
                <Crown className="h-8 w-8 mx-auto mb-2" />
                <div className="font-bold">Upgrade Plan</div>
                <div className="text-sm opacity-90">Unlock more features</div>
              </div>
            </Button>
            
            <Button variant="outline" size="lg" className="h-auto p-6 font-playful">
              <div className="text-center">
                <Settings className="h-8 w-8 mx-auto mb-2" />
                <div className="font-bold">Edit Profile</div>
                <div className="text-sm opacity-75">Update your info</div>
              </div>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-soft border-2 border-border">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-headline font-bold text-primary">
                  {user.stats.storiesCompleted}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-playful text-muted-foreground">Stories Completed</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft border-2 border-border">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-headline font-bold text-accent-foreground">
                  {user.stats.charactersCreated}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-playful text-muted-foreground">Characters Created</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft border-2 border-border">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg font-headline font-bold text-secondary-foreground">
                  {user.stats.favoriteGenre}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-playful text-muted-foreground">Favorite Genre</p>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Details */}
          <Card className="shadow-soft border-2 border-border">
            <CardHeader>
              <CardTitle className="font-headline font-bold text-primary flex items-center gap-2">
                <Crown className="h-6 w-6" />
                Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-playful font-semibold text-foreground">Plan</p>
                  <p className="text-primary font-bold">{user.subscription.plan}</p>
                </div>
                <div>
                  <p className="font-playful font-semibold text-foreground">Status</p>
                  <p className="text-success-green font-bold">{user.subscription.status}</p>
                </div>
                <div>
                  <p className="font-playful font-semibold text-foreground">Next Billing</p>
                  <p className="text-muted-foreground">{user.subscription.nextBilling}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h4 className="font-playful font-semibold mb-2 text-foreground">Premium Benefits</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Unlimited story creation</li>
                  <li>• Access to all character customization options</li>
                  <li>• Priority customer support</li>
                  <li>• New stories every week</li>
                  <li>• Save unlimited stories to library</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="shadow-soft border-2 border-border">
            <CardHeader>
              <CardTitle className="font-headline font-bold text-primary flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-playful font-semibold text-foreground">Email</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="font-playful font-semibold text-foreground">Member Since</p>
                  <p className="text-muted-foreground">January 2024</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <Button variant="destructive" className="font-playful">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;