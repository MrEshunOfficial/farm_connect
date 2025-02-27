"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/store/hooks";
import { selectStoreProfile } from "@/store/store.slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import StoreForm from "./StoreForm";
import { AuthCheck } from "@/hooks/AuthCheck";
import { useStoreForm, useStoreSubmit } from "@/hooks/useStoreForm";
import { BaseStoreFormProps } from "@/store/type/storeTypes";
import { toast } from "@/hooks/use-toast";

export const StoreFormUI: React.FC<BaseStoreFormProps> = ({
  initialData,
  formId,
  storeId,
}) => {
  const store = useAppSelector(selectStoreProfile);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const storeImage = store?.storeImages?.find((image) => image._id === formId);

  const { form, isEditMode } = useStoreForm(
    initialData,
    storeId,
    formId,
    storeImage
  );

  const { handleSubmit } = useStoreSubmit(userId);
  const authCheck = <AuthCheck userId={userId} />;
  
  if (!userId) return authCheck;

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-2">
      <div className="max-w-7xl h-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Store Info Panel */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-2 space-y-3">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center tracking-tight text-gray-900 dark:text-gray-100">
                  {store?.storeName}
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  {isEditMode
                    ? "Modify your store listing"
                    : "Create a new store listing"}{" "}
                  for <span className="font-medium">{store?.storeName}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Image Requirements
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-900 dark:bg-blue-100 rounded-full mr-2" />
                      Minimum 2 high-quality images required
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-900 dark:bg-blue-100 rounded-full mr-2" />
                      Use device camera photos only
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-900 dark:bg-blue-100 rounded-full mr-2" />
                      Maximum size: 5MB per image
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-900 dark:bg-blue-100 rounded-full mr-2" />
                      No watermarks or overlays
                    </li>
                  </ul>
                </div>

                {storeImage && (
                  <div className="space-y-2 flex flex-col items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-center">
                      Main Image
                    </h3>
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                      <Avatar className="w-full h-full rounded-md">
                        <AvatarImage
                          src={storeImage.url}
                          alt={storeImage.itemName || "Store image"}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-300">
                          Store
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {storeImage.itemName && (
                      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                        {storeImage.itemName}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Panel */}
          <Card className="lg:col-span-2">
            <CardContent className="p-3">
              <StoreForm
                form={form}
                onSubmit={async (data) => {
                  if (storeImage) {
                    await handleSubmit(
                      data,
                      storeImage,
                      isEditMode,
                      storeId,
                      formId
                    );
                  } else {
                    toast({
                      title: "Error",
                      description: "Store image not found",
                      variant: "destructive",
                    });
                  }
                }}
                storeImage={storeImage}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
