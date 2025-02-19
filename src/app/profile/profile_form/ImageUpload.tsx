import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ImageUploadProps {
  onImageChange: (imageData: { url: string; fileName: string }) => void;
  initialImage?: string;
  size?: "sm" | "md" | "lg";
  shape?: "square" | "rounded" | "circle";
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
}) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialImage
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div
        className={`relative ${sizeClasses[size]} ${shapeClasses[shape]} overflow-hidden group`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Main Container */}
        <motion.div
          animate={{
            scale: isDragging ? 1.02 : 1,
            borderColor: isDragging ? "rgb(59, 130, 246)" : "transparent",
          }}
          className={`
            w-full h-full border-2 border-dashed
            bg-gray-50 dark:bg-gray-800
            transition-colors duration-200
            ${
              isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
            }
          `}
        >
          <AnimatePresence mode="wait">
            {imagePreview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <Avatar className={`w-full h-full ${shapeClasses[shape]}`}>
                  <AvatarImage
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center p-4"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  Drag & drop or click to upload
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Overlay with Actions */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence>
            {!isLoading && (
              <motion.label
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                htmlFor="file-upload"
                className={`
                  cursor-pointer flex items-center justify-center
                  rounded-full bg-white dark:bg-gray-700 shadow-lg
                  p-3 transform transition-transform duration-200
                  hover:scale-110
                  ${
                    imagePreview
                      ? "opacity-0 group-hover:opacity-100"
                      : "opacity-100"
                  }
                `}
              >
                <Upload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </motion.label>
            )}
          </AnimatePresence>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center"
            >
              <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
              <div className="w-3/4 bg-gray-200 rounded-full h-1.5 mb-1">
                <motion.div
                  className="h-1.5 rounded-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-white">{uploadProgress}%</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Remove Button */}
        <AnimatePresence>
          {imagePreview && !isLoading && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full
                       opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-red-600 shadow-lg"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-gray-500 mt-2 text-center"
      >
        Supported formats: JPG, PNG, GIF (max 5MB)
      </motion.p>
    </motion.div>
  );
};

export default ImageUpload;
