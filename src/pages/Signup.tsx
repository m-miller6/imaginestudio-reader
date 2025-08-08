import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import SignupSuccessDialog from "@/components/SignupSuccessDialog";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  adventurerName: z.string().min(1, "Adventurer's name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/\d/, "Password must include a number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must include a symbol"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: "onChange"
  });

  const watchedPassword = watch("password", "");
  const watchedConfirmPassword = watch("confirmPassword", "");

  const isPasswordValid = (password: string) => {
    return password.length >= 8 && 
           /\d/.test(password) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const isConfirmPasswordValid = (confirmPwd: string, originalPwd: string) => {
    return confirmPwd === originalPwd && originalPwd.length > 0;
  };

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    
    try {
      // Check if user already exists by attempting to sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            adventurer_name: data.adventurerName,
          }
        }
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast({
            title: "Account already exists",
            description: "An account with this email already exists. Please log in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup failed",
            description: authError.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (authData.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            adventurer_name: data.adventurerName,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast({
            title: "Account created",
            description: "Account created successfully, but there was an issue saving your profile.",
            variant: "default",
          });
        }

        // Show success dialog
        setShowSuccessDialog(true);
      }
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordInputClass = () => {
    if (!watchedPassword) return "";
    return isPasswordValid(watchedPassword) 
      ? "border-green-500 focus-visible:ring-green-500" 
      : "border-red-500 focus-visible:ring-red-500";
  };

  const getConfirmPasswordInputClass = () => {
    if (!watchedConfirmPassword) return "";
    return isConfirmPasswordValid(watchedConfirmPassword, watchedPassword)
      ? "border-green-500 focus-visible:ring-green-500"
      : "border-red-500 focus-visible:ring-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">Join the Adventure!</CardTitle>
              <CardDescription>Create your account to start your magical journey</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adventurerName">Adventurer's Name</Label>
                  <Input
                    id="adventurerName"
                    {...register("adventurerName")}
                    placeholder="Choose your adventure name"
                  />
                  {errors.adventurerName && (
                    <p className="text-sm text-red-500">{errors.adventurerName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="Create a password"
                    className={getPasswordInputClass()}
                  />
                  <p className="text-sm text-gray-500">
                    Password must be at least 8 characters, include a number, and a symbol
                  </p>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="Confirm your password"
                    className={getConfirmPasswordInputClass()}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <Link to="/" className="text-sm text-primary hover:underline">
                    Already have an account? Log in here
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <SignupSuccessDialog 
        open={showSuccessDialog} 
        onOpenChange={setShowSuccessDialog} 
      />
    </div>
  );
};

export default Signup;