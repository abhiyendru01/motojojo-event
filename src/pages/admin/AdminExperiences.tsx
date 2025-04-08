
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

// Experience types
const experienceTypes = [
  "Workshop", 
  "Travel", 
  "Retreat", 
  "Food Tour", 
  "Cultural Experience", 
  "Adventure", 
  "Wellness"
];

const AdminExperiences = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    type: '',
    priceRangeMin: '',
    priceRangeMax: '',
    duration: '',
    durationUnit: 'hours',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `experiences/${fileName}`;
      
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
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) {
          throw new Error('Failed to upload image');
        }
      }
      
      // Insert experience data
      const { error } = await supabase
        .from('experiences')
        .insert({
          title: formData.title,
          description: formData.description,
          city: formData.city,
          type: formData.type,
          price_min: parseInt(formData.priceRangeMin),
          price_max: parseInt(formData.priceRangeMax),
          duration: parseFloat(formData.duration),
          duration_unit: formData.durationUnit,
          image_url: imageUrl
        });
        
      if (error) {
        throw error;
      }
      
      // Success
      toast({
        title: "Experience Created!",
        description: `${formData.title} has been successfully created and is now live on the website.`,
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        city: '',
        type: '',
        priceRangeMin: '',
        priceRangeMax: '',
        duration: '',
        durationUnit: 'hours',
      });
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Error Creating Experience",
        description: error.message || "There was an error creating your experience. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminLayout title="Add New Experience">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Experience Title */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Experience Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
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
              <Label htmlFor="type">Experience Type</Label>
              <Select
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                value={formData.type}
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
            
            {/* Price Range */}
            <div className="space-y-2">
              <Label>Price Range (₹)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    id="priceRangeMin"
                    name="priceRangeMin"
                    placeholder="Min"
                    type="number"
                    min="0"
                    value={formData.priceRangeMin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Input
                    id="priceRangeMax"
                    name="priceRangeMax"
                    placeholder="Max"
                    type="number"
                    min="0"
                    value={formData.priceRangeMax}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Duration */}
            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Select
                    onValueChange={(value) => setFormData(prev => ({ ...prev, durationUnit: value }))}
                    value={formData.durationUnit}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Image Upload */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Experience Image</Label>
              <Input 
                id="image" 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileChange}
                required 
              />
              {imageFile && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">
                    Selected file: {imageFile.name}
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
            {isSubmitting ? 'Creating Experience...' : 'Create Experience'}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminExperiences;
