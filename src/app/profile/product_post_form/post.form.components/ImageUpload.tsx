import React, { useCallback } from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ImagePlus, X } from "lucide-react";

interface ImageType {
  url: string;
  fileName: string;
  file: File;
}

interface ImageUploadProps {
  control: Control<any>;
  name: string;
  label?: string;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  control,
  name,
  setValue,
  watch,
}) => {
  const handleImageUpload = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const newImages = Array.from(files).map((file) => {
        return new Promise<ImageType>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              url: reader.result as string,
              fileName: file.name,
              file: file,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const processedImages = await Promise.all(newImages);
      const currentImages = watch(name) || [];
      setValue(name, [...currentImages, ...processedImages], {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue, watch, name]
  );

  const removeImage = useCallback(
    (index: number) => {
      const currentImages = watch(name) || [];
      const newImages = currentImages.filter(
        (_: any, i: number) => i !== index
      );
      setValue(name, newImages, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue, watch, name]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormControl>
            <div className="w-full flex items-center justify-start gap-2">
              <label className="cursor-pointer w-32 h-32 border-2 border-dashed rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-center h-full">
                  <ImagePlus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
              </label>
              <div className="flex-1 flex items-center gap-2">
                {watch(name)?.map((image: ImageType, index: number) => (
                  <div
                    key={index}
                    className="relative group bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
                  >
                    <div className="w-32 h-32">
                      <Avatar className="w-full h-full rounded-md">
                        <AvatarImage
                          src={image.url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </Avatar>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full transition-colors shadow-md"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white py-1 px-2 text-xs truncate">
                      {image.fileName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormControl>
          <FormMessage className="dark:text-red-400" />
        </FormItem>
      )}
    />
  );
};

export default ImageUpload;
