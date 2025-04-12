// BaseFarmForm.tsx
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import {
  createFarmPost,
  updateFarmPost,
  setCurrentFarmPost,
} from "@/store/post.slice";
import { IFarmPostDocument, IFarmProfile } from "@/models/profileI-interfaces";
import { useEffect } from "react";
import validator from "validator";

// Export the schema so it can be reused
export const farmFormSchema = z.object({
  product: z.object({
    nameOfProduct: z.string().min(1, "Product name is required"),
    pricingMethod: z.string().min(1, "Pricing method is required"),
    productPrice: z.number().optional(),
    requestPricingDetails: z.boolean(),
    baseStartingPrice: z.boolean(),
    currency: z.string().min(1, "Currency is required"),
    pricePerUnit: z.coerce.number().min(0, "Price must be positive").optional(),
    availableQuantity: z.string().optional(),
    unit: z.string().min(1, "Unit is required").optional(),
    availabilityStatus: z.boolean().default(true),
    awaitingHarvest: z.boolean().default(false),
    dateHarvested: z.date().optional(),
    quality_grade: z.string().min(1, "Quality grade is required"),
    negotiablePrice: z.boolean().default(false),
    bulk_discount: z.string().optional(),
    discount: z.boolean().default(false),
    description: z.string().min(1, "Description is required"),
  }),
  useFarmLocation: z.boolean().default(true),
  postLocation: z
    .object({
      region: z.string(),
      district: z.string(),
    })
    .optional(),
  category: z.object({
    name: z.string().min(1, "Category is required"),
    id: z.string().min(1, "Category ID is required"),
  }),
  subcategory: z.object({
    name: z.string().min(1, "Subcategory is required"),
    id: z.string().min(1, "Subcategory ID is required"),
  }),
  deliveryAvailable: z.boolean().default(false),
  delivery: z
    .object({
      deliveryRequirement: z.string(),
      delivery_cost: z.string().default(""),
    })
    .optional(),
  tags: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .default([]),
  productImages: z
    .array(
      z.object({
        url: z
          .string()
          .refine(
            (v) =>
              validator.isURL(v) ||
              /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(v) ||
              v.startsWith("blob:"),
            {
              message: "Invalid image URL format",
            }
          ),
        fileName: z.string().optional(),
        file: z.any().optional(),
      })
    )
    .default([]),
});

export type FarmFormValues = z.infer<typeof farmFormSchema>;

interface BaseFarmFormProps {
  initialData?: Partial<IFarmPostDocument>;
  farmId?: string;
  farmProfile?: IFarmProfile;
  onFormSubmitted?: () => void;
  children: (formProps: {
    form: ReturnType<typeof useForm<FarmFormValues>>;
    onSubmit: (data: FarmFormValues) => Promise<void>;
  }) => React.ReactNode;
}

export const BaseFarmForm: React.FC<BaseFarmFormProps> = ({
  initialData,
  farmId,
  farmProfile,
  onFormSubmitted,
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const isEditMode = Boolean(farmId);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const form = useForm<FarmFormValues>({
    resolver: zodResolver(farmFormSchema),
    defaultValues: initialData || {
      product: {
        nameOfProduct: "",
        pricingMethod: "",
        requestPricingDetails: false,
        baseStartingPrice: false,
        currency: "",
        availabilityStatus: true,
        awaitingHarvest: false,
        quality_grade: "",
        negotiablePrice: false,
        discount: false,
        description: "",
      },
      useFarmLocation: true,
      category: {
        name: "",
        id: "",
      },
      subcategory: {
        name: "",
        id: "",
      },
      deliveryAvailable: false,
      productImages: [],
    },
  });

  const onSubmit = async (data: FarmFormValues) => {
    if (!userId) return;

    try {
      const postData: Partial<IFarmPostDocument> = {
        ...data,
        userId,
        productImages:
          data.productImages?.length > 0
            ? data.productImages.map((img) => ({
                fileName: img.fileName || undefined,
                url: img.url,
                file: img.file || undefined,
              }))
            : [],
        delivery: data.deliveryAvailable ? data.delivery : undefined,
        FarmProfile: farmProfile
          ? {
              farmName: farmProfile.farmName || "",
              farmLocation: {
                region: farmProfile.farmLocation?.region || "",
                district: farmProfile.farmLocation?.district || "",
              },
              farmSize: farmProfile.farmSize?.toString() || "",
              gpsAddress: farmProfile.gpsAddress || "",
              productionScale: farmProfile.productionScale || "Small",
            }
          : undefined,
      };
      if (isEditMode && farmId) {
        await dispatch(
          updateFarmPost({
            id: farmId,
            postData: {
              ...postData,
              tags: data.tags || [],
            },
          })
        ).unwrap();
        toast({
          title: "Success",
          description: "Farm post updated successfully",
        });
      } else {
        await dispatch(
          createFarmPost({
            ...postData,
            productImages: postData.productImages,
            product: {
              ...postData.product,
            },
            tags: data.tags || [],
          } as IFarmPostDocument)
        ).unwrap();
        toast({
          title: "Success",
          description: "Farm post created successfully",
        });
      }
      onFormSubmitted?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save farm post",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isEditMode && farmId) {
      dispatch(setCurrentFarmPost(initialData as IFarmPostDocument));
    } else {
      dispatch(setCurrentFarmPost(null));
    }
  }, [dispatch, initialData, isEditMode, farmId]);

  return <>{children({ form, onSubmit })}</>;
};
