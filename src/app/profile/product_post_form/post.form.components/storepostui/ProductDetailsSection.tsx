// ProductDetailsSection.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Tags, Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { StoreFormValues } from "@/store/type/storeTypes";
import { useState } from "react";

interface ProductDetailsSectionProps {
  form: UseFormReturn<StoreFormValues>;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  form,
}) => {
  const [tagLabel, setTagLabel] = useState("");
  const [tagValue, setTagValue] = useState("");
  const tags = form.watch("tags") || [];

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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                (This is an extended details to be added to the product. e.g.
                label: horsepower - value: 100)
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
                  (tag: { label: string; value: string }, index: number) => (
                    <div key={index} className="w-full flex items-center gap-2">
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
    </div>
  );
};

export default ProductDetailsSection;
