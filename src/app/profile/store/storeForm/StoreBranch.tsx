import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  addBranch,
  updateBranch,
  selectStoreLoading,
  selectStoreError,
} from "@/store/store.slice";
import { AppDispatch } from "@/store";

import { type StoreBranch as StoreBranchType } from "@/models/profileI-interfaces";

const branchFormSchema = z.object({
  branchName: z.string().min(1, "Branch name is required"),
  branchLocation: z.string().min(1, "Location is required"),
  gpsAddress: z.string().optional(),
  branchPhone: z.string().min(1, "Phone number is required"),
  branchEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
});

type BranchFormData = z.infer<typeof branchFormSchema>;

interface StoreBranchProps {
  branchId?: string;
  initialData?: StoreBranchType;
  onSuccess?: () => void;
}

export const StoreBranch: React.FC<StoreBranchProps> = ({
  branchId,
  initialData,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectStoreLoading);
  const error = useSelector(selectStoreError);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      branchName: initialData?.branchName || "",
      branchLocation: initialData?.branchLocation || "",
      gpsAddress: initialData?.gpsAddress || "",
      branchPhone: initialData?.branchPhone || "",
      branchEmail: initialData?.branchEmail || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        branchName: initialData.branchName,
        branchLocation: initialData.branchLocation,
        gpsAddress: initialData.gpsAddress || "",
        branchPhone: initialData.branchPhone,
        branchEmail: initialData.branchEmail || "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: BranchFormData) => {
    const branchData: StoreBranchType = {
      _id: branchId || "",
      ...data,
      branchEmail: data.branchEmail || undefined,
      gpsAddress: data.gpsAddress || undefined,
    };

    try {
      if (branchId) {
        await dispatch(updateBranch({ branchId, data: branchData })).unwrap();
      } else {
        await dispatch(addBranch(branchData)).unwrap();
      }
      reset();
      onSuccess?.();
    } catch (error) {
      // Error is handled by the Redux store
      console.error("Failed to save branch:", error);
    }
  };

  return (
    <div className="space-y-6 p-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {branchId ? "Update Branch" : "Add New Branch"}
      </h2>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="branchName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Branch Name *
          </label>
          <input
            type="text"
            id="branchName"
            {...register("branchName")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Main Branch"
          />
          {errors.branchName && (
            <p className="text-sm text-red-500">{errors.branchName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="branchLocation"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Location *
          </label>
          <input
            type="text"
            id="branchLocation"
            {...register("branchLocation")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="123 Main Street"
          />
          {errors.branchLocation && (
            <p className="text-sm text-red-500">
              {errors.branchLocation.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="gpsAddress"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            GPS Address
          </label>
          <input
            type="text"
            id="gpsAddress"
            {...register("gpsAddress")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="GPS Coordinates"
          />
          {errors.gpsAddress && (
            <p className="text-sm text-red-500">{errors.gpsAddress.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="branchPhone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="branchPhone"
            {...register("branchPhone")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="+1 234 567 8900"
          />
          {errors.branchPhone && (
            <p className="text-sm text-red-500">{errors.branchPhone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="branchEmail"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="branchEmail"
            {...register("branchEmail")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="branch@example.com"
          />
          {errors.branchEmail && (
            <p className="text-sm text-red-500">{errors.branchEmail.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading
            ? branchId
              ? "Updating..."
              : "Adding..."
            : branchId
            ? "Update Branch"
            : "Add Branch"}
        </button>
      </form>
    </div>
  );
};
