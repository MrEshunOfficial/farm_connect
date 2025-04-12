import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";
import {
  addImage,
  updateImage,
  selectStoreLoading,
  selectStoreError,
  selectStoreProfile,
} from "@/store/store.slice";
import { AppDispatch } from "@/store";
import { StoreImage } from "@/models/profileI-interfaces";
import BaseStoreImageForm, {
  BaseStoreImageFormValues,
  baseStoreImageSchema,
} from "../BaseStoreImageForm";

interface StoreGalleryProps {
  imageId?: string;
  initialData?: StoreImage;
  onSuccess?: () => void;
}

export const StoreGallery: React.FC<StoreGalleryProps> = ({
  imageId,
  initialData,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectStoreLoading);
  const error = useSelector(selectStoreError);
  const storeProfile = useSelector(selectStoreProfile);

  const form = useForm<BaseStoreImageFormValues>({
    resolver: zodResolver(baseStoreImageSchema),
    defaultValues: {
      itemName: "",
      itemPrice: "",
      currency: "",
      url: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        itemName: initialData.itemName,
        itemPrice: initialData.itemPrice,
        url: initialData.url,
        currency: initialData.currency,
      });
    }
  }, [initialData, form.reset, form]);

  const onSubmit = async (data: BaseStoreImageFormValues) => {
    const imageData: StoreImage = {
      _id: imageId || "",
      url: data.url,
      itemName: data.itemName,
      itemPrice: data.itemPrice,
      currency: data.currency,
    };

    try {
      if (imageId) {
        await dispatch(updateImage({ imageId, data: imageData })).unwrap();
      } else {
        await dispatch(addImage(imageData)).unwrap();
      }
      form.reset();
      onSuccess?.();
    } catch (err) {
      console.error(
        `Failed to ${imageId ? "update" : "add"} store image:`,
        err
      );
    }
  };

  const isMaxImagesReached = (storeProfile?.storeImages?.length ?? 0) >= 10;

  if (isMaxImagesReached && !imageId) {
    return (
      <Alert>
        <AlertDescription>
          Maximum number of images (10) has been reached. Please delete some
          images before adding new ones.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="w-full text-lg text-center font-semibold text-gray-900 dark:text-gray-100">
        {imageId ? "Update Product Image" : "Add New Product to Your Store"}
      </h2>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <BaseStoreImageForm form={form} isLoading={isLoading} />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading
              ? imageId
                ? "Updating Image..."
                : "Adding Image..."
              : imageId
              ? "Update Image"
              : "Add Image"}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default StoreGallery;
