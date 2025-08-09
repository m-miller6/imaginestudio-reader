import React, { useEffect } from 'react';
import { User, Crown, Settings, CreditCard, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { subscription, loading, checkSubscription, createCheckout, openCustomerPortal } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    // Check for success/cancelled URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Subscription successful!",
        description: "Welcome to your new plan. Refreshing subscription status...",
      });
      // Refresh subscription status after successful checkout
      setTimeout(() => {
        checkSubscription();
      }, 2000);
    } else if (urlParams.get('cancelled') === 'true') {
      toast({
        title: "Subscription cancelled",
        description: "You can subscribe again anytime.",
        variant: "destructive",
      });
    }
  }, [checkSubscription, toast]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const user = {
    name: "Joe",
    email: "joe@example.com",
    avatar: null,
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
                    {loading ? (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Loading...
                      </Badge>
                    ) : subscription?.subscribed ? (
                      <span className="font-playful text-primary-foreground font-semibold">
                        {subscription.subscription_tier} Member
                      </span>
                    ) : (
                      <span className="font-playful text-primary-foreground font-semibold">
                        Free Member
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="secondary" 
              size="lg" 
              className="h-auto p-6 font-playful"
              onClick={checkSubscription}
              disabled={loading}
            >
              <div className="text-center">
                <RefreshCw className={`h-8 w-8 mx-auto mb-2 ${loading ? 'animate-spin' : ''}`} />
                <div className="font-bold">Refresh Status</div>
                <div className="text-sm opacity-75">Check subscription</div>
              </div>
            </Button>
            
            {subscription?.subscribed ? (
              <Button 
                variant="whimsical" 
                size="lg" 
                className="h-auto p-6 font-playful"
                onClick={openCustomerPortal}
              >
                <div className="text-center">
                  <Settings className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-bold">Manage Subscription</div>
                  <div className="text-sm opacity-90">Billing & settings</div>
                </div>
              </Button>
            ) : (
              <Button 
                variant="whimsical" 
                size="lg" 
                className="h-auto p-6 font-playful"
                onClick={() => createCheckout('premium')}
              >
                <div className="text-center">
                  <Crown className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-bold">Upgrade Plan</div>
                  <div className="text-sm opacity-90">Unlock more features</div>
                </div>
              </Button>
            )}
            
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
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading subscription details...</span>
                </div>
              ) : subscription?.subscribed ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-playful font-semibold text-foreground">Plan</p>
                      <p className="text-primary font-bold">{subscription.subscription_tier}</p>
                    </div>
                    <div>
                      <p className="font-playful font-semibold text-foreground">Status</p>
                      <p className="text-success-green font-bold">Active</p>
                    </div>
                    <div>
                      <p className="font-playful font-semibold text-foreground">Next Billing</p>
                      <p className="text-muted-foreground">{formatDate(subscription.subscription_end)}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-playful font-semibold mb-2 text-foreground">
                      {subscription.subscription_tier} Benefits
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {subscription.subscription_tier === 'Basic' ? (
                        <>
                          <li>• 10 stories per month</li>
                          <li>• Create up to 3 characters</li>
                          <li>• Basic story templates</li>
                          <li>• Email support</li>
                        </>
                      ) : (
                        <>
                          <li>• Unlimited story creation</li>
                          <li>• Access to all character customization options</li>
                          <li>• Priority customer support</li>
                          <li>• New stories every week</li>
                          <li>• Save unlimited stories to library</li>
                        </>
                      )}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Free Plan</h3>
                    <p className="text-sm text-gray-600">You're currently on the free plan</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Upgrade to unlock premium features:
                    </p>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="text-left">
                          <p className="font-medium">Basic Plan</p>
                          <p className="text-sm text-muted-foreground">Essential storytelling features</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">$19.99/mo</p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => createCheckout('basic')}
                            className="mt-1"
                          >
                            Choose Basic
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg bg-amber-50 border-amber-200">
                        <div className="text-left">
                          <p className="font-medium text-amber-900">Premium Plan</p>
                          <p className="text-sm text-amber-700">Unlimited everything</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">$49.99/mo</p>
                          <Button 
                            size="sm"
                            onClick={() => createCheckout('premium')}
                            className="mt-1"
                          >
                            Choose Premium
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                <Button 
                  variant="destructive" 
                  className="font-playful"
                  onClick={handleSignOut}
                >
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