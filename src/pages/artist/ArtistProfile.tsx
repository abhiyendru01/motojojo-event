
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
import { Instagram, Music, Upload, X } from "lucide-react";

interface ArtistForm {
  name: string;
  artist_type: string;
  bio: string;
  instagram_handle?: string;
  spotify_handle?: string;
  profile_picture?: string;
  portfolio_images?: string[];
  cities?: string[];
}

const ARTIST_TYPES = [
  "Musician", "Band", "DJ", "Comedian", "Actor", "Director",
  "Dancer", "Painter", "Photographer", "Writer", "Chef", "Other"
];

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
  "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Surat"
];

const ArtistProfile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState<ArtistForm>({
    name: "",
    artist_type: "",
    bio: "",
    instagram_handle: "",
    spotify_handle: "",
    portfolio_images: [],
    cities: []
  });
  const [existingProfile, setExistingProfile] = useState<boolean>(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [portfolioImageFiles, setPortfolioImageFiles] = useState<File[]>([]);
  const [portfolioImagePreviews, setPortfolioImagePreviews] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
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
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching artist profile:', error);
          throw error;
        }
        
        if (data) {
          console.log("Found artist profile:", data);
          setExistingProfile(true);
          setForm({
            name: data.name || "",
            artist_type: data.artist_type || "",
            bio: data.bio || "",
            instagram_handle: data.instagram_handle || "",
            spotify_handle: data.spotify_handle || "",
            portfolio_images: data.portfolio_images || [],
            cities: data.cities || []
          });
          
          setSelectedCities(data.cities || []);
          
          if (data.profile_picture) {
            setProfilePicturePreview(data.profile_picture);
          }
          
          if (data.portfolio_images && data.portfolio_images.length > 0) {
            setPortfolioImagePreviews(data.portfolio_images);
          }
        } else {
          console.log("No artist profile found, creating new");
          if (user.fullName) {
            setForm(prev => ({ ...prev, name: user.fullName || "" }));
          }
        }
      } catch (error) {
        console.error('Error in fetchArtistProfile:', error);
        toast.error("Failed to load your profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArtistProfile();
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setForm(prev => ({ ...prev, artist_type: value }));
  };

  const handleCityToggle = (city: string) => {
    setSelectedCities(prev => {
      const newCities = prev.includes(city)
        ? prev.filter(c => c !== city)
        : [...prev, city];
      
      // Update form cities as well
      setForm(prevForm => ({
        ...prevForm,
        cities: newCities
      }));
      
      return newCities;
    });
  };

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicturePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setPortfolioImageFiles(prev => [...prev, ...files]);
      
      const newPreviews: string[] = [];
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newPreviews.push(event.target?.result as string);
          if (newPreviews.length === files.length) {
            setPortfolioImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePortfolioImage = (index: number) => {
    setPortfolioImagePreviews(prev => prev.filter((_, i) => i !== index));
    setPortfolioImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    // Create the bucket if it doesn't exist
    try {
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
    } catch (error) {
      console.error("Error checking/creating bucket:", error);
    }
    
    const uploadedUrls: string[] = [];
    
    // Upload profile picture if exists
    if (profilePictureFile) {
      const fileExt = profilePictureFile.name.split('.').pop();
      const fileName = `profile_${user?.id}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('artist-images')
        .upload(filePath, profilePictureFile);
        
      if (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('artist-images')
        .getPublicUrl(filePath);
        
      form.profile_picture = data.publicUrl;
    }
    
    // Upload portfolio images if exist
    if (portfolioImageFiles.length > 0) {
      for (const file of portfolioImageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `portfolio_${user?.id}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `portfolio-images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('artist-images')
          .upload(filePath, file);
          
        if (uploadError) {
          console.error("Error uploading portfolio image:", uploadError);
          continue; // Skip this image but continue with others
        }
        
        const { data } = supabase.storage
          .from('artist-images')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(data.publicUrl);
      }
    }
    
    // Combine existing portfolio image URLs with new ones
    const existingUrls = form.portfolio_images?.filter(url => 
      !portfolioImagePreviews.includes(url) || 
      portfolioImagePreviews.indexOf(url) < portfolioImagePreviews.length - portfolioImageFiles.length
    ) || [];
    
    form.portfolio_images = [...existingUrls, ...uploadedUrls];
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("User not authenticated");
      return;
    }
    
    // Validate form
    if (!form.name || !form.artist_type || !form.bio) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      toast.info("Saving your profile...");
      
      // Upload images
      if (profilePictureFile || portfolioImageFiles.length > 0) {
        await uploadImages();
      }
      
      // If user hasn't changed the profile picture, keep the existing one
      if (!profilePictureFile && profilePicturePreview && !profilePicturePreview.startsWith('data:')) {
        form.profile_picture = profilePicturePreview;
      }
      
      // Add any existing portfolio images that weren't changed
      if (portfolioImagePreviews.length > portfolioImageFiles.length) {
        const existingImages = portfolioImagePreviews
          .slice(0, portfolioImagePreviews.length - portfolioImageFiles.length)
          .filter(url => !url.startsWith('data:'));
          
        form.portfolio_images = [...(form.portfolio_images || []), ...existingImages];
      }
      
      // Save artist profile
      const profileData: any = {
        ...form,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };
      
      if (!existingProfile) {
        profileData.created_at = new Date().toISOString();
      }
      
      console.log("Saving profile data:", profileData);
      
      let result;
      if (existingProfile) {
        result = await supabase
          .from('artist_profiles')
          .update(profileData)
          .eq('user_id', user.id);
      } else {
        result = await supabase
          .from('artist_profiles')
          .insert(profileData);
      }
      
      if (result.error) {
        console.error("Error saving profile:", result.error);
        throw result.error;
      }
      
      toast.success("Profile saved successfully!");
      navigate("/artist/dashboard");
      
    } catch (error) {
      console.error('Error saving artist profile:', error);
      toast.error("Failed to save profile: " + (error as Error).message);
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
        <h1 className="text-3xl font-bold">Artist Profile</h1>
        <p className="text-muted-foreground">
          {existingProfile ? "Update your profile information" : "Complete your artist profile to get started"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Tell us about yourself as an artist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Artist Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Your stage name or band name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="artist_type">Artist Type</Label>
                <Select 
                  value={form.artist_type} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select artist type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ARTIST_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleInputChange}
                placeholder="A short biography about you"
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Cities You Perform In</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {CITIES.map(city => (
                  <Button
                    key={city}
                    type="button"
                    variant={selectedCities.includes(city) ? "default" : "outline"}
                    className={selectedCities.includes(city) ? "bg-motojojo-violet hover:bg-motojojo-deepViolet" : ""}
                    onClick={() => handleCityToggle(city)}
                  >
                    {city}
                  </Button>
                ))}
              </div>
              {selectedCities.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Select at least one city where you perform
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>
              Connect your social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="instagram_handle">Instagram Handle</Label>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center px-3 border border-r-0 rounded-l-md">
                    <Instagram className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="instagram_handle"
                    name="instagram_handle"
                    value={form.instagram_handle || ""}
                    onChange={handleInputChange}
                    className="rounded-l-none"
                    placeholder="Your Instagram username"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="spotify_handle">Spotify Handle</Label>
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center px-3 border border-r-0 rounded-l-md">
                    <Music className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="spotify_handle"
                    name="spotify_handle"
                    value={form.spotify_handle || ""}
                    onChange={handleInputChange}
                    className="rounded-l-none"
                    placeholder="Your Spotify artist ID"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Upload a profile picture to represent yourself
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-4">
              {profilePicturePreview ? (
                <div className="relative w-full max-w-md">
                  <img 
                    src={profilePicturePreview} 
                    alt="Profile preview" 
                    className="w-32 h-32 object-cover rounded-full" 
                  />
                  <Button 
                    type="button"
                    variant="secondary" 
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => {
                      setProfilePictureFile(null);
                      setProfilePicturePreview(null);
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
                    htmlFor="profile-picture" 
                    className="cursor-pointer bg-muted hover:bg-muted/80 px-4 py-2 rounded-md"
                  >
                    Select Image
                  </Label>
                </>
              )}
              <Input 
                id="profile-picture" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Recommended size: 400 x 400 pixels. Maximum file size: 5MB.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Images</CardTitle>
            <CardDescription>
              Showcase your best work with portfolio images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-4">
              {portfolioImagePreviews.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center">
                  {portfolioImagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <img 
                        src={preview} 
                        alt={`Portfolio preview ${index}`} 
                        className="w-full h-full object-cover rounded-md" 
                      />
                      <Button 
                        type="button"
                        variant="secondary" 
                        size="icon"
                        className="absolute top-1 right-1 rounded-full"
                        onClick={() => removePortfolioImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-center">
                    Drag and drop images, or click to browse
                  </p>
                  <Label 
                    htmlFor="portfolio-images" 
                    className="cursor-pointer bg-muted hover:bg-muted/80 px-4 py-2 rounded-md"
                  >
                    Select Images
                  </Label>
                </>
              )}
              <Input 
                id="portfolio-images" 
                type="file" 
                className="hidden" 
                accept="image/*"
                multiple
                onChange={handlePortfolioImageChange}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              You can upload multiple images. Recommended size: 800 x 600 pixels. Maximum file size: 5MB per image.
            </p>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-motojojo-violet hover:bg-motojojo-deepViolet"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (existingProfile ? "Updating Profile..." : "Creating Profile...") 
              : (existingProfile ? "Update Profile" : "Create Profile")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArtistProfile;
