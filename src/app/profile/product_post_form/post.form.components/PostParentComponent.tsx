// PostParentComponent.tsx
"use client";
import React from "react";
import { StoreFormUI } from "./storepostui/StoreFormUi";
import FarmFormUI from "./farmpostui/FarmFormUi";
import {
  IFarmPostDocument,
  IStorePostDocument,
} from "@/models/profileI-interfaces";

interface PostParentComponentProps {
  initialData?: Partial<IFarmPostDocument | IStorePostDocument>;
  id?: string;
  mode?: "store" | "farm";
  formId?: string;
  farmId?: string;
}

const PostParentComponent: React.FC<PostParentComponentProps> = ({
  initialData = {},
  id,
  mode,
  formId,
  farmId,
}) => {
  return (
    <>
      {mode === "farm" && (
        <FarmFormUI
          initialData={initialData as Partial<IFarmPostDocument>}
          formId={formId}
          farmId={farmId}
        />
      )}
      {mode === "store" && (
        <StoreFormUI
          initialData={initialData as Partial<IStorePostDocument>}
          formId={formId}
          storeId={id}
        />
      )}
    </>
  );
};

export default PostParentComponent;
