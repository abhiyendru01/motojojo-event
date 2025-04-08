
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Event categories
const experienceTypes = [
  "Addebazi", 
  "Local Gathering", 
  "Kitchen Gathering", 
  "Musical Night", 
  "Poetry Session", 
  "Comedy Show"
];

// Available cities
const cities = [
  "Mumbai", 
  "Delhi", 
  "Bangalore", 
  "Hyderabad", 
  "Chennai", 
  "Kolkata", 
  "Pune", 
  "Jaipur"
];

const AdminEvents = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    location: '',
    city: '',
    experienceType: '',
    maxCapacity: '',
    price: '',
    description: '',
  });
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleArtist = (artist: string) => {
    setSelectedArtists(prev => 
      prev.includes(artist) 
        ? prev.filter(a => a !== artist) 
        : [...prev, artist]
    );
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `events/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('motojojo')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('motojojo')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Upload image
      let imageUrl = null;
      if (mainImage) {
        imageUrl = await uploadImage(mainImage);
        if (!imageUrl) {
          throw new Error('Failed to upload image');
        }
      }
      
      // Insert event data
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          title: formData.eventName,
          description: formData.description,
          date: formData.eventDate,
          time: formData.eventTime,
          location: formData.location,
          city: formData.city,
          category: formData.experienceType,
          max_capacity: parseInt(formData.maxCapacity),
          price: parseInt(formData.price),
          image_url: imageUrl
        })
        .select();
        
      if (eventError) {
        throw eventError;
      }
      
      // Add artists
      if (selectedArtists.length > 0 && eventData && eventData.length > 0) {
        const artistsToInsert = selectedArtists.map(artist => ({
          event_id: eventData[0].id,
          artist_name: artist
        }));
        
        const { error: artistsError } = await supabase
          .from('event_artists')
          .insert(artistsToInsert);
          
        if (artistsError) {
          throw artistsError;
        }
      }
      
      // Success
      toast({
        title: "Event Created!",
        description: `${formData.eventName} has been successfully created and is now live on the website.`,
      });
      
      // Reset the form
      setFormData({
        eventName: '',
        eventDate: '',
        eventTime: '',
        location: '',
        city: '',
        experienceType: '',
        maxCapacity: '',
        price: '',
        description: '',
      });
      setSelectedArtists([]);
      setMainImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Error Creating Event",
        description: error.message || "There was an error creating your event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fetch available artists
  const [artists, setArtists] = useState([
    "Ravi Sharma", 
    "Priya Desai", 
    "Arjun Kapoor", 
    "Sneha Patel", 
    "Vikram Singh", 
    "Meera Joshi", 
    "Rahul Verma"
  ]);
  
  return (
    <AdminLayout title="Add New Event">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Name */}
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Event Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Date</Label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventTime">Time</Label>
                <Input
                  id="eventTime"
                  name="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select
                onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                value={formData.city}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Experience Type */}
            <div className="space-y-2">
              <Label htmlFor="experienceType">Experience Type</Label>
              <Select
                onValueChange={(value) => setFormData(prev => ({ ...prev, experienceType: value }))}
                value={formData.experienceType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {experienceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Capacity & Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Max Capacity</Label>
                <Input
                  id="maxCapacity"
                  name="maxCapacity"
                  type="number"
                  min="1"
                  value={formData.maxCapacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            {/* Artists */}
            <div className="space-y-2 md:col-span-2">
              <Label>Artists</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {artists.map(artist => (
                  <div 
                    key={artist} 
                    onClick={() => toggleArtist(artist)}
                    className={`
                      p-2 border rounded-md cursor-pointer text-sm transition-colors
                      ${selectedArtists.includes(artist) 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'border-gray-200 hover:bg-gray-100'
                      }
                    `}
                  >
                    {artist}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Image Uploads */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mainImage">Main Event Image</Label>
              <Input 
                id="mainImage" 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileChange}
                required
              />
              {mainImage && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">
                    Selected file: {mainImage.name}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
