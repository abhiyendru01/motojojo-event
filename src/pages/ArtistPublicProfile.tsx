import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Instagram } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArtistProfile } from "@/types/supabase";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  city: string;
  location: string;
  category: string;
  image_url: string;
}

const ArtistPublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchArtistProfile = async () => {
      try {
        setIsLoading(true);
        
        // Find artist by username (converted from URL)
        const { data, error } = await supabase
          .from('artist_profiles')
          .select('*')
          .ilike('name', username?.replace(/-/g, ' ') || '')
          .single() as { data: ArtistProfile | null, error: any };
          
        if (error) throw error;
        
        if (data) {
          setArtistProfile(data);
          
          // Get artist's events
          const { data: eventsData, error: eventsError } = await supabase
            .from('events')
            .select('*')
            .eq('artist_id', data.user_id)
            .gte('date', new Date().toISOString().split('T')[0])
            .order('date', { ascending: true });
            
          if (eventsError) throw eventsError;
          
          setEvents(eventsData || []);
        }
      } catch (error) {
        console.error('Error fetching artist profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (username) {
      fetchArtistProfile();
    }
  }, [username]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-motojojo-violet border-opacity-50 rounded-full border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!artistProfile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold mb-4">Artist Not Found</h1>
            <p className="text-muted-foreground mb-6">The artist you're looking for doesn't exist or may have been removed.</p>
            <Link to="/" className="text-motojojo-violet hover:underline">Return to Homepage</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Artist Hero Section */}
        <div className="bg-gradient-to-b from-motojojo-violet/10 to-background py-12 md:py-20">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <Avatar className="h-32 w-32 md:h-48 md:w-48 border-4 border-white shadow-lg">
                <AvatarImage 
                  src={artistProfile?.profile_picture} 
                  alt={artistProfile?.name} 
                />
                <AvatarFallback className="text-4xl">
                  {artistProfile?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{artistProfile?.name}</h1>
                <div className="mb-4">
                  <Badge className="bg-motojojo-deepViolet">{artistProfile?.artist_type}</Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl">{artistProfile?.bio}</p>
                
                {/* Social Links */}
                <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                  {artistProfile?.instagram_handle && (
                    <a 
                      href={`https://instagram.com/${artistProfile.instagram_handle}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm hover:underline"
                    >
                      <Instagram size={18} className="text-pink-600" />
                      @{artistProfile.instagram_handle}
                    </a>
                  )}
                  
                  {artistProfile?.spotify_handle && (
                    <a 
                      href={`https://open.spotify.com/artist/${artistProfile.spotify_handle}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm hover:underline"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="h-4 w-4 text-green-500"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M12 6 v-2"></path>
                        <path d="M12 20 v-2"></path>
                        <path d="M6 12 h-2"></path>
                        <path d="M20 12 h-2"></path>
                      </svg>
                      Spotify
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Artist Content Tabs */}
        <div className="container py-12">
          <Tabs defaultValue="events" className="space-y-8">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
              <TabsTrigger value="events">Upcoming Events</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>
            
            {/* Events Tab */}
            <TabsContent value="events">
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No upcoming events at this time.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <Link key={event.id} to={`/event/${event.id}`}>
                      <Card className="overflow-hidden rounded-2xl card-hover h-full">
                        <CardContent className="p-0">
                          <div className="relative h-48">
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                              <div className="p-4 text-white">
                                <h3 className="text-xl font-bold">{event.title}</h3>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 space-y-3">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-motojojo-violet" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-motojojo-violet" />
                              <span>{formatTime(event.time)}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 mr-2 text-motojojo-violet" />
                              <span>{event.city}, {event.location}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Portfolio Tab */}
            <TabsContent value="portfolio">
              {!artistProfile?.portfolio_images || artistProfile.portfolio_images.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No portfolio items available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {artistProfile.portfolio_images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Portfolio item ${index + 1}`}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArtistPublicProfile;
