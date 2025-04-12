// hooks/useCategoryNavigation.ts
import { useState, useEffect, useMemo } from 'react';
import { Category } from '@/store/type/apiTypes';
import { ApiService } from '@/services/api-service';
import { useApi } from '@/hooks/useApi';

const STORAGE_KEY = 'categoryOrder';

interface DraggedItem {
  id: string | number;
  type: 'category' | 'subcategory';
  parentId?: string | number;
}

export function useCategoryNavigation() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [originalCategories, setOriginalCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string | number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | number | null>(null);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);

  const apiService = useMemo(() => new ApiService(), []);

  const { loading: isLoading, error, execute } = useApi<Category[]>();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await execute(() => apiService.getCategories());
        const savedOrder = localStorage.getItem(STORAGE_KEY);
        let orderedData = [...data];

        if (savedOrder) {
          const orderMap = new Map<string, number>(JSON.parse(savedOrder));
          orderedData = orderedData
            .map((category) => ({
              ...category,
              order: orderMap.get(category.id.toString()) || 0,
              subcategories: category.subcategories
                ?.map((sub) => ({
                  ...sub,
                  order: orderMap.get(`${category.id}-${sub.id}`) || 0,
                }))
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
            }))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }

        setCategories(orderedData);
        setOriginalCategories(orderedData);
      } catch (err) {
        
      }
    };

    loadCategories();
  }, [execute, apiService]);

  const handleDragStart = (
    id: string | number,
    type: 'category' | 'subcategory',
    parentId?: string | number
  ) => {
    setDraggedItem({ id, type, parentId });
  };

  const handleDrop = (
    targetId: string | number,
    type: 'category' | 'subcategory',
    parentId?: string | number
  ) => {
    if (!draggedItem) return;

    const newCategories = [...categories];
    const orderMap = new Map();

    if (draggedItem.type === 'category' && type === 'category') {
      const draggedIndex = newCategories.findIndex((cat) => cat.id === draggedItem.id);
      const targetIndex = newCategories.findIndex((cat) => cat.id === targetId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedCategory] = newCategories.splice(draggedIndex, 1);
        newCategories.splice(targetIndex, 0, draggedCategory);
      }
    } else if (
      draggedItem.type === 'subcategory' &&
      type === 'subcategory' &&
      draggedItem.parentId === parentId
    ) {
      const parentCategory = newCategories.find((cat) => cat.id === parentId);
      if (parentCategory?.subcategories) {
        const draggedIndex = parentCategory.subcategories.findIndex(
          (sub) => sub.id === draggedItem.id
        );
        const targetIndex = parentCategory.subcategories.findIndex(
          (sub) => sub.id === targetId
        );

        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [draggedSubcategory] = parentCategory.subcategories.splice(draggedIndex, 1);
          parentCategory.subcategories.splice(targetIndex, 0, draggedSubcategory);
        }
      }
    }

    newCategories.forEach((category, index) => {
      orderMap.set(category.id.toString(), index);
      category.subcategories?.forEach((sub, subIndex) => {
        orderMap.set(`${category.id}-${sub.id}`, subIndex);
      });
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(orderMap.entries())));
    setCategories(newCategories);
    setDraggedItem(null);
  };

  const toggleCategory = (categoryId: string | number, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const normalizedQuery = searchQuery.toLowerCase().trim();

    return categories.filter((category) => {
      const categoryMatch = category.name.toLowerCase().includes(normalizedQuery);
      const subcategoryMatches =
        category.subcategories?.filter((sub) =>
          sub.name.toLowerCase().includes(normalizedQuery)
        ) || [];

      if (subcategoryMatches.length > 0) {
        return {
          ...category,
          subcategories: subcategoryMatches,
        };
      }

      return categoryMatch;
    });
  }, [categories, searchQuery]);

  const handleSearchClear = () => {
    setSearchQuery('');
    setCategories(originalCategories);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const matchingCategories = new Set(
        filteredCategories
          .filter((cat) => cat.subcategories?.length)
          .map((cat) => cat.id)
      );
      setExpandedCategories(matchingCategories);
    }
  }, [searchQuery, filteredCategories]);

  return {
    categories: filteredCategories,
    isLoading,
    error,
    searchQuery,
    expandedCategories,
    selectedCategory,
    handleDragStart,
    handleDrop,
    toggleCategory,
    setSearchQuery,
    handleSearchClear,
    setSelectedCategory
  };
}
