
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { ArtistProfile } from '@/types/supabase';

interface SimilarEvent {
  id: string;
  title: string;
  date: string;
  image: string;
}

interface EventDetailSidebarProps {
  event: {
    artistImage?: string;
    artist?: string;
    artistBio?: string;
    category: string;
    artist_id?: string;
  };
}

const EventDetailSidebar: React.FC<EventDetailSidebarProps> = ({ event }) => {
  const [similarEvents, setSimilarEvents] = useState<SimilarEvent[]>([]);
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null);
  const [isLoadingArtist, setIsLoadingArtist] = useState(true);
  
  useEffect(() => {
    const fetchSimilarEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, title, date, image_url')
          .eq('category', event.category)
          .limit(3);
          
        if (error) throw error;
        
        if (data) {
          const formattedEvents = data.map(evt => ({
            id: evt.id,
            title: evt.title,
            date: new Date(evt.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            image: evt.image_url || "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop"
          }));
          
          setSimilarEvents(formattedEvents);
        }
      } catch (error) {
        console.error('Error fetching similar events:', error);
      }
    };
    
    // Fetch artist profile if artist_id is available
    const fetchArtistProfile = async () => {
      if (!event.artist_id) {
        setIsLoadingArtist(false);
        return;
      }
      
      try {
        setIsLoadingArtist(true);
        
        const { data, error } = await supabase
          .from('artist_profiles')
          .select('*')
          .eq('user_id', event.artist_id)
          .single() as { data: ArtistProfile | null, error: any };
          
        if (error) {
          if (error.code !== 'PGRST116') { // No rows found error
            throw error;
          }
        }
        
        if (data) {
          setArtistProfile(data);
        }
      } catch (error) {
        console.error('Error fetching artist profile:', error);
      } finally {
        setIsLoadingArtist(false);
      }
    };
    
    if (event.category) {
      fetchSimilarEvents();
    }
    
    fetchArtistProfile();
  }, [event.category, event.artist_id]);

  // Use artist data from the profile if available, otherwise fall back to the event data
  const artistName = artistProfile?.name || event.artist || "Event Host";
  const artistBio = artistProfile?.bio || event.artistBio || "Information about this event's host is not available.";
  const artistImage = artistProfile?.profile_picture || event.artistImage || "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=2940&auto=format&fit=crop";
  const artistProfileLink = artistProfile ? `/artist/${artistProfile.name.toLowerCase().replace(/\s+/g, '-')}` : null;

  return (
    <div className="space-y-8">
      {/* Artist info */}
      <Card className="rounded-2xl overflow-hidden border shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Artist</h3>
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={artistImage} alt={artistName} />
              <AvatarFallback>
                {artistName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              {artistProfileLink ? (
                <Link to={artistProfileLink} className="hover:underline">
                  <h4 className="text-lg font-medium">{artistName}</h4>
                </Link>
              ) : (
                <h4 className="text-lg font-medium">{artistName}</h4>
              )}
              {artistProfile && (
                <span className="text-sm text-muted-foreground">{artistProfile.artist_type}</span>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{artistBio}</p>
          
          {artistProfileLink && (
            <div className="mt-4 pt-4 border-t">
              <Link to={artistProfileLink} className="text-sm text-motojojo-violet hover:underline">
                View Full Artist Profile →
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Similar events */}
      {similarEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">You may also like</h3>
          
          <Carousel className="w-full">
            <CarouselContent>
              {similarEvents.map((event) => (
                <CarouselItem key={event.id} className="md:basis-full lg:basis-full">
                  <Link to={`/event/${event.id}`}>
                    <Card className="rounded-2xl overflow-hidden card-hover border shadow-sm">
                      <CardContent className="p-0">
                        <div className="relative h-32">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 
                                "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop";
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium mb-2 line-clamp-1">{event.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{event.date}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default EventDetailSidebar;
