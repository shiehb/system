import banner1 from "@/assets/banner1.png";
import { LoadingWave } from "@/components/ui/loading-wave";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import type { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ProfileInfoProps {
  profileData: any;
  isLoading: boolean;
  isUpdating: boolean;
  onUpdate: (values: {
    current_password?: string;
    new_password?: string;
    avatar?: File;
  }) => Promise<void>;
  onLogout: () => Promise<void>;
}

// Utility function for canvas preview
async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);

  ctx.imageSmoothingQuality = "high";

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
    crop.height * scaleY
  );
}

// Function to center the crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const avatarFormSchema = z.object({
  avatar: z.instanceof(File).optional(),
});

type AvatarFormValues = z.infer<typeof avatarFormSchema>;

export function ProfileInfo({
  profileData: profile,
  isLoading,
  isUpdating,
  onUpdate,
  onLogout,
}: ProfileInfoProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const form = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarFormSchema),
  });

  const handleAvatarSubmit = async (data: AvatarFormValues) => {
    if (!data.avatar || !completedCrop) return;

    try {
      // Get the cropped image from canvas
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      canvas.toBlob(
        async (blob) => {
          if (!blob) return;

          const croppedFile = new File([blob], "avatar.jpg", {
            type: "image/jpeg",
          });

          await onUpdate({ avatar: croppedFile });
          setIsAvatarDialogOpen(false);
          setAvatarPreview(null);
          setCrop(undefined);
        },
        "image/jpeg",
        0.2
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update avatar");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingWave message="Loading profile..." />
      </div>
    );
  }

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
      <div className="relative md:h-50 lg:h-80 bg-gradient-to-r from--500 to-light-600 rounded-t-lg overflow-hidden shadow-md">
        <img src={banner1} alt="Cover" className="w-full h-full object-cover" />
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
                {profile.first_name?.[0]}
                {profile.last_name?.[0]}
              </AvatarFallback>
            </Avatar>

            {/* Avatar Dialog */}
            <Dialog
              open={isAvatarDialogOpen}
              onOpenChange={setIsAvatarDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`absolute bottom-2 right-2 rounded-full bg-white hover:bg-gray-100 p-2 shadow-md transition-all ${
                    isAvatarHovered
                      ? "opacity-100 scale-110"
                      : "opacity-0 scale-95"
                  } group-hover:opacity-100 group-hover:scale-110`}
                  onMouseEnter={() => setIsAvatarHovered(true)}
                  onMouseLeave={() => setIsAvatarHovered(false)}
                >
                  <Camera className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Change Profile Photo
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleAvatarSubmit)}
                    className="space-y-6"
                  >
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
                              style={{ maxWidth: "100%", maxHeight: "300px" }}
                              onLoad={(e) => {
                                const { width, height } = e.currentTarget;
                                setCrop(centerAspectCrop(width, height, 1));
                              }}
                            />
                          </ReactCrop>
                          <canvas
                            ref={previewCanvasRef}
                            style={{
                              display: "none",
                              objectFit: "contain",
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
                            {profile.first_name?.[0]}
                            {profile.last_name?.[0]}
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
                                          const previewUrl =
                                            URL.createObjectURL(file);
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
                        disabled={
                          isUpdating || !avatarPreview || !completedCrop
                        }
                      >
                        {isUpdating && <LoadingWave message="Uploading..." />}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="mt-6 rounded-lg shadow-sm">
          <CardHeader>
            <CardDescription className="text-lg font-bold text-foreground">
              <div>
                <span className="text-muted-foreground">Name: </span>
                {profile.last_name}, {profile.first_name} {profile.middle_name}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {profile.email && (
              <div>
                <span className="p-2 text-base font-medium text-right">
                  Email:
                </span>
                <span>{profile.email}</span>
              </div>
            )}

            {profile.user_level && (
              <div>
                <span className="p-2 text-base font-medium text-right">
                  User Level:
                </span>
                <span>{profile.user_level}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
