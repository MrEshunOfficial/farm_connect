import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/store/type/apiTypes";

interface CategorySelectProps {
  categories: Category[];
  onValueChange?: (
    categoryId: string,
    subcategoryId: string,
    names: { categoryName: string; subcategoryName: string }
  ) => void;
  placeholder?: string;
}

const CategorySelect = ({
  categories,
  onValueChange,
  placeholder = "Select a category...",
}: CategorySelectProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find((cat) => cat.id.toString() === categoryId);
    setSelectedCategory(category || null);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    if (selectedCategory && onValueChange) {
      const subcategory = selectedCategory.subcategories?.find(
        (sub) => sub.id.toString() === subcategoryId
      );

      if (subcategory) {
        onValueChange(selectedCategory.id.toString(), subcategoryId, {
          categoryName: selectedCategory.name,
          subcategoryName: subcategory.name,
        });
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Category Select */}
      <Select onValueChange={handleCategorySelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Subcategory Select */}
      {selectedCategory && selectedCategory.subcategories && (
        <Select onValueChange={handleSubcategorySelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a subcategory..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {selectedCategory.subcategories.map((subcategory) => (
                <SelectItem
                  key={subcategory.id}
                  value={subcategory.id.toString()}
                >
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default CategorySelect;
