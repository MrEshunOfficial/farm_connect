import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  DollarSign,
  Info,
  Scale,
  Truck,
  Percent,
  MessageCircle,
  PackageOpen,
  Tags,
  Star,
  X,
  Plus,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import Link from "next/link";
import { StoreFormValues } from "@/store/type/storeTypes";

interface RemainingFieldsProps {
  form: UseFormReturn<StoreFormValues>;
  storeImage: { currency: string; itemPrice: number } | null;
}

const RemainingFields: React.FC<RemainingFieldsProps> = ({
  form,
  storeImage,
}) => {
  const { isSubmitting } = form.formState;
  const [rentPopoverOpen, setRentPopoverOpen] = useState(false);
  const [deliveryPopoverOpen, setDeliveryPopoverOpen] = useState(false);

  const [tagLabel, setTagLabel] = useState("");
  const [tagValue, setTagValue] = useState("");

  const rentOptions = form.watch("product.rentOptions");
  const deliveryAvailable = form.watch("delivery.deliveryAvailable");
  const tags = form.watch("tags") || [];

  const handleRentSwitch = (checked: boolean) => {
    form.setValue("product.rentOptions", checked);
    if (checked) {
      setRentPopoverOpen(true);
      setDeliveryPopoverOpen(false);
    }
  };

  const handleDeliverySwitch = (checked: boolean) => {
    form.setValue("delivery.deliveryAvailable", checked);
    if (checked) {
      setDeliveryPopoverOpen(true);
      setRentPopoverOpen(false);
    }
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
    const updatedTags: { label: string; value: string }[] = tags.filter(
      (_, i: number) => i !== index
    );
    form.setValue("tags", updatedTags);
  };

  return (
    <Card className="w-full flex flex-col gap-3">
      <CardContent className="p-2 space-y-3">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <FormLabel className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Condition
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">Brand New</SelectItem>
                    <SelectItem value="Used">Slightly Used</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Tags Field */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <FormLabel className="flex flex-col items-start gap-1">
                  <span className="flex items-center">
                    <Tags className="h-4 w-4 mr-1 text-indigo-500" />
                    Tags
                  </span>
                  <small>
                    (This is an extended details to be added to the product.
                    e.g. label: horsepower - value: 100)
                  </small>
                </FormLabel>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1 flex space-x-2">
                      <Input
                        value={tagLabel}
                        onChange={(e) => setTagLabel(e.target.value)}
                        placeholder="label..."
                        className="border-gray-300"
                      />
                      <Input
                        value={tagValue}
                        onChange={(e) => setTagValue(e.target.value)}
                        placeholder="Value..."
                        className="border-gray-300"
                      />
                    </div>
                    <Button
                      type="button"
                      size={"icon"}
                      onClick={handleAddTag}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(
                      (
                        tag: { label: string; value: string },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="w-full flex items-center gap-2"
                        >
                          <span className="flex-1 border rounded-md p-2">
                            {tag.label}
                          </span>
                          <span className="flex-1 border rounded-md p-2">
                            {tag.value}
                          </span>
                          <Button
                            type="button"
                            variant={"destructive"}
                            size={"sm"}
                            onClick={() => handleRemoveTag(index)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </FormItem>
            )}
          />
          {/* Rent Options Section */}
          <FormField
            control={form.control}
            name="product.rentOptions"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-2">
                    <PackageOpen className="h-4 w-4 text-blue-500" />
                    Available For Rent?
                  </FormLabel>
                  <Popover
                    open={rentPopoverOpen}
                    onOpenChange={setRentPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Switch
                          checked={rentOptions}
                          onCheckedChange={handleRentSwitch}
                          className="bg-blue-500 data-[state=checked]:bg-blue-500"
                        />
                      </FormControl>
                    </PopoverTrigger>
                    {field.value && (
                      <PopoverContent className="w-96 p-3" align="end">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="product.rentPricing"
                            render={({ field: priceField }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-green-500" />
                                  Rent Price ({storeImage?.currency})
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="border-gray-300"
                                    {...priceField}
                                    value={
                                      priceField.value ||
                                      storeImage?.itemPrice ||
                                      0
                                    }
                                    onChange={(e) =>
                                      priceField.onChange(
                                        parseFloat(e.target.value)
                                      )
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="product.rentUnit"
                            render={({ field: unitField }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Scale className="h-4 w-4 text-purple-500" />
                                  Rent Unit
                                </FormLabel>
                                <Select
                                  onValueChange={unitField.onChange}
                                  defaultValue={unitField.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select rent unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="hour">
                                      Per Hour
                                    </SelectItem>
                                    <SelectItem value="day">Per Day</SelectItem>
                                    <SelectItem value="week">
                                      Per Week
                                    </SelectItem>
                                    <SelectItem value="month">
                                      Per Month
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="product.rentInfo"
                            render={({ field: infoField }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Info className="h-4 w-4 text-blue-500" />
                                  Additional Rent Information
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...infoField}
                                    className="min-h-[100px] border-gray-300"
                                    placeholder="Enter any additional rental terms or conditions..."
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

          {/* Delivery Section */}
          <FormField
            control={form.control}
            name="delivery.deliveryAvailable"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-500" />
                    Do you Offer Delivery Service?
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
                          className="bg-blue-500 data-[state=checked]:bg-blue-500"
                        />
                      </FormControl>
                    </PopoverTrigger>
                    {field.value && (
                      <PopoverContent className="w-96 p-6" align="end">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="delivery.deliveryRequirement"
                            render={({ field: reqField }) => (
                              <FormItem>
                                <FormLabel>Delivery Requirements</FormLabel>
                                <FormControl>
                                  <Input
                                    {...reqField}
                                    placeholder="Enter delivery requirements..."
                                    className="border-gray-300"
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
                                <FormLabel className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-green-500" />
                                  Delivery Cost
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...costField}
                                    type="number"
                                    placeholder="Enter delivery cost..."
                                    className="border-gray-300"
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

          {/* Price Options Section */}
          <div className="space-y-4 border-t pt-4">
            <FormField
              control={form.control}
              name="product.negotiable"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-orange-500" />
                    Is your price Negotiable?
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="bg-orange-500 data-[state=checked]:bg-orange-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="product.discount"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-purple-500" />
                    Are you currency running a discount?
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="bg-purple-500 data-[state=checked]:bg-purple-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("product.discount") && (
              <FormField
                control={form.control}
                name="product.bulk_discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 mb-2">
                      Briefly describe how the discount works
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="type here...😉"
                        className="border-gray-300"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Description Section */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="border-t pt-4">
                <FormLabel className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-gray-500" />
                  Additional description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-[150px] border-gray-300"
                    placeholder="Enter detailed product description..."
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

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
      </CardContent>
    </Card>
  );
};

export default RemainingFields;
