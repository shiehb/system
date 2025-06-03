import banner1 from '@/assets/banner1.png'
import { LoadingWave } from "@/components/ui/loading-wave";
import { logout } from '@/endpoints/api';
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getMyProfile,
  updateProfile,
  updateAvatar,
} from "@/endpoints/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, Pencil, Eye, EyeOff, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import type {  Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Utility function for canvas preview
async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop
) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);

  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.drawImage(
    image,
    cropX,
    cropY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY,
  );
}

// Function to center the crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const profileFormSchema = z.object({
  current_password: z.string().optional(),
  new_password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .optional()
    .or(z.literal("")),
  confirm_password: z.string().optional(),
  avatar: z.instanceof(File).optional(),
}).superRefine((data, ctx) => {
  if (data.new_password) {
    if (!data.current_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Current password is required when changing password",
        path: ["current_password"],
      });
    }
    if (data.new_password !== data.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["confirm_password"],
      });
    }
  }
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileInfo() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getMyProfile();
        setProfile(data);
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (isDialogOpen) {
      form.reset({
        current_password: "",
        new_password: "",
        confirm_password: "",
        avatar: undefined,
      });
    }
  }, [isDialogOpen, form]);

  useEffect(() => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop
      );
    }
  }, [completedCrop]);

  const handleAvatarSubmit = async (data: ProfileFormValues) => {
    if (!data.avatar || !completedCrop) return;

    try {
      setIsLoading(true);
      
      // Get the cropped image from canvas
      const canvas = previewCanvasRef.current;
      if (!canvas) return;
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const croppedFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        
        const avatarResponse = await updateAvatar(croppedFile);
        setProfile(prev => ({
          ...prev,
          avatar_url: avatarResponse.avatar_url,
        }));
        toast.success("Avatar updated successfully");
        setIsAvatarDialogOpen(false);
        setAvatarPreview(null);
        setCrop(undefined);
      }, 'image/jpeg', 0.2);
    } catch (error: any) {
      toast.error(error.message || "Failed to update avatar");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (data: ProfileFormValues) => {
    if (!data.new_password) return;

    try {
      setIsLoading(true);
      await updateProfile({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      toast.success("Password updated successfully");

      form.reset({
        ...form.getValues(),
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      await logout();
      toast.success("Please login again with your new password");
      navigate("/login");
    } catch (error: any) {
      form.reset({
        ...form.getValues(),
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      toast.error(error.message || "Failed to update password");
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center py-20">
        <p>Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      {/* Cover Photo Section */}
      <div className="relative h-80 bg-gradient-to-r from--500 to-light-600 rounded-t-lg overflow-hidden shadow-md">
        <img
          src={banner1}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Header Section */}
      <div className="relative px-4">
        <div className="flex justify-between items-start">
          {/* Avatar with Edit Button */}
          <div className="relative -mt-30 group">
            <Avatar className="w-50 h-50 border-4 border-white shadow-xl">
              <AvatarImage
                src={profile?.avatar_url || "/default-avatar.png"}
                alt="Avatar"
                className="object-cover"
              />
              <AvatarFallback>
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </AvatarFallback>
            </Avatar>

            {/* Avatar Dialog */}
            <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className={`absolute bottom-2 right-2 rounded-full bg-white hover:bg-gray-100 p-2 shadow-md transition-all ${
                    isAvatarHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-95'
                  } group-hover:opacity-100 group-hover:scale-110`}
                  onMouseEnter={() => setIsAvatarHovered(true)}
                  onMouseLeave={() => setIsAvatarHovered(false)}
                >
                  <Camera className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">Change Profile Photo</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAvatarSubmit)} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      {avatarPreview ? (
                        <div className="flex flex-col items-center gap-4">
                          <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={1}
                            circularCrop
                            className="rounded-md overflow-hidden"
                          >
                            <img
                              ref={imgRef}
                              src={avatarPreview}
                              alt="Crop preview"
                              style={{ maxWidth: '100%', maxHeight: '300px' }}
                              onLoad={(e) => {
                                const { width, height } = e.currentTarget;
                                setCrop(centerAspectCrop(width, height, 1));
                              }}
                            />
                          </ReactCrop>
                          <canvas
                            ref={previewCanvasRef}
                            style={{
                              display: 'none',
                              objectFit: 'contain',
                              width: 150,
                              height: 150,
                            }}
                          />
                        </div>
                      ) : (
                        <Avatar className="w-32 h-32">
                          <AvatarImage
                            src={profile?.avatar_url || "/default-avatar.png"}
                            alt="Profile Avatar"
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {profile.first_name?.[0]}{profile.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <div className="flex flex-col items-center gap-2">
                                <Button variant="outline" asChild>
                                  <label className="cursor-pointer">
                                    Choose File
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const previewUrl = URL.createObjectURL(file);
                                          setAvatarPreview(previewUrl);
                                          field.onChange(file);
                                        }
                                      }}
                                    />
                                  </label>
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                  JPG, GIF or PNG. Max size 5MB
                                </p>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => {
                          setIsAvatarDialogOpen(false);
                          setAvatarPreview(null);
                          setCrop(undefined);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading || !avatarPreview || !completedCrop}
                      >
                        {isLoading && <LoadingWave message="Uploading..."/>}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Password Button */}
          <div className="mt-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  <span>Edit Password</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">Change Password</DialogTitle>
                  <DialogDescription>
                    Update your account password here
                  </DialogDescription>
                </DialogHeader>

                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    After saving, you'll be automatically logged out for security reasons.
                  </AlertDescription>
                </Alert>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="current_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={showCurrentPassword ? "text" : "password"}
                                  placeholder="Enter current password"
                                  {...field}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showCurrentPassword ? "Hide password" : "Show password"}
                                </span>
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="new_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Enter new password (min 8 characters)"
                                  {...field}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showNewPassword ? "Hide password" : "Show password"}
                                </span>
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirm_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm new password"
                                  {...field}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showConfirmPassword ? "Hide password" : "Show password"}
                                </span>
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading || !form.watch("new_password")}
                      >
                        {isLoading && <LoadingWave message="Please wait..."/>}
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Profile Info Section - 3 Column Layout */}
        <Card className="mt-6 rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {profile.first_name} {profile.last_name}
            </CardTitle>
            <p className="text-muted-foreground">{profile.email}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">ID Number</h3>
                  <p className="text-lg font-medium">{profile.id_number}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">User Level</h3>
                  <p className="text-lg font-medium capitalize">{profile.user_level}</p>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">First Name</h3>
                  <p className="text-lg font-medium">{profile.first_name}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">Last Name</h3>
                  <p className="text-lg font-medium">{profile.last_name}</p>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-4">
                {profile.middle_name && (
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Middle Name</h3>
                    <p className="text-lg font-medium">{profile.middle_name}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="text-lg font-medium capitalize">{profile.status}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}