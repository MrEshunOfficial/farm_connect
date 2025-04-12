"use client";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { IFarmProfileForm } from "@/store/type/farmProfileTypes";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import FarmLocationForm from "./FarmLocationForm";
import { FarmTypeFields } from "./renderFieldByType";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import ImageUpload from "../../product_post_form/post.form.components/ImageUpload";

interface FarmProfileFormUIProps {
  form: UseFormReturn<IFarmProfileForm>;
  onSubmit: (data: IFarmProfileForm) => Promise<void>;
  farmType: string;
  belongsToCooperative: boolean;
  mode: "create" | "edit";
}

export const FarmProfileFormUI: React.FC<FarmProfileFormUIProps> = ({
  form,
  onSubmit,
  farmType,
  belongsToCooperative,
  mode,
}) => {
  const isSubmitting = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl max-h-[650px] overflow-auto border rounded-md p-4 bg-white dark:bg-gray-800"
      >
        {/* Submit Button Spanning Both Columns */}
        <div className="col-span-1 md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-dashed border-blue-200 p-4">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Farm Visual Documentation
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Add visual context by uploading farm photographs
              </p>
            </div>
            <ImageUpload
              control={form.control}
              name="farmImages"
              setValue={form.setValue}
              watch={form.watch}
            />
            <div className="text-xs text-gray-400 dark:text-gray-500 italic">
              Supported formats: JPEG, PNG (Max 5MB per image) <br />
              (hint: 1-5 high-quality images showcasing your farm)
            </div>
          </div>
        </div>
        {/* Left Column */}
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Farm Details</h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="farmName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-gray-200">Farm Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter farm name" {...field} className="bg-white dark:bg-gray-700" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FarmLocationForm form={form} />

              <FormField
                control={form.control}
                name="gpsAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-gray-200">GPS Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter GPS address" {...field} className="bg-white dark:bg-gray-700" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="farmSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 dark:text-gray-200">Farm Size (acres)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Size"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          className="bg-white dark:bg-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productionScale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 dark:text-gray-200">Production Scale</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Scale" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Small">Small</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ownershipStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-gray-200">Ownership Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Owned">Owned</SelectItem>
                        <SelectItem value="Leased">Leased</SelectItem>
                        <SelectItem value="Rented">Rented</SelectItem>
                        <SelectItem value="Communal">Communal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Farmer & Farm Type Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 dark:text-gray-200">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} className="bg-white dark:bg-gray-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 dark:text-gray-200">Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} className="bg-white dark:bg-gray-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-gray-200">Contact Email (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} className="bg-white dark:bg-gray-700" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="farmType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-gray-200">Farm Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select farm type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Crop Farming">
                          Crop Farming
                        </SelectItem>
                        <SelectItem value="Livestock Farming">
                          Livestock Farming
                        </SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                        <SelectItem value="Aquaculture">Aquaculture</SelectItem>
                        <SelectItem value="Nursery">Nursery</SelectItem>
                        <SelectItem value="Poultry">Poultry</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FarmTypeFields farmType={farmType} form={form} />

              <FormField
                control={form.control}
                name="belongsToCooperative"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-gray-800 dark:text-gray-200">
                        Cooperative Membership
                      </FormLabel>
                      <FormDescription>
                        Are you a member of a farming cooperative?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {belongsToCooperative && (
                <FormField
                  control={form.control}
                  name="cooperativeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 dark:text-gray-200">Cooperative Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter cooperative name"
                          {...field}
                          className="bg-white dark:bg-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </section>
        </div>

        {/* Submit Button Spanning Both Columns */}
        <div className="col-span-1 md:col-span-2">
          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-gray-200">Additional information (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="describe your farm in details"
                    {...field}
                    className="bg-white dark:bg-gray-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-blue-500 dark:bg-blue-700 text-white"
          >
            {mode === "create" ? "Create Farm Profile" : "Update Farm Profile"}
            {isSubmitting && (
              <Loader2
                className="ml-2 h-4 w-4 animate-spin"
                aria-label="Submitting form"
              />
            )}
          </Button>
        </div>
        <Toaster />
      </form>
    </Form>
  );
};
