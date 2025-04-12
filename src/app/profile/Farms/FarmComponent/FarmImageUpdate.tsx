import React, { useState, useRef, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { X, ImagePlus, UserIcon, Upload } from "lucide-react";
import { updateFarmProfile } from "@/store/farm.slice";
import { AppDispatch } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FarmImage {
  url: string;
  fileName: string;
}

interface FarmImageUploaderProps {
  farmId: string;
  existingImages?: FarmImage[];
  onClose?: () => void;
}

const FarmImageUploader: React.FC<FarmImageUploaderProps> = ({
  farmId,
  existingImages = [],
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localImages, setLocalImages] = useState<FarmImage[]>(existingImages);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (files: File[]) => {
    const fileReadPromises = files.map((file) => {
      return new Promise<FarmImage>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            url: reader.result as string,
            fileName: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    });
    const newImages = await Promise.all(fileReadPromises);
    setLocalImages([...localImages, ...newImages]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileSelect(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const removeImage = (index: number) => {
    setLocalImages(localImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    dispatch(
      updateFarmProfile({
        id: farmId,
        basicInfo: {
          farmImages: localImages,
        },
      })
    );
    onClose?.();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            ${localImages.length === 0 ? "h-64" : "h-auto"}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />

          {localImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Drag and drop your images here
                </p>
                <p className="text-sm text-gray-500">or</p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {localImages.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <Avatar className="w-20 h-20 flex-shrink-0">
                    <AvatarImage
                      src={image.url}
                      alt={image.fileName}
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                    />
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50"
              >
                <ImagePlus className="w-6 h-6 mb-2" />
                <span className="text-sm">Add More</span>
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={localImages.length === 0}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmImageUploader;
