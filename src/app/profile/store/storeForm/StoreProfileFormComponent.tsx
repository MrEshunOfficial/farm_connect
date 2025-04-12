"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import {
  createStore,
  updateStoreInfo,
  selectStoreProfile,
  selectStoreLoading,
  selectStoreError,
  selectStoreUpdateError,
  resetErrors,
} from "@/store/store.slice";
import { z } from "zod";
import { useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const StoreProfileSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  description: z
    .string()
    .max(500, "Description should not exceed 500 characters")
    .nullable(),
  productionScale: z.enum(["Small", "Medium", "Commercial"] as const),
  storeOwnership: z.enum(["Private", "Public", "PPP"] as const),
  productSold: z.array(z.string()).default([]),
  belongsToGroup: z.boolean().default(false),
  groupName: z.string().nullable(),
});

type StoreProfileFormData = z.infer<typeof StoreProfileSchema>;

const PRODUCTION_SCALES = ["Small", "Medium", "Commercial"] as const;
const OWNERSHIP_TYPES = ["Private", "Public", "PPP"] as const;

const StoreProfileFormComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const store = useSelector(selectStoreProfile);
  const loading = useSelector(selectStoreLoading);
  const error = useSelector(selectStoreError);
  const updateError = useSelector(selectStoreUpdateError);

  const form = useForm<StoreProfileFormData>({
    resolver: zodResolver(StoreProfileSchema),
    defaultValues: {
      storeName: store?.storeName ?? "",
      description: store?.description ?? "",
      productionScale: "Small",
      storeOwnership: "Private",
      productSold: store?.productSold ?? [],
      belongsToGroup: store?.belongsToGroup ?? false,
      groupName: store?.groupName ?? null,
    },
  });

  useEffect(() => {
    return () => {
      dispatch(resetErrors());
    };
  }, [dispatch]);

  // Show error toasts when Redux errors occur
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
    if (updateError) {
      toast({
        title: "Update Error",
        description: updateError,
        variant: "destructive",
      });
    }
  }, [error, updateError]);

  // Modify the onSubmit function to properly handle the update
  const onSubmit = async (data: StoreProfileFormData) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (store) {
        await dispatch(
          updateStoreInfo({
            storeName: data.storeName,
            description: data.description || undefined,
            productionScale: data.productionScale,
            storeOwnership: data.storeOwnership,
            productSold: data.productSold,
            belongsToGroup: data.belongsToGroup,
            groupName: data.belongsToGroup
              ? data.groupName || undefined
              : undefined,
          })
        ).unwrap();

        toast({
          title: "Success",
          description: "Store profile updated successfully",
        });
      } else {
        // Create new store
        await dispatch(
          createStore({
            userId,
            storeName: data.storeName,
            description: data.description || undefined,
            productionScale: data.productionScale,
            StoreOwnerShip: data.storeOwnership,
            productSold: data.productSold,
            belongsToGroup: data.belongsToGroup,
            groupName: data.belongsToGroup
              ? data.groupName || undefined
              : undefined,
          })
        ).unwrap();

        toast({
          title: "Success",
          description: "Store profile created successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (store) {
      form.reset({
        storeName: store.storeName,
        description: store.description || "",
        productSold: store.productSold || [],
        belongsToGroup: store.belongsToGroup,
        groupName: store.groupName || null,
      });
    }
  }, [store, form]);

  const products = form.watch("productSold") || [];

  const handleAddProduct = () => {
    const currentProducts = form.getValues("productSold") || [];
    form.setValue("productSold", [...currentProducts, ""]);
  };

  const handleRemoveProduct = (index: number) => {
    const currentProducts = form.getValues("productSold") || [];
    const newProducts = currentProducts.filter((_, i) => i !== index);
    form.setValue("productSold", newProducts);
  };

  const handleProductChange = (index: number, value: string) => {
    const currentProducts = form.getValues("productSold") || [];
    const newProducts = [...currentProducts];
    newProducts[index] = value;
    form.setValue("productSold", newProducts);
  };

  const belongsToGroup = form.watch("belongsToGroup");

  return (
    <div className="space-y-6 p-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Store Profile
        </h2>
        {loading && (
          <div className="text-sm text-blue-600 dark:text-blue-400">
            {store ? "Updating..." : "Creating..."}
          </div>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 max-h-[500px] overflow-auto p-2"
        >
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 dark:text-gray-100">
                  Store Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter store name"
                    disabled={loading}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 dark:text-gray-100">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""} // Convert null to empty string
                    placeholder="Enter store description"
                    disabled={loading}
                    className="form-textarea bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="productionScale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Production Scale</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select production scale" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUCTION_SCALES.map((scale) => (
                        <SelectItem key={scale} value={scale}>
                          {scale}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeOwnership"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Ownership</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ownership type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {OWNERSHIP_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="productSold"
            render={() => (
              <FormItem>
                <FormLabel className="w-full flex flex-col gap-2 items-start text-gray-900 dark:text-gray-100">
                  <span>Products</span>
                  <small>
                    {`Provide a curated list of products you're offering for sale
                    or rental.`}
                  </small>
                </FormLabel>

                <div className="space-y-2">
                  {products.map((product, index) => (
                    <div key={index} className="flex gap-2">
                      <FormControl>
                        <Input
                          value={product}
                          onChange={(e) =>
                            handleProductChange(index, e.target.value)
                          }
                          placeholder="Enter product name"
                          disabled={loading}
                          className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveProduct(index)}
                        disabled={loading}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddProduct}
                    disabled={loading}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="belongsToGroup"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-gray-900 dark:text-gray-100">
                    Group Membership
                  </FormLabel>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Indicate if this store belongs to a group
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {belongsToGroup && (
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-gray-100">
                    Group Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Enter group name"
                      disabled={loading}
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? store
                ? "Updating Profile..."
                : "Creating Profile..."
              : store
              ? "Update Profile"
              : "Create Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StoreProfileFormComponent;
