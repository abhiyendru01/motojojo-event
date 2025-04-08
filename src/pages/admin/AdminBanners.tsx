import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from 'lucide-react';

// Mock data for existing banners
const mockBanners = [
  {
    id: 1,
    title: "Summer Music Festival",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    hasButton: true,
    buttonText: "Book Now",
    buttonLink: "/event/1",
  },
  {
    id: 2,
    title: "Cooking Workshop Series",
    imageUrl: "https://images.unsplash.com/photo-1428515613728-6b4607e44363?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    hasButton: false,
    buttonText: "",
    buttonLink: "",
  },
];

const AdminBanners = () => {
  const { toast } = useToast();
  const [banners, setBanners] = useState(mockBanners);
  const [formData, setFormData] = useState({
    title: '',
    hasButton: false,
    buttonText: '',
    buttonLink: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setPreviewImage(event.target.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!previewImage) {
      toast({
        title: "Error",
        description: "Please upload an image for the banner",
        variant: "destructive",
      });
      return;
    }
    
    // Create a new banner
    const newBanner = {
      id: banners.length + 1,
      title: formData.title,
      imageUrl: previewImage,
      hasButton: formData.hasButton,
      buttonText: formData.buttonText,
      buttonLink: formData.buttonLink,
    };
    
    // Add to list
    setBanners([...banners, newBanner]);
    
    // Show success message
    toast({
      title: "Banner Added!",
      description: `${formData.title} has been successfully added.`,
    });
    
    // Reset form
    setFormData({
      title: '',
      hasButton: false,
      buttonText: '',
      buttonLink: '',
    });
    setPreviewImage(null);
    
    // Reset file input
    const fileInput = document.getElementById('bannerImage') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const deleteBanner = (id: number) => {
    setBanners(banners.filter(banner => banner.id !== id));
    
    toast({
      title: "Banner Deleted",
      description: "The banner has been removed.",
    });
  };
  
  return (
    <AdminLayout title="Upload Banner Poster">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form to add new banner */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Banner</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Banner Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Banner Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                {/* Banner Image */}
                <div className="space-y-2">
                  <Label htmlFor="bannerImage">Banner Image</Label>
                  <Input 
                    id="bannerImage" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    required
                  />
                  
                  {previewImage && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Preview:</p>
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-40 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
                
                {/* CTA Button Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasButton"
                    checked={formData.hasButton}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, hasButton: checked }))
                    }
                  />
                  <Label htmlFor="hasButton">Add Call-to-Action Button</Label>
                </div>
                
                {formData.hasButton && (
                  <div className="space-y-4">
                    {/* Button Text */}
                    <div className="space-y-2">
                      <Label htmlFor="buttonText">Button Text</Label>
                      <Input
                        id="buttonText"
                        name="buttonText"
                        value={formData.buttonText}
                        onChange={handleInputChange}
                        required={formData.hasButton}
                      />
                    </div>
                    
                    {/* Button Link */}
                    <div className="space-y-2">
                      <Label htmlFor="buttonLink">Button Link</Label>
                      <Input
                        id="buttonLink"
                        name="buttonLink"
                        value={formData.buttonLink}
                        onChange={handleInputChange}
                        required={formData.hasButton}
                      />
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <Button type="submit" className="w-full">
                  Upload Banner
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Existing banners */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Banners</h2>
          <div className="space-y-4">
            {banners.map(banner => (
              <Card key={banner.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{banner.title}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteBanner(banner.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    className="w-full h-32 object-cover rounded-md my-2"
                  />
                  {banner.hasButton && (
                    <div className="text-sm text-gray-600 mt-2">
                      <p>Button: {banner.buttonText}</p>
                      <p className="truncate">Link: {banner.buttonLink}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {banners.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No banners have been added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;
