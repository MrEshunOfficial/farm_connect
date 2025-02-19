"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/store/hooks";
import { selectStoreProfile } from "@/store/store.slice";
import { IStorePostDocument, StoreImage } from "@/models/profileI-interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CornerDownLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { useStoreForm, useStoreSubmit } from "@/hooks/useStoreForm";
import StoreForm from "../product_post_form/post.form.components/storepostui/StoreForm";
import MainImage from "./MainImage";
import { StoreFormValues } from "@/store/type/storeTypes";
import { AuthCheck } from "@/hooks/AuthCheck";

interface StorePostFormProps {
  initialData?: Partial<IStorePostDocument>;
  formId?: string;
  storeId?: string;
}

const StorePostForm: React.FC<StorePostFormProps> = ({
  initialData,
  formId,
  storeId,
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const store = useAppSelector(selectStoreProfile);

  const [switchData, setSwitchData] = useState(false);
  const [storeImage, setStoreImage] = useState<StoreImage>({
    _id: "",
    url: "",
    itemName: "",
    itemPrice: "",
    currency: "",
    available: true,
  });

  const { form, isEditMode } = useStoreForm(
    initialData,
    storeId,
    formId,
    storeImage
  );
  const { handleSubmit } = useStoreSubmit(userId);

  const onSubmit = async (data: StoreFormValues) => {
    await handleSubmit(data, storeImage, isEditMode, storeId, formId);
  };

  // Check authentication
  const authCheck = <AuthCheck userId={userId} />;
  if (!userId) return authCheck;

  return (
    <>
      {switchData ? (
        <div className="mt-2 relative">
          <h2 className="w-full flex items-center justify-between font-semibold absolute top-0 left-0 text-gray-800 dark:text-gray-100 capitalize">
            <span>Item on sale: {storeImage.itemName}</span>
            <Button
              variant="secondary"
              size="icon"
              className="bg-blue-500 text-white hover:bg-blue-600 shadow-lg rounded-full transition duration-300"
              onClick={() => setSwitchData(false)}
            >
              <CornerDownLeft size={18} />
            </Button>
          </h2>
          <StoreUIContent
            form={form}
            onSubmit={onSubmit}
            storeImage={storeImage}
          />
        </div>
      ) : (
        <MainImage
          onSubmit={(data) => {
            setStoreImage({
              _id: uuidv4(),
              url: data.url,
              itemName: data.itemName,
              itemPrice: data.itemPrice,
              currency: data.currency,
              available: true,
            });
            setSwitchData(true);
          }}
        />
      )}
    </>
  );
};

interface StoreUIContentProps {
  form: ReturnType<typeof useStoreForm>["form"];
  onSubmit: (data: StoreFormValues) => Promise<void>;
  storeImage: StoreImage;
}

const StoreUIContent: React.FC<StoreUIContentProps> = ({
  form,
  onSubmit,
  storeImage,
}) => {
  return (
    <div className="container max-w-3xl h-full bg-gray-50 dark:bg-gray-900 p-2">
      <Card className="w-full">
        <CardContent className="p-3">
          <StoreForm form={form} onSubmit={onSubmit} storeImage={storeImage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StorePostForm;
