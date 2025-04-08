import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Upload, MapPin, Users, CircleDollarSign } from "lucide-react";
import { ArtistProfile, Event } from "@/types/supabase";

const CATEGORIES = [
  "Music", "Theatre", "Comedy", "Food & Drinks", "Arts", 
  "Sports", "Dance", "Poetry", "Workshop", "Other"
];

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", 
  "Chennai", "Kolkata", "Jaipur", "Ahmedabad", "Goa"
];

interface EventForm {
  title: string;
  description: string;
  category: string;
  city: string;
  location: string;
  date: string;
  time: string;
  max_capacity: number;
  price: number;
  image_url?: string;
}

const ArtistCreateEvent = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null);
  const [eventForm, setEventForm] = useState<EventForm>({
    title: "",
    description: "",
    category: "",
    city: "",
    location: "",
    date: "",
    time: "",
    max_capacity: 50,
    price: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchArtistProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        console.log("Fetching profile for user ID:", user.id);
        
        const { data, error } = await supabase
          .from('artist_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching artist profile:', error);
          
          if (error.code === 'PGRST116') {
            toast.error("Please complete your artist profile first");
            navigate("/artist/profile");
            return;
          }
          throw error;
        }
        
        if (data) {
          console.log("Found artist profile:", data);
          setArtistProfile(data as ArtistProfile);
        } else {
          console.log("No artist profile found, redirecting");
          toast.error("Please complete your artist profile first");
          navigate("/artist/profile");
        }
      } catch (error) {
        console.error('Error fetching artist profile:', error);
        toast.error("Failed to load your profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArtistProfile();
  }, [user, navigate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: Number(value) }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadEventImage = async (): Promise<string> => {
    if (!imageFile) {
      throw new Error("No image file selected");
    }
    
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `event-images/${fileName}`;
    
    // Create the bucket if it doesn't exist
    const { error: bucketError } = await supabase.storage
      .getBucket('artist-images');
      
    if (bucketError) {
      // Bucket doesn't exist, create it
      const { error: createBucketError } = await supabase.storage
        .createBucket('artist-images', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        
      if (createBucketError) {
        console.error("Error creating bucket:", createBucketError);
        throw createBucketError;
      }
    }
    
    const { error: uploadError } = await supabase.storage
      .from('artist-images')
      .upload(filePath, imageFile);
      
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }
    
    const { data } = supabase.storage
      .from('artist-images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user || !artistProfile) {
      toast.error("Artist profile not found");
      return;
    }
    
    // Validate form
    if (!eventForm.title || !eventForm.description || !eventForm.category || 
        !eventForm.city || !eventForm.location || !eventForm.date || 
        !eventForm.time || !eventForm.max_capacity || !imageFile) {
      toast.error("Please fill all required fields and upload an image");
      return;
    }
    
    try {
      setIsSubmitting(true);
      toast.info("Creating your event...");
      
      // Upload event image
      const imageUrl = await uploadEventImage();
      console.log("Uploaded image URL:", imageUrl);
      
      // Create event
      const eventData = {
        title: eventForm.title,
        description: eventForm.description,
        category: eventForm.category,
        city: eventForm.city,
        location: eventForm.location,
        date: eventForm.date,
        time: eventForm.time,
        max_capacity: eventForm.max_capacity,
        price: eventForm.price,
        image_url: imageUrl,
        artist_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log("Creating event with data:", eventData);
      
      const { data: newEvent, error: eventError } = await supabase
        .from('events')
        .insert(eventData)
        .select();
        
      if (eventError) {
        console.error("Error creating event:", eventError);
        throw eventError;
      }
      
      console.log("Event created:", newEvent);
      
      if (!newEvent || newEvent.length === 0) {
        throw new Error("No event data returned after creation");
      }
      
      // Link event to artist
      const eventArtistData = {
        event_id: newEvent[0].id,
        artist_name: artistProfile.name,
      };
      
      console.log("Linking event to artist:", eventArtistData);
      
      const { error: linkError } = await supabase
        .from('event_artists')
        .insert(eventArtistData);
        
      if (linkError) {
        console.error("Error linking event to artist:", linkError);
        throw linkError;
      }
      
      toast.success("Event created successfully!");
      navigate("/artist/events");
      
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error("Failed to create event: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
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
      <div>
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <p className="text-muted-foreground">Fill in the details to create your event</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Basic information about your event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={eventForm.title}
                  onChange={handleInputChange}
                  placeholder="Give your event a catchy title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={eventForm.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={eventForm.description}
                onChange={handleInputChange}
                placeholder="Describe your event, what attendees can expect, etc."
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select 
                  value={eventForm.city} 
                  onValueChange={(value) => handleSelectChange('city', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Venue/Location</Label>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center px-3 border border-r-0 rounded-l-md">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="location"
                    name="location"
                    value={eventForm.location}
                    onChange={handleInputChange}
                    className="rounded-l-none"
                    placeholder="Venue name or address"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Date & Time</CardTitle>
            <CardDescription>
              When will your event take place?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center px-3 border border-r-0 rounded-l-md">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={eventForm.date}
                    onChange={handleInputChange}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center px-3 border border-r-0 rounded-l-md">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={eventForm.time}
                    onChange={handleInputChange}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Capacity & Pricing</CardTitle>
            <CardDescription>
              Set the number of tickets available and price
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="max_capacity">Total Capacity</Label>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center px-3 border border-r-0 rounded-l-md">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="max_capacity"
                    name="max_capacity"
                    type="number"
                    min="1"
                    value={eventForm.max_capacity}
                    onChange={handleNumberInputChange}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Ticket Price (₹)</Label>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center px-3 border border-r-0 rounded-l-md">
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={eventForm.price}
                    onChange={handleNumberInputChange}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Event Image</CardTitle>
            <CardDescription>
              Upload an attractive banner image for your event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-4">
              {imagePreview ? (
                <div className="relative w-full max-w-md">
                  <img 
                    src={imagePreview} 
                    alt="Event preview" 
                    className="w-full h-48 object-cover rounded-md" 
                  />
                  <Button 
                    type="button"
                    variant="secondary" 
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-center">
                    Drag and drop an image, or click to browse
                  </p>
                  <Label 
                    htmlFor="event-image" 
                    className="cursor-pointer bg-muted hover:bg-muted/80 px-4 py-2 rounded-md"
                  >
                    Select Image
                  </Label>
                </>
              )}
              <Input 
                id="event-image" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Recommended size: 1200 x 600 pixels. Maximum file size: 5MB.
            </p>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-motojojo-violet hover:bg-motojojo-deepViolet"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Event..." : "Create Event"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArtistCreateEvent;
