
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  SignInButton, 
  SignUpButton, 
  UserButton, 
  useAuth 
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UserAuth = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    if (isSignedIn) {
      navigate("/user/profile");
    } else {
      toast.error("Please sign in to view your profile");
    }
  };
  
  const handleBookingsClick = () => {
    if (isSignedIn) {
      navigate("/user/bookings");
    } else {
      toast.error("Please sign in to view your bookings");
    }
  };
  
  const handleSignInClick = () => {
    // Log for debugging
    console.log("Sign In button clicked");
  };
  
  const handleSignUpClick = () => {
    // Log for debugging
    console.log("Sign Up button clicked");
  };
  
  return (
    <div className="flex items-center gap-2">
      {isSignedIn ? (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden md:flex border border-black"
            onClick={handleProfileClick}
          >
            My Profile
          </Button>
          <Button
            variant="outline"
            className="hidden md:flex border border-black"
            onClick={handleBookingsClick}
          >
            My Bookings
          </Button>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-9 w-9 border border-black"
              }
            }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <SignInButton mode="modal">
            <Button 
              variant="outline" 
              className="border border-black"
              onClick={handleSignInClick}
            >
              Login
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button 
              className="bg-black text-white border border-black"
              onClick={handleSignUpClick}
            >
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      )}
    </div>
  );
};

export default UserAuth;
