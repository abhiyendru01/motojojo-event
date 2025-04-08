
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCity } from "@/contexts/CityContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArtistProfile } from "@/types/supabase";

const ArtistsSection = () => {
  const { selectedCity } = useCity();
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setIsLoading(true);
        
        // Fetch artist profiles from Supabase
        const { data: artistData, error: artistError } = await supabase
          .from('artist_profiles')
          .select('*');
          
        if (artistError) {
          console.error('Error fetching artists:', artistError);
          throw artistError;
        }
        
        if (artistData && artistData.length > 0) {
          console.log("Found artists:", artistData.length, artistData);
          
          // Get all artist events to determine their cities
          const { data: eventsData, error: eventsError } = await supabase
            .from('events')
            .select('artist_id, city');
            
          if (eventsError) {
            console.error('Error fetching events:', eventsError);
            throw eventsError;
          }
          
          // Map artists with their cities from events
          const artistsWithCities = artistData.map((artist: ArtistProfile) => {
            if (!artist.cities || artist.cities.length === 0) {
              const artistEvents = eventsData?.filter((event: any) => event.artist_id === artist.user_id) || [];
              const citiesFromEvents = [...new Set(artistEvents.map((event: any) => event.city))];
              
              artist.cities = citiesFromEvents.length > 0 ? citiesFromEvents : ["All Cities"];
            }
            
            return artist;
          });
          
          setArtists(artistsWithCities);
          console.log("Processed artists with cities:", artistsWithCities);
        } else {
          console.log("No artists found");
          setArtists([]);
        }
      } catch (error) {
        console.error('Error in fetchArtists:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArtists();
  }, []);
  
  // Filter artists based on selected city
  const filteredArtists = artists.filter(artist => 
    selectedCity === "All Cities" || 
    (artist.cities && artist.cities.includes(selectedCity))
  );

  return (
    <section className="py-12 w-full bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <h2 className="section-title">Featured Artists in {selectedCity}</h2>
        
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground animate-pulse">Loading artists...</p>
          </div>
        ) : filteredArtists.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No artists found in {selectedCity} at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {filteredArtists.map((artist) => (
              <Link 
                key={artist.id} 
                to={`/artist/${artist.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Card className="overflow-hidden rounded-2xl card-hover h-full">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-3">
                      <img 
                        src={artist.profile_picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop"} 
                        alt={artist.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop";
                        }}
                      />
                    </div>
                    <h3 className="font-semibold">{artist.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{artist.artist_type}</p>
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      {artist.cities?.slice(0, 2).map((city, index) => (
                        <span 
                          key={index} 
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            city === selectedCity 
                              ? "bg-motojojo-violet/20 text-motojojo-violet" 
                              : "bg-muted"
                          }`}
                        >
                          {city}
                        </span>
                      ))}
                      {artist.cities && artist.cities.length > 2 && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          +{artist.cities.length - 2}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtistsSection;
