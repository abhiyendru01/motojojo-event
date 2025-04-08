
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CityStrip from "@/components/CityStrip";
import Footer from "@/components/Footer";
import EventDetailSkeleton from "@/components/EventDetailSkeleton";
import EventDetailHero from "@/components/EventDetailHero";
import EventInfo from "@/components/EventInfo";
import EventDetailSidebar from "@/components/EventDetailSidebar";
import BookingForm from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, MapPin, Users, Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const EventDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [similarEvents, setSimilarEvents] = useState<any[]>([]);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const { isSignedIn } = useUser();
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        // Fetch the selected event from Supabase
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
          
        if (eventError) throw eventError;
        
        if (!eventData) {
          console.error('Event not found');
          setLoading(false);
          return;
        }
        
        // Format the event data to match our application's expected structure
        const formattedEvent = {
          id: eventData.id,
          title: eventData.title,
          subtitle: eventData.description.substring(0, 120) + '...',
          description: eventData.description,
          image: eventData.image_url || "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop",
          city: eventData.city,
          date: new Date(eventData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          time: eventData.time.slice(0, 5), // Format HH:MM
          duration: "3 hours", // Default duration if not available
          artist: "Event Host", // Default artist if not available
          category: eventData.category,
          totalSeats: eventData.max_capacity,
          availableSeats: eventData.max_capacity, // We'll adjust this based on bookings
          price: eventData.price,
          artistImage: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=2940&auto=format&fit=crop", // Default image
          artistBio: "This is a featured artist or host for this event.", // Default bio
          location: eventData.location
        };
        
        // Fetch existing bookings for this event to calculate available seats
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('tickets')
          .eq('event_id', id);
          
        if (!bookingsError && bookingsData) {
          const ticketsSold = bookingsData.reduce((sum, booking) => sum + booking.tickets, 0);
          formattedEvent.availableSeats = Math.max(0, formattedEvent.totalSeats - ticketsSold);
        }
        
        // Fetch similar events (same category but not the current event)
        const { data: similarEventsData, error: similarError } = await supabase
          .from('events')
          .select('*')
          .eq('category', eventData.category)
          .neq('id', id)
          .limit(3);
          
        if (!similarError && similarEventsData) {
          const formattedSimilarEvents = similarEventsData.map(event => ({
            id: event.id,
            title: event.title,
            date: new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: event.image_url || "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop",
            category: event.category
          }));
          
          setSimilarEvents(formattedSimilarEvents);
        }
        
        setEvent(formattedEvent);
      } catch (error) {
        console.error('Error fetching event details:', error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const handleBookNow = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to book tickets", {
        description: "You need to be logged in to continue with booking.",
        duration: 5000,
      });
      return;
    }
    setIsBookingFormOpen(true);
  };

  if (loading) {
    return <EventDetailSkeleton />;
  }
  
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CityStrip />
      
      <main className="flex-1">
        <EventDetailHero image={event.image} title={event.title} subtitle={event.subtitle} />
        
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
          {/* Main content - takes up 2/3 on desktop */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event description */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-motojojo-violet hover:bg-motojojo-deepViolet">{event.category}</Badge>
                <Badge variant="outline" className="border-motojojo-violet text-motojojo-violet">
                  {event.city}
                </Badge>
              </div>
              
              <h2 className="text-2xl font-semibold">About this event</h2>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
            
            {/* Event details card */}
            <EventInfo event={event} />
            
            {/* Similar events carousel */}
            {similarEvents.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-6">Similar Events</h2>
                <Carousel className="w-full">
                  <CarouselContent>
                    {similarEvents.map((similar) => (
                      <CarouselItem key={similar.id} className="md:basis-1/2 lg:basis-1/2">
                        <Link to={`/event/${similar.id}`}>
                          <Card className="overflow-hidden rounded-2xl card-hover">
                            <CardContent className="p-0">
                              <div className="relative h-[160px]">
                                <img 
                                  src={similar.image} 
                                  alt={similar.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                  <Badge className="bg-motojojo-red hover:bg-motojojo-red/90">
                                    {similar.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="font-bold mb-2">{similar.title}</h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{similar.date}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}
            
            {/* Book now (mobile only) */}
            <div className="lg:hidden">
              <Button 
                size="lg" 
                className="w-full bg-motojojo-red hover:bg-motojojo-red/90 text-lg font-semibold"
                onClick={handleBookNow}
              >
                Book Now - ₹{event.price}
              </Button>
            </div>
          </div>
          
          {/* Sidebar - takes up 1/3 on desktop */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Booking card - desktop only */}
              <div className="hidden lg:block p-6 bg-card rounded-2xl border shadow-md">
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-lg font-medium">Price</span>
                    <span className="text-xl font-bold">₹{event.price}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    <span>{event.availableSeats} seats remaining</span>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full bg-motojojo-red hover:bg-motojojo-red/90 text-lg font-semibold"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-motojojo-violet" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-motojojo-violet" />
                    <span>{event.time} · {event.duration}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-motojojo-violet" />
                    <span>{event.city}, {event.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-motojojo-violet" />
                    <span>{event.totalSeats} total capacity</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Ticket className="h-4 w-4 mr-2 text-motojojo-violet" />
                    <span>{event.availableSeats} seats available</span>
                  </div>
                </div>
              </div>
              
              {/* Artist info */}
              <EventDetailSidebar event={event} />
            </div>
          </div>
        </div>
      </main>
      
      {/* Booking Form Dialog */}
      {event && (
        <BookingForm 
          isOpen={isBookingFormOpen} 
          onClose={() => setIsBookingFormOpen(false)} 
          event={event}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default EventDetail;
