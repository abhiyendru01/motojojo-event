
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { useCity } from "@/contexts/CityContext"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/supabase";

const EventsSection = () => {
  const { selectedCity } = useCity();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching events for city:", selectedCity);
        
        let query = supabase
          .from('events')
          .select('*');
        
        // Only filter by city if a specific city is selected
        if (selectedCity !== "All Cities") {
          query = query.eq('city', selectedCity);
        }
        
        const { data, error } = await query
          .order('date', { ascending: true })
          .limit(8);
          
        if (error) {
          console.error("Error fetching events:", error);
          throw error;
        }
        
        console.log("Fetched events:", data?.length || 0, data);
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [selectedCity]);

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

  const defaultImage = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop";

  return (
    <section className="py-12 w-full">
      <div className="container">
        <h2 className="section-title">Upcoming Events in {selectedCity}</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-muted-foreground animate-pulse">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No events found in {selectedCity} at this time.</p>
          </div>
        ) : (
          <div className="horizontal-scroll">
            {events.map((event) => (
              <Card key={event.id} className="flex-shrink-0 min-w-[300px] max-w-[320px] overflow-hidden rounded-2xl card-hover">
                <CardContent className="p-0">
                  <div className="relative h-[180px]">
                    <img 
                      src={event.image_url || defaultImage} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultImage;
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-motojojo-red hover:bg-motojojo-red/90">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                    <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatTime(event.time)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{event.city}, {event.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-1">
                  <Link to={`/event/${event.id}`} className="w-full">
                    <Button className="w-full bg-motojojo-violet hover:bg-motojojo-deepViolet">
                      Book Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
