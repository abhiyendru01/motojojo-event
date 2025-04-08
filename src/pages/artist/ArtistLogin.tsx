
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ArtistLogin = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  
  // Check if the user is already signed in
  if (isSignedIn) {
    navigate("/artist/dashboard");
    return null;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">MotoJojo Artist Portal</h1>
          <p className="text-muted-foreground mt-2">
            Sign in or create an account to access the artist dashboard
          </p>
        </div>
        
        <div className="bg-white p-8 shadow-lg rounded-xl">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Artists Sign In</h2>
              <p className="text-sm text-muted-foreground">
                Access your artist dashboard to manage your profile and events
              </p>
            </div>
            
            <div className="space-y-4">
              <SignInButton mode="modal" fallbackRedirectUrl="/artist/dashboard">
                <Button className="w-full">
                  Sign In with Email
                </Button>
              </SignInButton>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <SignUpButton mode="modal" fallbackRedirectUrl="/artist/profile">
                <Button variant="outline" className="w-full">
                  Create Artist Account
                </Button>
              </SignUpButton>
            </div>
            
            <div className="text-center mt-6">
              <Button 
                variant="link"
                className="text-sm text-muted-foreground" 
                onClick={() => navigate("/")}
              >
                Return to Main Site
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistLogin;
