// useStoreForm.ts
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {v4 as uuidv4} from "uuid";

import { useToast } from "@/components/ui/use-toast";
import { createStorePost, setCurrentStorePost, updateStorePost } from "@/store/post.slice";
import { addImage, fetchStoreProfile } from "@/store/store.slice";
import { IStorePostDocument, StoreImage } from "@/models/profileI-interfaces";
import { StoreFormValues, storeFormSchema } from "@/store/type/storeTypes";

export const useStoreForm = (
  initialData: Partial<IStorePostDocument> | undefined,
  storeId: string | undefined,
  formId: string | undefined,
  storeImage?: StoreImage
) => {
  const dispatch = useDispatch<AppDispatch>();
  const isEditMode = Boolean(storeId);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      storeLocation: initialData?.storeLocation || {
        region: "",
        district: "",
      },
      product: initialData?.product || {
        rentOptions: false,
        negotiable: false,
        discount: false,
        rentPricing:
          typeof storeImage?.itemPrice === "number"
            ? storeImage.itemPrice
            : undefined,
      },
      category: initialData?.category || {
        name: "",
        id: "",
      },
      subcategory: initialData?.subcategory || {
        name: "",
        id: "",
      },
      delivery: initialData?.delivery || {
        deliveryAvailable: false,
        deliveryRequirement: initialData?.delivery?.deliveryRequirement || "",
        delivery_cost: "",
      },
      description: initialData?.description || "",
      GPSLocation: initialData?.GPSLocation || "",
      condition: initialData?.GPSLocation || "",
      tags: initialData?.tags || [],
      productSubImages: initialData?.ProductSubImages || [],
    },
  });

  useEffect(() => {
    if (isEditMode && storeId) {
      dispatch(setCurrentStorePost(initialData as IStorePostDocument));
    } else {
      dispatch(setCurrentStorePost(null));
    }
  }, [dispatch, initialData, isEditMode, storeId]);

  useEffect(() => {
    if (formId) {
      dispatch(fetchStoreProfile());
    }
  }, [dispatch, formId]);

  return { form, isEditMode };
};


export const useStoreSubmit = (userId?: string) => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (
    data: StoreFormValues,
    storeImage: StoreImage,
    isEditMode: boolean,
    storeId: string | undefined,
    formId: string | undefined,
  ) => {
    try {
      const postData = {
        ...data,
        userId,
        ProductSubImages: data.productSubImages.map((img) => ({
          fileName: img.fileName,
          url: img.url,
          file: img.file,
        })),
        storeImage: {
          ...storeImage,
          available: storeImage.available ?? true,
        },
      };

      if (isEditMode && storeId) {
        await dispatch(
          updateStorePost({
            id: storeId,
            postData: {
              ...postData,
              ProductSubImages: postData.ProductSubImages,
              tags: postData.tags?.length ? [postData.tags[0]] : undefined,
            },
          })
        ).unwrap();
        toast({
          title: "Success",
          description: "Store post updated successfully",
        });
      } else {
        await dispatch(
          createStorePost({
            ...postData,
            ProductSubImages: postData.ProductSubImages,
            product: {
              ...postData.product,
              rentUnit: postData.product.rentUnit || "",
            },
            tags: postData.tags?.length ? [postData.tags[0]] : undefined,
          })
        ).unwrap();
        toast({
          title: "Success",
          description: "Store post created successfully",
        });
      }

      // Only submit image data when formId is not provided
      if (!formId) {
        try {
          const imageData: StoreImage = {
            _id: '',
            url: storeImage.url || "",
            itemName: storeImage.itemName,
            itemPrice: storeImage.itemPrice,
            currency: storeImage.currency,
            available: storeImage.available ?? true,
          };
    
          await dispatch(addImage(imageData)).unwrap();
          toast({
            title: "Success",
            description: "store gallery updated successfully",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "failed to update store gallery",
            variant: "destructive",
          });
        }
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save store post",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
};