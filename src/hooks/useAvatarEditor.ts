"use client";

import { useState, useRef, useCallback } from "react";
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

  const centerAspectCrop = useCallback(
    (mediaWidth: number, mediaHeight: number, aspect: number) => {
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
    },
    []
  );

  const handleFileChange = useCallback((file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  }, []);

  const resetAvatarEditor = useCallback(() => {
    setIsAvatarDialogOpen(false);
    setAvatarPreview(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, []);

  const drawImageOnCanvas = useCallback(
    (image: HTMLImageElement, canvas: HTMLCanvasElement, crop: PixelCrop) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

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
    },
    []
  );

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
    drawImageOnCanvas,
  };
};
