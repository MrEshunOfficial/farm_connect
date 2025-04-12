// SubmissionSection.tsx
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Info, Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { StoreFormValues } from "@/store/type/storeTypes";
import Link from "next/link";

interface SubmissionSectionProps {
  form: UseFormReturn<StoreFormValues>;
}

const SubmissionSection: React.FC<SubmissionSectionProps> = ({ form }) => {
  const { isSubmitting } = form.formState;

  return (
    <div className="w-full flex flex-col gap-3">
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

      <p className="text-sm dark:text-gray-400">
        Thank you for choosing Harvest Bridge. Please note that your
        advertisement will be displayed on the Harvest Bridge platform within 24
        hours of submission. If you have any questions or require assistance,
        feel free to reach out to us at{" "}
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
              <Loader2 className="animate-spin dark:text-gray-200" size={14} />
              Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SubmissionSection;
