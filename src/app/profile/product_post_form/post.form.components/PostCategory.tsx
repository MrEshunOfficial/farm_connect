"use client";

import CategorySelect from "@/components/headerUi/CategorySelect";
import { useCategoryNavigation } from "@/hooks/useCategoryNavigation";
import React, { useState } from "react";

export default function PostCategoryForm() {
  const { categories, setSelectedCategory } = useCategoryNavigation();
  const [selectedValues, setSelectedValues] = useState<{
    categoryName: string;
    subcategoryName: string;
  } | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);

  const handleCategoryChange = (
    categoryId: string,
    subcategoryId: string,
    names: { categoryName: string; subcategoryName: string }
  ) => {
    setSelectedCategory(subcategoryId);
    setSelectedValues(names);
    setCategoryId(categoryId);
    setSubcategoryId(subcategoryId);
  };

  return (
    <main className="w-full h-full p-2 border rounded-md">
      <CategorySelect
        categories={categories}
        onValueChange={handleCategoryChange}
        placeholder="Choose a category..."
      />

      {selectedValues && (
        <div className="mt-4 flex flex-col space-y-2 items-start gap-2">
          <span>
            Selected Category: {selectedValues.categoryName} id: {categoryId}
          </span>
          <span>
            Selected Subcategory: {selectedValues.subcategoryName} id:{" "}
            {subcategoryId}
          </span>
        </div>
      )}
    </main>
  );
}
