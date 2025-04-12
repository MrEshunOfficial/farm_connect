

// ServiceOptionsSection.tsx
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import { StoreFormValues } from "@/store/type/storeTypes";
import {
  DollarSign,
  Scale,
  Truck,
  Percent,
  MessageCircle,
  PackageOpen,
  Info,
} from "lucide-react";

interface ServiceOptionsSectionProps {
  form: UseFormReturn<StoreFormValues>;
  storeImage: { currency: string; itemPrice: number } | null;
}

const ServiceOptionsSection: React.FC<ServiceOptionsSectionProps> = ({
  form,
  storeImage,
}) => {
  const [rentPopoverOpen, setRentPopoverOpen] = useState(false);
  const [deliveryPopoverOpen, setDeliveryPopoverOpen] = useState(false);

  const rentOptions = form.watch("product.rentOptions");
  const deliveryAvailable = form.watch("delivery.deliveryAvailable");

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

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default ServiceOptionsSection;