import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { IFarmProfileForm } from "@/store/type/farmProfileTypes";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FarmTypeFieldsProps {
  farmType: string;
  form: UseFormReturn<IFarmProfileForm>;
}

export const FarmTypeFields: React.FC<FarmTypeFieldsProps> = ({
  farmType,
  form,
}) => {
  const [newItem, setNewItem] = useState("");

  const fieldConfigs = {
    "Crop Farming": {
      name: "cropsGrown",
      label: "List Type(s) of Crops Grown",
      placeholder: "Enter a crop name",
    },
    "Livestock Farming": {
      name: "livestockProduced",
      label: "List Type(s) of Livestock Produced",
      placeholder: "Enter a livestock type",
    },
    Mixed: {
      name: "mixedCropsGrown",
      label: "List the Type(s) of Products Produced",
      placeholder: "Enter product type",
    },
    Aquaculture: {
      name: "aquacultureType",
      label: "List all the available breed type",
      placeholder: "Enter breed type",
    },
    Nursery: {
      name: "nurseryType",
      label: "List all available nursery types",
      placeholder: "Enter nursery type",
    },
    Poultry: {
      name: "poultryType",
      label: "List all available poultry types",
      placeholder: " Enter poultry type",
    },
    Others: {
      name: "othersType",
      label: "Indicate all available produce engaged in",
      placeholder: "Enter produce type",
    },
  } as const;

  const renderFieldByType = () => {
    const config = fieldConfigs[farmType as keyof typeof fieldConfigs];
    if (!config) return null;

    return (
      <FormField
        control={form.control}
        name={config.name as keyof IFarmProfileForm}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{config.label}</FormLabel>
            <div className="space-y-4">
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder={config.placeholder}
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newItem.trim()) {
                          const currentItems = Array.isArray(field.value)
                            ? field.value
                            : [];
                          field.onChange([...currentItems, newItem.trim()]);
                          setNewItem("");
                        }
                      }
                    }}
                  />
                </FormControl>
                <Button
                  type="button"
                  size={"sm"}
                  onClick={() => {
                    if (newItem.trim()) {
                      const currentItems = Array.isArray(field.value)
                        ? field.value
                        : [];
                      field.onChange([...currentItems, newItem.trim()]);
                      setNewItem("");
                    }
                  }}
                >
                  <Plus size={18} />
                </Button>
              </div>
              <div className="lex flex-col items-start gap-2">
                {Array.isArray(field.value) &&
                  field.value.map((item, index) => (
                    <Badge
                      key={index}
                      className="container border flex items-center justify-between rounded-full mb-2 capitalize"
                    >
                      <span>{typeof item === "string" ? item : item.url}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = Array.isArray(field.value)
                            ? [...field.value]
                            : [];
                          newItems.splice(index, 1);
                          field.onChange(newItems);
                        }}
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return renderFieldByType();
};
