import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { LoadingWave } from "@/components/ui/loading-wave";
import { useAvatarEditor } from "@/hooks/useAvatarEditor";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface AvatarEditorProps {
  avatarUrl?: string;
  initials: string;
  isUpdating: boolean;
  onSave: (file: File) => Promise<void>;
}

export const AvatarEditor = ({
  avatarUrl,
  initials,
  isUpdating,
  onSave,
}: AvatarEditorProps) => {
  const {
    avatarPreview,
    isAvatarHovered,
    isAvatarDialogOpen,
    crop,
    completedCrop,
    imgRef,
    previewCanvasRef,
    setIsAvatarHovered,
    setIsAvatarDialogOpen,
    setCrop,
    setCompletedCrop,
    centerAspectCrop,
    handleFileChange,
    resetAvatarEditor,
    drawImageOnCanvas,
  } = useAvatarEditor();

  const handleSave = async () => {
    if (
      !completedCrop ||
      !imgRef.current ||
      !previewCanvasRef.current ||
      !avatarPreview
    ) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;

    // Ensure the image is loaded
    if (!image.complete) {
      await new Promise((resolve) => {
        image.onload = resolve;
      });
    }

    // Draw the cropped image on canvas
    drawImageOnCanvas(image, canvas, completedCrop);

    // Create blob from canvas
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], "avatar.jpg", {
          type: "image/jpeg",
        });
        await onSave(croppedFile);
        resetAvatarEditor();
      },
      "image/jpeg",
      0.9 // Quality (0-1)
    );
  };

  return (
    <div className="relative -mt-30 group">
      <Avatar className="w-50 h-50 border-4 border-white shadow-xl">
        <AvatarImage
          src={avatarUrl || "/default-avatar.png"}
          alt="Avatar"
          className="object-cover"
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <Button
        variant="outline"
        size="icon"
        className={`absolute bottom-2 right-2 rounded-full bg-white hover:bg-gray-100 p-2 shadow-md transition-all ${
          isAvatarHovered ? "opacity-100 scale-110" : "opacity-0 scale-95"
        } group-hover:opacity-100 group-hover:scale-110`}
        onMouseEnter={() => setIsAvatarHovered(true)}
        onMouseLeave={() => setIsAvatarHovered(false)}
        onClick={() => setIsAvatarDialogOpen(true)}
      >
        <Camera className="w-5 h-5" />
      </Button>

      {isAvatarDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Change Profile Photo</h2>
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
                    }}
                  />
                </div>
              ) : (
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={avatarUrl || "/default-avatar.png"}
                    alt="Profile Avatar"
                    className="object-cover"
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              )}
              <div className="w-full">
                <label className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(file);
                    }}
                  />
                </label>
                <p className="text-sm text-muted-foreground mt-2">
                  JPG, GIF or PNG. Max size 5MB
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button variant="outline" onClick={resetAvatarEditor}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUpdating || !avatarPreview || !completedCrop}
              >
                {isUpdating && <LoadingWave message="Uploading..." />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
