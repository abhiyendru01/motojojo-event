
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Membership } from "@/types/supabase";

const MembershipStatus = () => {
  const { user } = useUser();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMembership = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('memberships')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching membership:', error);
          return;
        }
        
        setMembership(data as Membership | null);
      } catch (error) {
        console.error('Error in fetchMembership:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMembership();
  }, [user]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-6 bg-slate-200 rounded mb-2"></div>
          <div className="animate-pulse h-4 bg-slate-200 rounded w-2/3"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!membership) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
          <CardDescription>
            Upgrade to premium for exclusive benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Badge variant="outline">Free Member</Badge>
            <p className="mt-4 text-sm text-muted-foreground">
              <a href="/premium" className="text-motojojo-violet hover:underline">
                Upgrade to Premium
              </a>
              {" "}to unlock special benefits and discounts
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Lifetime';
    
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Premium V3':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'Premium V2':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-green-100 text-green-800 hover:bg-green-100';
    }
  };
  
  const benefits = {
    'Premium V1': [
      'One free event each month',
      '10% discount on all bookings',
      'Priority access to events'
    ],
    'Premium V2': [
      'Two free events each month',
      '20% discount on all bookings',
      'Priority access to events',
      'Exclusive experiences'
    ],
    'Premium V3': [
      'Three free events each month',
      '30% discount on all bookings',
      'Priority access to events',
      'Exclusive experiences',
      'VIP seating at select events',
      'Members-only special events'
    ]
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Status</CardTitle>
        <CardDescription>
          Your premium membership benefits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Plan:</span>
            <Badge className={getTierColor(membership.tier)}>
              {membership.tier}
            </Badge>
          </div>
          
          {membership.expires_at && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Valid Until:</span>
              <span className="text-sm">{formatDate(membership.expires_at)}</span>
            </div>
          )}
          
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Your Benefits:</h4>
            <ul className="text-sm space-y-1">
              {benefits[membership.tier as keyof typeof benefits]?.map((benefit, index) => (
                <li key={index} className="text-muted-foreground">• {benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipStatus;
