
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { initializeRazorpayPayment } from "@/utils/razorpay";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  highlight?: boolean;
}

const Premium = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const premiumPlans: PremiumPlan[] = [
    {
      id: "premium-v1",
      name: "Premium V1",
      price: 100,
      benefits: [
        "One free event each month",
        "10% discount on all bookings",
        "Priority access to events"
      ]
    },
    {
      id: "premium-v2",
      name: "Premium V2",
      price: 300,
      benefits: [
        "Two free events each month",
        "20% discount on all bookings",
        "Priority access to events",
        "Exclusive experiences"
      ],
      highlight: true
    },
    {
      id: "premium-v3",
      name: "Premium V3",
      price: 500,
      benefits: [
        "Three free events each month",
        "30% discount on all bookings",
        "Priority access to events",
        "Exclusive experiences",
        "VIP seating at select events",
        "Members-only special events"
      ]
    }
  ];
  
  const handlePurchase = async (plan: PremiumPlan) => {
    if (!isSignedIn || !user) {
      toast.error("Please sign in to purchase a premium membership");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Load Razorpay script
      const scriptLoaded = await initializeRazorpayPayment({
        key: "rzp_test_W0CUqQuA8NuXCF", // Replace with your Razorpay key
        amount: plan.price * 100, // Convert to paise
        currency: "INR",
        name: "MotoJojo",
        description: `${plan.name} Membership`,
        handler: async (response) => {
          try {
            // Save membership to Supabase
            const { error } = await supabase
              .from('memberships')
              .insert({
                user_id: user.id,
                tier: plan.name,
                amount: plan.price,
                payment_id: response.razorpay_payment_id,
                is_active: true
              } as any);
              
            if (error) {
              console.error("Error saving membership:", error);
              toast.error("Failed to save your membership. Please contact support.");
              return;
            }
            
            toast.success("Your premium membership has been activated!");
            navigate("/user/profile");
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          contact: ""
        },
        theme: {
          color: "#5D3FD3"
        }
      });
      
      if (!scriptLoaded) {
        toast.error("Could not load payment gateway. Please try again later.");
      }
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Payment initialization failed. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Membership</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Upgrade to premium for exclusive benefits, early access to events, 
          and special discounts that enhance your MotoJojo experience.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {premiumPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative flex flex-col ${plan.highlight ? 'border-motojojo-violet ring-2 ring-motojojo-violet/20' : ''}`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-motojojo-violet text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{plan.name}</span>
                {plan.highlight && <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
              </CardTitle>
              <CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="text-muted-foreground"> /month</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-motojojo-violet hover:bg-motojojo-deepViolet"
                onClick={() => handlePurchase(plan)}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Buy Now"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Premium;
