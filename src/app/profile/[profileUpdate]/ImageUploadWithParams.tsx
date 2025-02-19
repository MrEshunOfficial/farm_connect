import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  onImageChange: (imageData: { url: string; fileName: string }) => void;
  initialImage?: string;
  size?: "sm" | "md" | "lg";
  shape?: "square" | "rounded" | "circle";
  maxSize?: number;
  acceptedTypes?: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showHelper?: boolean;
  showProgress?: boolean;
  progressColor?: string;
  errorMessages?: {
    sizeError?: string;
    typeError?: string;
    uploadError?: string;
  };
  customStyles?: {
    container?: string;
    dropzone?: string;
    placeholder?: string;
    removeButton?: string;
  };
}

const defaultErrorMessages = {
  sizeError: "Please select an image under SIZE_LIMIT",
  typeError: "Please upload a valid image file",
  uploadError: "Failed to upload image. Please try again",
};

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

const ImageUploadWithParams: React.FC<ImageUploadProps> = ({
  onImageChange,
  initialImage,
  size = "md",
  shape = "rounded",
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif"],
  placeholder = "Drag & drop or click to upload",
  disabled = false,
  className = "w-full flex flex-col gap-2 items-center",
  showHelper = true,
  showProgress = true,
  progressColor = "blue",
  errorMessages = defaultErrorMessages,
  customStyles = {},
}) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialImage
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUploadProgress = () => {
    if (!showProgress) return;
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

  const validateFile = (file: File): boolean => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        title: "File too large",
        description: errorMessages.sizeError?.replace(
          "SIZE_LIMIT",
          `${maxSize}MB`
        ),
        variant: "destructive",
      });
      return false;
    }

    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: errorMessages.typeError,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleImageUpload = (file: File) => {
    if (!validateFile(file)) return;

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
        description: errorMessages.uploadError,
        variant: "destructive",
      });
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
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
      className={`relative ${className} ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${customStyles.container || ""}`}
    >
      <div
        className={`relative ${sizeClasses[size]} ${
          shapeClasses[shape]
        } overflow-hidden group ${disabled ? "pointer-events-none" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <motion.div
          animate={{
            scale: isDragging ? 1.02 : 1,
            borderColor: isDragging ? "rgb(59, 130, 246)" : "transparent",
          }}
          className={`w-full h-full border-2 border-dashed bg-gray-50 dark:bg-gray-800 transition-colors duration-200
            ${
              isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
            }
            ${customStyles.dropzone || ""}`}
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
                className={`w-full h-full flex flex-col items-center justify-center p-4 ${
                  customStyles.placeholder || ""
                }`}
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  {placeholder}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence>
            {!isLoading && !disabled && (
              <motion.label
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                htmlFor="file-upload"
                className={`cursor-pointer flex items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-lg
                  p-3 transform transition-transform duration-200 hover:scale-110
                  ${
                    imagePreview
                      ? "opacity-0 group-hover:opacity-100"
                      : "opacity-100"
                  }`}
              >
                <Upload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept={acceptedTypes.join(",")}
                  onChange={handleFileChange}
                  disabled={disabled}
                />
              </motion.label>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isLoading && showProgress && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center"
            >
              <Loader2
                className={`w-8 h-8 text-${progressColor} animate-spin mb-2`}
              />
              <div className="w-3/4 bg-gray-200 rounded-full h-1.5 mb-1">
                <motion.div
                  className={`h-1.5 rounded-full bg-${progressColor}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className={`text-xs text-${progressColor}`}>
                {uploadProgress}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {imagePreview && !isLoading && !disabled && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleRemoveImage}
              className={`absolute top-2 right-8 p-1.5 bg-red-500 text-white rounded-full
                opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg
                ${customStyles.removeButton || ""}`}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {showHelper && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500 mt-2 text-center"
        >
          Supported formats:{" "}
          {acceptedTypes
            .map((type) => type.split("/")[1].toUpperCase())
            .join(", ")}{" "}
          (max {maxSize}MB)
        </motion.p>
      )}
    </motion.div>
  );
};

export default ImageUploadWithParams;
