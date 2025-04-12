import React, { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CurrencySelect from "@/app/profile/product_post_form/post.form.components/CurrencySelect";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

export const baseStoreImageSchema = z.object({
  itemName: z
    .string()
    .min(1, "Item name is required")
    .max(50, "Item name must be less than 50 characters"),
  itemPrice: z
    .string()
    .min(1, "Price is required")
    .regex(
      /^\d+(\.\d{0,2})?$/,
      "Please enter a valid price (up to 2 decimal places)"
    ),
  currency: z.string().min(1, "Currency is required"),
  url: z.string().min(1, "Image preview is required"),
});

export type BaseStoreImageFormValues = z.infer<typeof baseStoreImageSchema>;

interface BaseStoreImageFormProps {
  form: UseFormReturn<BaseStoreImageFormValues>;
  isLoading?: boolean;
}

export const BaseStoreImageForm: React.FC<BaseStoreImageFormProps> = ({
  form,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const preview = form.watch("url");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      form.setError("url", { message: "Please upload a valid image file" });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      form.setError("url", { message: "File size must be less than 10MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue("url", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    form.setValue("url", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Image *</FormLabel>
            <FormControl>
              <div>
                {!preview ? (
                  <div
                    className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full h-48">
                    <Avatar className="w-full h-full rounded-md">
                      <AvatarImage
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </Avatar>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="itemName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Item Name *</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Product Name"
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="itemPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Item Price *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="99.99" disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currency"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <CurrencySelect
                placeholder="Search currency..."
                onChange={field.onChange}
                watch={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BaseStoreImageForm;
