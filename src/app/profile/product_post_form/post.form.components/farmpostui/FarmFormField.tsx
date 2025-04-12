import React, { useState } from "react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";
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
import {
  ImageIcon,
  FolderTree,
  MapPin,
  DollarSign,
  Plus,
  Tags,
  Truck,
  Trash2,
  Loader2,
} from "lucide-react";
import ImageUpload from "../ImageUpload";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FarmFormProductDetails from "./FarmFormProductDetails";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FarmFormValues } from "@/app/profile/Farms/farmForm/BaseFarmForm";

interface FarmFormProps {
  form: UseFormReturn<FarmFormValues>;
  onSubmit: SubmitHandler<FarmFormValues>;
}

const FarmFormField: React.FC<FarmFormProps> = ({ form, onSubmit }) => {
  const { categories, selectedCategory, setSelectedCategory } =
    useCategoryNavigation();
  const { isSubmitting, errors } = form.formState;

  const [deliveryPopoverOpen, setDeliveryPopoverOpen] = useState(false);

  const [tagLabel, setTagLabel] = useState("");
  const [tagValue, setTagValue] = useState("");

  const deliveryAvailable = form.watch("deliveryAvailable");
  const tags = form.watch("tags") || [];

  const harvestReady = form.watch("product.awaitingHarvest");
  const discount = form.watch("product.discount");

  const handleDeliverySwitch = (checked: boolean) => {
    form.setValue("deliveryAvailable", checked);
    if (checked) {
      setDeliveryPopoverOpen(true);
    }
  };

  const watchCurrency = form.watch("product.currency") || "";
  const useFarmLocation = form.watch("useFarmLocation") ?? false;

  const handleCurrencyChange = (currencyCode: string) => {
    form.setValue("product.currency", currencyCode);
  };

  const handleAddTag = () => {
    if (tagLabel.trim() && tagValue.trim()) {
      const tag = {
        label: tagLabel.trim(),
        value: tagValue.trim(),
      };
      form.setValue("tags", [...tags, tag]);
      setTagLabel("");
      setTagValue("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    form.setValue("tags", updatedTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as any)}
        className="max-w-3xl mx-auto max-h-[680px] flex flex-col gap-4 overflow-auto dark:bg-gray-900 dark:text-gray-100 p-4 rounded-lg border-2"
      >
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-md font-medium dark:text-gray-200">
              <ImageIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              Product Images*
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              control={form.control}
              name="productImages"
              setValue={form.setValue}
              watch={form.watch}
            />
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-md font-bold dark:text-gray-200">
              <FolderTree className="h-5 w-5 text-green-500 dark:text-green-400" />
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
                    <FormLabel className="dark:text-gray-300">
                      Main Category*
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const category = categories.find(
                          (cat) => cat.id.toString() === value
                        );
                        if (category) {
                          field.onChange({
                            id: category.id,
                            name: category.name,
                          });
                          setSelectedCategory(category.id);
                        }
                      }}
                      value={field.value?.id?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                            className="dark:hover:bg-gray-700 dark:text-gray-200"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-300">
                      Sub category*
                    </FormLabel>
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
                        <SelectTrigger className="border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        {categories
                          .find((cat) => cat.id === selectedCategory)
                          ?.subcategories?.map((sub) => (
                            <SelectItem
                              key={sub.id}
                              value={sub.id.toString()}
                              className="dark:hover:bg-gray-700 dark:text-gray-200"
                            >
                              {sub.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="dark:text-red-400" />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 border rounded-lg p-3 dark:bg-gray-800 dark:border-gray-700">
          <b className="flex items-center gap-2 dark:text-gray-200">
            <MapPin size={16} className="dark:text-gray-300" />
            Location
          </b>
          <small>
            ( Do you want to use the farm location or use a new location)
          </small>
          <FormField
            control={form.control}
            name="useFarmLocation"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      const boolValue = value === "true";
                      field.onChange(boolValue);
                    }}
                    defaultValue={useFarmLocation.toString()}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Use Farm Location
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Choose a new Location
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          {useFarmLocation && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex flex-col items-start gap-2 text-md font-medium">
                  <span className="flex items-center gap-2 dark:text-gray-200">
                    <MapPin className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    Farm Location
                  </span>
                  <small className="text-gray-500 dark:text-gray-400 text-xs">
                    (Required for buyers to easily locate your farm)
                  </small>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PostLocation
                  control={form.control}
                  setValue={form.setValue}
                  watch={form.watch}
                  fieldNamePrefix="postLocation"
                />
              </CardContent>
            </Card>
          )}
        </div>

        <FarmFormProductDetails
          form={form}
          harvestReady={harvestReady}
          discount={discount}
          watchCurrency={watchCurrency}
          handleCurrencyChange={handleCurrencyChange}
          errors={errors}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="border p-2 dark:bg-gray-800 dark:border-gray-700">
              <FormLabel className="flex flex-col items-start gap-2 font-bold text-muted-foreground dark:text-gray-300">
                <span className="flex items-center mb-1">
                  <Tags className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                  Tags
                </span>
                <span className="text-[13px] dark:text-gray-400">
                  (This is an extended details to be added to the product. e.g.
                  label: weight - value: 100lb)
                </span>
              </FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 flex space-x-2">
                    <Input
                      value={tagLabel}
                      onChange={(e) => setTagLabel(e.target.value)}
                      placeholder="label..."
                      className="border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    <Input
                      value={tagValue}
                      onChange={(e) => setTagValue(e.target.value)}
                      placeholder="Value..."
                      className="border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </div>
                  <Button
                    type="button"
                    size={"icon"}
                    onClick={handleAddTag}
                    className="dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <Plus size={16} className="dark:text-gray-200" />
                  </Button>
                </div>
                <div className="flex flex-col items-start gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="w-full flex items-center justify-between gap-2"
                    >
                      <span className="flex-1 flex items-center justify-start p-2 border rounded gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                        Label: {tag.label}
                      </span>
                      <span className="flex-1 flex items-center justify-start p-2 border rounded gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                        Value: {tag.value}
                      </span>
                      <Button
                        type="button"
                        size={"sm"}
                        onClick={() => handleRemoveTag(index)}
                        variant={"destructive"}
                        className="dark:bg-red-700 dark:hover:bg-red-600"
                      >
                        <Trash2 size={14} className="dark:text-gray-100" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryAvailable"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between border rounded-md h-full p-2 dark:bg-gray-800 dark:border-gray-700">
                <FormLabel className="flex items-center gap-2 dark:text-gray-300">
                  <Truck className="h-4 w-4 text-green-500 dark:text-green-400" />
                  Do you Offer Delivery Option?
                </FormLabel>
                <Popover
                  open={deliveryPopoverOpen}
                  onOpenChange={setDeliveryPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Switch
                        checked={deliveryAvailable}
                        onCheckedChange={handleDeliverySwitch}
                        className="bg-blue-500 dark:bg-blue-600 data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-600"
                      />
                    </FormControl>
                  </PopoverTrigger>
                  {field.value && (
                    <PopoverContent
                      className="w-96 p-6 dark:bg-gray-800 dark:border-gray-700"
                      align="end"
                    >
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="delivery.deliveryRequirement"
                          render={({ field: reqField }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-300">
                                Delivery Requirements
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...reqField}
                                  placeholder="Enter delivery requirements..."
                                  className="border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="delivery.delivery_cost"
                          render={({ field: costField }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 dark:text-gray-300">
                                <DollarSign className="h-4 w-4 text-green-500 dark:text-green-400" />
                                Delivery Cost
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...costField}
                                  type="number"
                                  placeholder="Enter delivery cost..."
                                  className="border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </PopoverContent>
                  )}
                </Popover>
              </div>
            </FormItem>
          )}
        />

        <div className="w-full flex flex-col gap-3">
          <p className="text-sm dark:text-gray-400">
            Thank you for choosing Harvest Bridge. Please note that your
            advertisement will be displayed on the Harvest Bridge platform
            within 24 hours of submission. If you have any questions or require
            assistance, feel free to reach out to us at{" "}
            <Link
              href="http://www.harvestbridge.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 hover:underline duration-300"
            >
              www.harvestbridge.com
            </Link>
            .
          </p>

          <div className="w-full flex justify-end mt-1">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 dark:text-gray-200">
                  <Loader2
                    className="animate-spin dark:text-gray-200"
                    size={14}
                  />
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </form>
      <Toaster />
    </Form>
  );
};

export default FarmFormField;
