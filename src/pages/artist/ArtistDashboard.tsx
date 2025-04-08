
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, Ticket, Info } from "lucide-react";
import { ArtistProfile } from "@/types/supabase";

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalBookings: number;
  totalRevenue: number;
}

const ArtistDashboard = () => {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Check if artist profile exists
        const { data: profileData, error: profileError } = await supabase
          .from('artist_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking profile:', profileError);
        }
          
        setHasProfile(!!profileData);
        
        if (profileData) {
          // Get events created by this artist
          console.log("Fetching events for artist:", user.id);
          const { data: eventsData, error: eventsError } = await supabase
            .from('events')
            .select('id')
            .eq('artist_id', user.id);
            
          if (eventsError) {
            console.error('Error fetching events:', eventsError);
          }
          
          console.log("Events found:", eventsData?.length);
          const eventIds = eventsData ? eventsData.map(event => event.id) : [];
          
          // Get upcoming events count
          const { data: upcomingEvents, error: upcomingError } = await supabase
            .from('events')
            .select('id')
            .eq('artist_id', user.id)
            .gte('date', new Date().toISOString().split('T')[0]);
            
          if (upcomingError) {
            console.error('Error fetching upcoming events:', upcomingError);
          }
          
          console.log("Upcoming events found:", upcomingEvents?.length);
            
          // Get bookings for artist's events
          let bookingsData = [];
          if (eventIds.length > 0) {
            const { data: bookings, error: bookingsError } = await supabase
              .from('bookings')
              .select('tickets, amount')
              .in('event_id', eventIds);
              
            if (bookingsError) {
              console.error('Error fetching bookings:', bookingsError);
            }
            
            bookingsData = bookings || [];
          }
            
          const totalBookings = bookingsData.reduce((sum, booking) => sum + booking.tickets, 0);
          const totalRevenue = bookingsData.reduce((sum, booking) => sum + booking.amount, 0);
          
          setStats({
            totalEvents: eventIds.length,
            upcomingEvents: upcomingEvents?.length || 0,
            totalBookings,
            totalRevenue,
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-motojojo-violet"></div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-dashed border-motojojo-violet/50 bg-white/50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Welcome to your Artist Dashboard!</CardTitle>
            <CardDescription className="text-center">
              To get started, you need to complete your artist profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Info className="h-16 w-16 text-motojojo-violet mb-4" />
            <p className="text-center mb-6">
              Before creating events or accepting bookings, please set up your artist profile with your details, 
              portfolio, and social media connections.
            </p>
            <Link to="/artist/profile">
              <Button className="bg-motojojo-violet hover:bg-motojojo-deepViolet">
                Complete Your Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Artist Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your events and bookings.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-3xl font-bold">{stats.totalEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-motojojo-violet" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                <p className="text-3xl font-bold">{stats.upcomingEvents}</p>
              </div>
              <Clock className="h-8 w-8 text-motojojo-violet" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-3xl font-bold">{stats.totalBookings}</p>
              </div>
              <Users className="h-8 w-8 text-motojojo-violet" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">₹{stats.totalRevenue}</p>
              </div>
              <Ticket className="h-8 w-8 text-motojojo-violet" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/artist/events/create">
              <Button className="w-full bg-motojojo-violet hover:bg-motojojo-deepViolet">
                Create New Event
              </Button>
            </Link>
            <Link to="/artist/profile">
              <Button variant="outline" className="w-full border-motojojo-violet text-motojojo-violet">
                Update Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Latest Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-muted">
                <p className="text-sm text-muted-foreground">
                  {stats.totalEvents > 0 
                    ? `You have ${stats.upcomingEvents} upcoming events and ${stats.totalBookings} total bookings.`
                    : 'No events created yet. Create your first event to start getting bookings!'}
                </p>
              </div>
              <Link to="/artist/events">
                <Button variant="link" className="p-0 text-motojojo-violet">
                  View All Events →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArtistDashboard;
