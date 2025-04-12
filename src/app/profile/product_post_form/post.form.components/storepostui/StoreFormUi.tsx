"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/store/hooks";
import { selectStoreProfile } from "@/store/store.slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import StoreForm from "./StoreForm";
import { AuthCheck } from "@/hooks/AuthCheck";
import { useStoreForm, useStoreSubmit } from "@/hooks/useStoreForm";
import { BaseStoreFormProps } from "@/store/type/storeTypes";
import { toast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaInfoCircle } from "react-icons/fa";

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
    <div className="bg-red-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {isEditMode ? "Edit Store Listing" : "Create Store Listing"}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isEditMode
              ? `Update your listing information for ${store?.storeName}`
              : `Add a new listing to your store: ${store?.storeName}`}
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          {/* Form Panel - Now primary and first on mobile */}
          <Card className="xl:col-span-2 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Listing Information</CardTitle>
              <CardDescription>
                Fill in the details below to {isEditMode ? "update" : "create"}{" "}
                your store listing
              </CardDescription>
            </CardHeader>
            <Separator />
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

          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Store Details</CardTitle>
                <CardDescription>
                  Your store information and current listing
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16 rounded-md border border-gray-200 dark:border-gray-700">
                    <AvatarImage
                      src={store?.storeImages?.[0]?.url || ""}
                      alt={store?.storeName || "Store"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-300">
                      {store?.storeName?.substring(0, 2) || "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {store?.storeName}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {store?.storeImages?.length || 0} listings available
                    </p>
                  </div>
                </div>

                {storeImage && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      Current Listing Image
                    </h3>
                    <div className="relative rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="aspect-video w-full">
                        <Image
                          src={storeImage.url}
                          alt={storeImage.itemName || "Store listing"}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      {storeImage.itemName && (
                        <div className="p-3 bg-white/90 dark:bg-black/80 absolute bottom-0 left-0 right-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {storeImage.itemName}
                          </p>
                          {storeImage.itemPrice && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ${storeImage.itemPrice}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guidelines Card */}
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Image Guidelines</CardTitle>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FaInfoCircle className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Image Requirements</SheetTitle>
                        <SheetDescription>
                          Follow these guidelines to ensure your listings look
                          professional and get approved quickly.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <h3 className="font-medium">Best Practices</h3>
                        <ul className="space-y-2 text-sm list-disc pl-5">
                          <li>Use natural lighting when possible</li>
                          <li>Capture multiple angles of your item</li>
                          <li>Include size reference when relevant</li>
                          <li>Keep backgrounds clean and neutral</li>
                          <li>Make sure items are in focus</li>
                        </ul>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                        1
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        High-quality images
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Minimum 2 clear, well-lit photos per listing
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                        2
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Original photos only
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Use device camera photos, no stock images
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                        3
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Size limitations
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Maximum 5MB per image, no watermarks
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
