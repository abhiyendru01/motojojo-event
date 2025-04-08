
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  city: string;
  location: string;
  category: string;
  image_url: string;
  max_capacity: number;
  price: number;
  bookings: number;
  revenue: number;
}

const ArtistEvents = () => {
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtistEvents = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Get artist's events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('artist_id', user.id)
          .order('date', { ascending: true });
          
        if (eventsError) throw eventsError;
        
        if (!eventsData) {
          setEvents([]);
          return;
        }
        
        // Get booking information for each event
        const eventsWithBookings = await Promise.all(
          eventsData.map(async (event) => {
            const { data: bookingsData } = await supabase
              .from('bookings')
              .select('tickets, amount')
              .eq('event_id', event.id);
              
            const bookings = bookingsData ? bookingsData.reduce((sum, b) => sum + b.tickets, 0) : 0;
            const revenue = bookingsData ? bookingsData.reduce((sum, b) => sum + b.amount, 0) : 0;
            
            return {
              ...event,
              bookings,
              revenue,
            };
          })
        );
        
        setEvents(eventsWithBookings);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error("Failed to load your events");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArtistEvents();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatTime = (timeString: string) => {
    // Format from HH:MM:SS to HH:MM AM/PM
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    const m = minutes;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${m} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-motojojo-violet"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-muted-foreground">Manage your events and check bookings</p>
        </div>
        <Link to="/artist/events/create">
          <Button className="bg-motojojo-violet hover:bg-motojojo-deepViolet">
            Create New Event
          </Button>
        </Link>
      </div>
      
      {events.length === 0 ? (
        <Card className="border-2 border-dashed border-motojojo-violet/50 bg-white/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-motojojo-violet/50 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Events Created Yet</h3>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              You haven't created any events yet. Start creating your first event to get bookings and connect with your audience.
            </p>
            <Link to="/artist/events/create">
              <Button className="bg-motojojo-violet hover:bg-motojojo-deepViolet">
                Create Your First Event
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col overflow-hidden rounded-2xl card-hover h-full">
              <div className="relative h-44">
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop";
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-motojojo-red hover:bg-motojojo-red/90">
                    {event.category}
                  </Badge>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                </div>
              </div>
              
              <CardContent className="p-4 flex-grow">
                <div className="flex flex-col space-y-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-motojojo-violet" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-motojojo-violet" />
                    <span>{formatTime(event.time)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-motojojo-violet" />
                    <span>{event.city}, {event.location}</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div className="flex items-center">
                      <Ticket className="h-4 w-4 mr-2 text-motojojo-violet" />
                      <span>{event.bookings}/{event.max_capacity} booked</span>
                    </div>
                    <div>
                      <Badge variant="outline" className="font-medium">
                        ₹{event.revenue}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex justify-between gap-2">
                <Link to={`/event/${event.id}`} className="flex-1">
                  <Button variant="outline" className="w-full border-motojojo-violet text-motojojo-violet">
                    View Event
                  </Button>
                </Link>
                <Link to={`/artist/bookings?event=${event.id}`} className="flex-1">
                  <Button className="w-full bg-motojojo-violet hover:bg-motojojo-deepViolet">
                    See Bookings
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistEvents;
