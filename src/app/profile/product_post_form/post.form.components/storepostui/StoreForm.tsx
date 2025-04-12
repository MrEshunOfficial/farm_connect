import React from "react";
import { UseFormReturn } from "react-hook-form";
import { PostLocation } from "../PostLocation";
import { useCategoryNavigation } from "@/hooks/useCategoryNavigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { ImageIcon, FolderTree, MapPin, Map } from "lucide-react";
import ImageUpload from "../ImageUpload";
import RemainingFields from "./RenderRemainingFields";
import { StoreImage } from "@/models/profileI-interfaces";
import { StoreFormValues } from "@/store/type/storeTypes";

interface StoreFormProps {
  form: UseFormReturn<StoreFormValues>;
  onSubmit: (data: StoreFormValues) => Promise<void>;
  storeImage?: StoreImage;
}

const StoreForm: React.FC<StoreFormProps> = ({
  form,
  onSubmit,
  storeImage,
}) => {
  const { categories, selectedCategory, setSelectedCategory } =
    useCategoryNavigation();
  const renderInitialFields = () => (
    <div className="space-y-3">
      {/* Image Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-md font-medium">
            <ImageIcon className="h-5 w-5 text-blue-500" />
            Additional Images*
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            control={form.control}
            name="productSubImages"
            setValue={form.setValue}
            watch={form.watch}
          />
        </CardContent>
      </Card>

      {/* Category Selection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-md font-medium">
            <FolderTree className="h-5 w-5 text-green-500" />
            Select Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const category = categories.find(
                        (cat) => cat.id === value
                      );
                      if (category) {
                        field.onChange({
                          id: category.id,
                          name: category.name,
                        });
                        setSelectedCategory(category.id);
                      }
                    }}
                    value={field.value?.id}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
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
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const category = categories.find(
                        (cat) => cat.id === selectedCategory
                      );
                      const subcategory = category?.subcategories?.find(
                        (sub) => sub.id === value
                      );
                      if (subcategory) {
                        field.onChange({
                          id: subcategory.id,
                          name: subcategory.name,
                        });
                      }
                    }}
                    value={field.value?.id}
                    disabled={!selectedCategory}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories
                        .find((cat) => cat.id === selectedCategory)
                        ?.subcategories?.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id.toString()}>
                            {sub.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col items-start gap-2 text-md font-medium">
            <span className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              Location Details
            </span>
            <small className="text-gray-500 text-xs">
              ( this is required for buyers to easily locate where you are )
            </small>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PostLocation
            control={form.control}
            setValue={form.setValue}
            watch={form.watch}
            fieldNamePrefix="storeLocation."
          />

          <FormItem className="border-t pt-4">
            <FormLabel className="flex items-center gap-2">
              <Map className="h-4 w-4 text-gray-500" />
              Digital Address*
            </FormLabel>
            <FormField
              control={form.control}
              name="GPSLocation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="your digital address"
                      className="border-gray-300"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </FormItem>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2"
      >
        {renderInitialFields()}
        <RemainingFields
          form={form}
          storeImage={
            storeImage
              ? {
                  currency: storeImage.currency || "",
                  itemPrice:
                    typeof storeImage.itemPrice === "number"
                      ? storeImage.itemPrice
                      : parseFloat(storeImage.itemPrice) || 0,
                }
              : null
          }
        />
      </form>
      <Toaster />
    </Form>
  );
};

export default StoreForm;
