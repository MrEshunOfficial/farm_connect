import React, { useState, useEffect } from "react";
import { Upload, Loader2, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

interface ImageUploadProps {
  onImageChange: (imageData: { url: string; fileName: string }) => void;
  initialImage?: string;
  size?: "sm" | "md" | "lg";
  shape?: "square" | "rounded" | "circle";
  isUpdating?: boolean;
}

const sizeClasses = {
  sm: "w-24 h-24",
  md: "w-32 h-32",
  lg: "w-40 h-40",
};

const shapeClasses = {
  square: "rounded-lg",
  rounded: "rounded-2xl",
  circle: "rounded-full",
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageChange,
  initialImage,
  size = "md",
  shape = "rounded",
  isUpdating = false,
}) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialImage
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (initialImage && initialImage !== imagePreview) {
      setImagePreview(initialImage);
    }
  }, [initialImage, imagePreview]);

  const simulateUploadProgress = () => {
    setIsLoading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleImageUpload = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    simulateUploadProgress();
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      onImageChange({
        url: base64,
        fileName: file.name,
      });
    };

    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "Please try again with a different image",
        variant: "destructive",
      });
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please drop an image file",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(undefined);
    onImageChange({ url: "", fileName: "" });
  };

  return (
    <div className="space-y-2">
      <div
        className={`
          relative ${sizeClasses[size]} ${shapeClasses[shape]}
          transition-all duration-200 ease-in-out
          overflow-hidden
          ${isDragging ? "ring-2 ring-blue-500 ring-offset-2" : ""}
          group
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Image Container */}
        {imagePreview ? (
          <div className="w-full h-full">
            <Image
              src={imagePreview}
              alt="Upload preview"
              className={`w-full h-full object-cover ${shapeClasses[shape]}`}
              layout="fill"
              objectFit="cover"
            />

            {/* Image Overlay - Appears on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {!isLoading && (
                <>
                  {/* Upload New Button */}
                  <label
                    htmlFor="file-upload"
                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer mr-2 hover:bg-gray-100 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-gray-700" />
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>

                  {/* Remove Button */}
                  <button
                    onClick={handleRemoveImage}
                    className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Upload Placeholder */
          <label
            htmlFor="file-upload-empty"
            className={`
              w-full h-full flex flex-col items-center justify-center
              border-2 border-dashed border-gray-300 dark:border-gray-600
              bg-gray-50 dark:bg-gray-800 cursor-pointer
              hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
              ${
                isDragging
                  ? "border-blue-500 bg-blue-50/20 dark:bg-blue-900/10"
                  : ""
              }
            `}
          >
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              {isUpdating
                ? "Update image"
                : "Drop image here or click to upload"}
            </p>
            <input
              id="file-upload-empty"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin mb-2" />
            <div className="w-2/3 bg-gray-700 rounded-full h-1">
              <div
                className="h-1 rounded-full bg-white transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 text-center">
        {isUpdating ? "Update your image (max 5MB)" : "JPG, PNG, GIF · Max 5MB"}
      </p>
    </div>
  );
};

export default ImageUpload;
