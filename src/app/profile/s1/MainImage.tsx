import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  BaseStoreImageForm,
  baseStoreImageSchema,
  BaseStoreImageFormValues,
} from "@/app/profile/store/BaseStoreImageForm";

interface MainImageProps {
  onSubmit: (data: BaseStoreImageFormValues) => void;
}

const MainImage: React.FC<MainImageProps> = ({ onSubmit }) => {
  const form = useForm<BaseStoreImageFormValues>({
    resolver: zodResolver(baseStoreImageSchema),
    defaultValues: {
      itemName: "",
      itemPrice: "",
      currency: "",
      url: "",
    },
  });

  return (
    <div className="container space-y-6 p-4 w-96 bg-gray-50 dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center capitalize">
        Add the main image of the item
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <BaseStoreImageForm form={form} />

          <Button
            type="submit"
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MainImage;
