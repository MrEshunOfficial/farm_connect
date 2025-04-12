// Main Component: RemainingFields.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { StoreFormValues } from "@/store/type/storeTypes";
import SubmissionSection from "./SubmissionSection";
import ProductDetailsSection from "./ProductDetailsSection";
import ServiceOptionsSection from "./ServiceOptionsSection";

interface RemainingFieldsProps {
  form: UseFormReturn<StoreFormValues>;
  storeImage: { currency: string; itemPrice: number } | null;
}

const RemainingFields: React.FC<RemainingFieldsProps> = ({
  form,
  storeImage,
}) => {
  return (
    <Card className="w-full flex flex-col gap-3">
      <CardContent className="p-2 space-y-3">
        <ProductDetailsSection form={form} />
        <ServiceOptionsSection form={form} storeImage={storeImage} />
        <SubmissionSection form={form} />
      </CardContent>
    </Card>
  );
};

export default RemainingFields;
