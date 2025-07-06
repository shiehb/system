import { useState, useRef } from "react";
import { centerCrop, makeAspectCrop } from "react-image-crop";
import type { Crop, PixelCrop } from "react-image-crop";

export const useAvatarEditor = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const centerAspectCrop = (
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
  ) => {
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
  };

  const handleFileChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const resetAvatarEditor = () => {
    setAvatarPreview(null);
    setCrop(undefined);
    setIsAvatarDialogOpen(false);
  };

  return {
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
  };
};

export default useAvatarEditor;
