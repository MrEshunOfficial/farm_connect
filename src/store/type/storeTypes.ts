// types.ts
import { z } from "zod";
import validator from "validator";
import { IStorePostDocument, StoreImage } from "@/models/profileI-interfaces";
import { UseFormReturn } from "react-hook-form";

export const storeFormSchema = z.object({
  storeLocation: z.object({
    region: z.string().min(1, "Region is required"),
    district: z.string().min(1, "District is required"),
  }),
  product: z.object({
    rentOptions: z.boolean(),
    rentPricing: z.number().optional(),
    rentUnit: z.string().optional(),
    negotiable: z.boolean(),
    discount: z.boolean().optional(),
    bulk_discount: z.string().optional(),
    rentInfo: z.string().optional(),
  }),
  category: z.object({
    name: z.string().min(1, "Category is required"),
    id: z.string().min(1, "Category ID is required"),
  }),
  subcategory: z.object({
    name: z.string().min(1, "Subcategory is required"),
    id: z.string().min(1, "Subcategory ID is required"),
  }),
  delivery: z.object({
    deliveryAvailable: z.boolean(),
    deliveryRequirement: z.string().default(""),
    delivery_cost: z.string().optional(),
  }),
  description: z.string().min(1, "Description is required"),
  GPSLocation: z.string().optional(),
  condition: z.string().optional(),
  tags: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  productSubImages: z.array(
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
      fileName: z.string(),
      file: z.any().optional(),
    })
  ),
});

export type StoreFormValues = z.infer<typeof storeFormSchema>;

export interface BaseStoreFormProps {
  initialData?: Partial<IStorePostDocument>;
  formId?: string;
  storeId?: string;
}

export interface StoreFormProps {
  form: UseFormReturn<StoreFormValues>;
  onSubmit: (data: StoreFormValues) => Promise<void>;
  storeImage?: StoreImage;
}
