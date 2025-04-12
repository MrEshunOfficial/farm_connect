import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
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
import { Textarea } from "@/components/ui/textarea";
import {
  Leaf,
  DollarSign,
  MessageCircle,
  ShoppingBasket,
  CalendarIcon,
  ScaleIcon,
  Scale3D,
  InfoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import CurrencySelect from "../CurrencySelect";
import { FarmFormValues } from "@/app/profile/Farms/farmForm/BaseFarmForm";

interface FarmFormProps {
  form: UseFormReturn<FarmFormValues>;
  harvestReady: boolean;
  discount: boolean;
  watchCurrency: string;
  handleCurrencyChange: (value: string) => void;
  errors: any;
}

const FarmFormProductDetails = ({
  form,
  harvestReady,
  discount,
  watchCurrency,
  handleCurrencyChange,
  errors,
}: FarmFormProps) => {
  const pricingMethod = form.watch("product.pricingMethod");
  const currency = form.watch("product.currency");
  const baseStartingPricing = form.watch("product.negotiablePrice");

  return (
    <Card className="dark:bg-gray-800 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-md font-bold dark:text-white text-black">
          <Leaf className="h-5 w-5 text-green-500" />
          Product Information
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-3">
        <FormField
          control={form.control}
          name="product.nameOfProduct"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-300 text-black">
                What do you want to sell?*
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter product name"
                  className="border-gray-300 dark:bg-gray-700 dark:text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full my-2">
          <FormField
            control={form.control}
            name="product.pricingMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Pricing Method*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Simple">
                      <div className="flex flex-col items-start">
                        <span>Simple/Direct</span>
                        <span className="text-xs text-muted-foreground">
                          Focus on a direct product pricing. e.g. $200 USD.
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="unit">
                      <div className="flex flex-col items-start">
                        <span>Unit Pricing</span>
                        <span className="text-xs text-muted-foreground">
                          This focuses on unit pricing for bulk products. e.g
                          $200 USD per piece. ($200/kg)
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="my-2">
          <CurrencySelect
            label="Select Currency"
            placeholder="Search currency..."
            onChange={handleCurrencyChange}
            value={watchCurrency}
          />
          {errors.currency && (
            <p className="text-sm text-red-500">{errors.currency.message}</p>
          )}
        </div>
        {pricingMethod === "unit" ? (
          <>
            <div className="flex items-center justify-between gap-6 my-2">
              <FormField
                control={form.control}
                name="product.pricePerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex flex-col gap-2 items-start justify-center">
                      <span className="flex items-center gap-2">
                        <DollarSign size={16} />
                        Price Per Unit* ({currency})
                      </span>
                      <small>
                        how much are you selling this product? e.g $10 per kg.
                        ($10/kg)
                      </small>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="Enter price"
                        className="border-gray-300 flex-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="product.unit"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="flex flex-col gap-2 items-start">
                      <span className="flex items-center gap-2">
                        <ScaleIcon size={18} /> Select Unit*
                      </span>
                      <small>Add corresponding unit</small>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lb">Lb</SelectItem>
                        <SelectItem value="tray">Tray</SelectItem>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="dozen">Dozen</SelectItem>
                        <SelectItem value="g">gram</SelectItem>
                        <SelectItem value="ml">milligram</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </>
        ) : (
          <div>
            <FormField
              control={form.control}
              name="product.productPrice"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel className="flex flex-col gap-2 items-start justify-center">
                    <span className="flex items-center gap-2">
                      {currency || (
                        <>
                          <DollarSign size={18} />
                        </>
                      )}
                      Price*
                    </span>
                    <small>how much are you selling this product?</small>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="Enter price e.g. $1000 USD"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <div className="w-full space-y-2 p-3 border rounded-md dark:border-gray-700">
          <FormField
            control={form.control}
            name="product.requestPricingDetails"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-orange-500" />
                  Call me for price details
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

          <div className="w-full space-y-2">
            <FormField
              control={form.control}
              name="product.negotiablePrice"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-2 dark:text-gray-300 text-black">
                    <MessageCircle className="h-4 w-4 text-orange-500" />
                    Is the Price negotiable?
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
            {baseStartingPricing && (
              <div className="w-full space-y-2">
                <FormField
                  control={form.control}
                  name="product.baseStartingPrice"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-orange-500" />
                        Is this A base starting Price?
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
              </div>
            )}
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="product.discount"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-2 dark:text-gray-300 text-black">
                    <MessageCircle className="h-4 w-4 text-orange-500" />
                    Currently running a discount?
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
          </div>
          <div className="w-full my-2">
            {discount && (
              <FormField
                control={form.control}
                name="product.bulk_discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex flex-col gap-2 items-start justify-center mb-2">
                      <span className="flex items-center gap-2">
                        Discount Description
                      </span>
                      <span className="text-[13px] text-muted-foreground">
                        (help buyers understand how discount is offered)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe your discount details"
                        className="border-gray-300 min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
        <div className="my-2">
          <FormField
            control={form.control}
            name="product.availableQuantity"
            render={({ field }) => (
              <FormItem className="mt-3">
                <FormLabel className="flex flex-col gap-2 items-start justify-center dark:text-gray-300 text-black">
                  <span className="flex items-center gap-2">
                    <Scale3D size={18} /> Available Quantity (optional)
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    Notify buyers the quantity that is still available for
                    purchase at the time of posting
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter quantity e.g. 1000 pieces eggs available"
                    className="border-gray-300 dark:bg-gray-700 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="my-2">
          <FormField
            control={form.control}
            name="product.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex flex-col gap-2 items-start justify-center dark:text-gray-300 text-black">
                  <span className="flex items-center gap-2">
                    <InfoIcon size={18} /> Product Description*
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    add more information to help buyer understand the product.
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your product"
                    className="border-gray-300 dark:bg-gray-700 dark:text-white min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <div className="w-full flex flex-col gap-3 border rounded-md p-2 dark:border-gray-700">
            <FormField
              control={form.control}
              name="product.awaitingHarvest"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="flex flex-col gap-2 items-start justify-center dark:text-gray-300 text-black">
                    <span className="flex items-center gap-2">
                      <ShoppingBasket size={16} /> Awaiting Harvest*
                    </span>
                    <span className="text-[13px] mt-1 text-muted-foreground">
                      let buyers know if the product you are selling is a
                      harvested product or not yet harvested.
                      <br />
                      this allows buyers to know when the product will be ready
                      for harvest if not harvested already.
                    </span>
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

            {harvestReady && (
              <FormItem className="flex flex-col mt-2">
                <FormLabel className="flex flex-col items-start gap-1">
                  <span className="flex items-center gap-2">
                    <CalendarIcon size={16} /> Expected Harvest Date
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    let buyers know when the product will be ready for harvest.
                  </span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          form.watch("product.awaitingHarvest") &&
                            !form.getValues("product")?.dateHarvested &&
                            "text-muted-foreground"
                        )}
                      >
                        {form.getValues("product")?.dateHarvested ? (
                          format(
                            form.getValues("product")?.dateHarvested as Date,
                            "PPP"
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.getValues("product")?.dateHarvested}
                      onSelect={(date: Date | undefined) => {
                        form.setValue("product.dateHarvested", date);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          </div>
        </div>
        <div className="w-full my-2">
          <FormField
            control={form.control}
            name="product.quality_grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-300 text-black">
                  Quality Grade (Optional)
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A">
                      <div className="flex flex-col items-start">
                        <span>Grade A</span>
                        <span className="text-xs text-muted-foreground">
                          Premium quality, minimal defects, highest market value
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="B">
                      <div className="flex flex-col items-start">
                        <span>Grade B</span>
                        <span className="text-xs text-muted-foreground">
                          Good quality, some minor imperfections, still
                          desirable
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="C">
                      <div className="flex flex-col items-start">
                        <span>Grade C</span>
                        <span className="text-xs text-muted-foreground">
                          Average quality, noticeable defects, lower market
                          value
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Standard">
                      <div className="flex flex-col items-start">
                        <span>Standard</span>
                        <span className="text-xs text-muted-foreground">
                          Basic quality meeting minimum requirements
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Premium">
                      <div className="flex flex-col items-start">
                        <span>Premium</span>
                        <span className="text-xs text-muted-foreground">
                          Exceptional quality, top-tier, exceptional
                          characteristics
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmFormProductDetails;
