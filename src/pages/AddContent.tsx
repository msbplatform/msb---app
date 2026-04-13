
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Image, Video, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AddContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    campaignName: "",
    description: "",
    contentType: "video" as "video" | "image",
    donationGoal: "",
    isPublic: true
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = formData.contentType === "video" 
      ? ["video/mp4", "video/quicktime"]
      : ["image/png", "image/jpeg", "image/jpg"];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrors(prev => ({ 
        ...prev, 
        file: `Please upload a valid ${formData.contentType} file (${formData.contentType === "video" ? "MP4, MOV" : "PNG, JPG"})` 
      }));
      return;
    }

    // Validate file size (50MB for videos, 10MB for images)
    const maxSize = formData.contentType === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setErrors(prev => ({ 
        ...prev, 
        file: `File size must be less than ${formData.contentType === "video" ? "50MB" : "10MB"}` 
      }));
      return;
    }

    setFile(selectedFile);
    setErrors(prev => ({ ...prev, file: "" }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.campaignName.trim()) {
      newErrors.campaignName = "Campaign name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!file) {
      newErrors.file = "Please upload your content";
    }

    if (!formData.donationGoal.trim()) {
      newErrors.donationGoal = "Donation goal is required";
    } else if (isNaN(Number(formData.donationGoal)) || Number(formData.donationGoal) <= 0) {
      newErrors.donationGoal = "Please enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check all required fields and try again.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a campaign.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to Supabase storage
      const fileExt = file?.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `campaign-content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('campaign-content')
        .upload(filePath, file!);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('campaign-content')
        .getPublicUrl(filePath);

      // Create campaign record
      const { data, error } = await supabase
        .from('campaigns')
        .insert([
          {
            title: formData.campaignName,
            description: formData.description,
            content_url: publicUrl,
            content_type: formData.contentType,
            donation_goal: parseFloat(formData.donationGoal),
            is_public: formData.isPublic,
            creator_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Campaign published successfully!",
        description: formData.isPublic 
          ? "Your campaign is now live and ready to receive donations."
          : "Your private campaign has been created. You can view it in your profile.",
      });

      // Navigate to the new campaign
      navigate(`/campaign/${data.id}`);
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Campaign</h1>
            <p className="text-gray-600">Share your talent and connect with supporters</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campaign Name */}
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name *</Label>
                  <Input
                    id="campaignName"
                    value={formData.campaignName}
                    onChange={(e) => handleInputChange("campaignName", e.target.value)}
                    placeholder="e.g., Street Dance Performance"
                    className={errors.campaignName ? "border-red-500" : ""}
                  />
                  {errors.campaignName && (
                    <p className="text-red-500 text-sm">{errors.campaignName}</p>
                  )}
                  <p className="text-gray-500 text-sm">Choose a catchy name that describes your talent</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Tell your story and what makes your talent special..."
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                  <p className="text-gray-500 text-sm">Share your passion and connect with your audience</p>
                </div>

                {/* Content Type */}
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={formData.contentType === "video" ? "default" : "outline"}
                      onClick={() => {
                        handleInputChange("contentType", "video");
                        setFile(null);
                        setFilePreview(null);
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Video className="w-4 h-4" />
                      <span>Video</span>
                    </Button>
                    <Button
                      type="button"
                      variant={formData.contentType === "image" ? "default" : "outline"}
                      onClick={() => {
                        handleInputChange("contentType", "image");
                        setFile(null);
                        setFilePreview(null);
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Image className="w-4 h-4" />
                      <span>Image</span>
                    </Button>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Upload Content *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {filePreview ? (
                      <div className="space-y-4">
                        {formData.contentType === "video" ? (
                          <video
                            src={filePreview}
                            controls
                            className="w-full max-w-md mx-auto rounded-lg"
                          />
                        ) : (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-full max-w-md mx-auto rounded-lg"
                          />
                        )}
                        <p className="text-sm text-gray-600">{file?.name}</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setFile(null);
                            setFilePreview(null);
                          }}
                        >
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            Upload your {formData.contentType}
                          </p>
                          <p className="text-gray-500">
                            {formData.contentType === "video" 
                              ? "MP4, MOV up to 50MB" 
                              : "PNG, JPG up to 10MB"
                            }
                          </p>
                        </div>
                        <Input
                          type="file"
                          accept={formData.contentType === "video" ? "video/mp4,video/quicktime" : "image/png,image/jpeg,image/jpg"}
                          onChange={handleFileUpload}
                          className="max-w-xs mx-auto"
                        />
                      </div>
                    )}
                  </div>
                  {errors.file && (
                    <p className="text-red-500 text-sm">{errors.file}</p>
                  )}
                </div>

                {/* Donation Goal */}
                <div className="space-y-2">
                  <Label htmlFor="donationGoal">Donation Goal (£) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                    <Input
                      id="donationGoal"
                      type="number"
                      min="1"
                      value={formData.donationGoal}
                      onChange={(e) => handleInputChange("donationGoal", e.target.value)}
                      placeholder="200"
                      className={`pl-8 ${errors.donationGoal ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.donationGoal && (
                    <p className="text-red-500 text-sm">{errors.donationGoal}</p>
                  )}
                  <p className="text-gray-500 text-sm">Set a realistic goal for your campaign</p>
                </div>

                {/* Visibility */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Visibility</Label>
                    <p className="text-sm text-gray-500">
                      {formData.isPublic ? "Public - visible to everyone" : "Private - only visible to you"}
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 text-lg"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing Campaign...
                    </>
                  ) : (
                    "Publish Campaign"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddContent;
