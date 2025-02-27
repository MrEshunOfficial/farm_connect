import React from "react";
import { Badge } from "@/components/ui/badge";
import MoreFarmProductData from "./MoreFarmProductData";
import { IFarmPostDocument } from "@/models/profileI-interfaces";
import { BasePostProfile } from "./SharedPostLayout";

interface FarmPostProfileProps {
  currentPost: IFarmPostDocument;
  mainImage: string;
  allImages: string[];
  currentImageIndex: number;
  isContactShown: boolean;
  userId?: string;
  onImageClick: (index: number) => void;
  onPrevImage: () => void;
  onNextImage: () => void;
  onToggleContact: () => void;
}

function FarmPostProfile(props: FarmPostProfileProps) {
  const renderPriceSection = () => (
    <>
      <Badge
        className="w-full text-lg font-bold text-teal-500 flex items-center justify-between"
        variant="secondary"
      >
        $ {props.currentPost.product.pricePerUnit}/
        {props.currentPost.product.unit}
        {props.currentPost.product.negotiablePrice && <Badge>negotiable</Badge>}
      </Badge>

      {props.currentPost.product.discount && (
        <Badge
          className="w-full flex items-center justify-center border-green-500"
          variant="secondary"
        >
          {props.currentPost.product.bulk_discount}
        </Badge>
      )}
    </>
  );

  const renderAdditionalDetails = () => (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Farm: {props.currentPost.FarmProfile.farmName}
      </p>
      <p className="text-sm">
        Scale: {props.currentPost.FarmProfile.productionScale}
      </p>
      {props.currentPost.product.quality_grade && (
        <p className="text-sm">
          Quality Grade: {props.currentPost.product.quality_grade}
        </p>
      )}
    </div>
  );

  const farmSafetyTips = [
    "Use the Escrow payment system to ensure secure transactions and protect both buyers and sellers.",
    "Verify the product's quality and freshness, such as harvest dates, before confirming payment release.",
    "Confirm delivery arrangements and timelines in advance through clear communication.",
    "Thoroughly inspect the produce upon delivery to ensure it meets your expectations before finalizing the transaction.",
    "Keep detailed and documented proof of all transactions for future reference and accountability.",
  ];

  return (
    <BasePostProfile
      {...props}
      postType="farm"
      renderPriceSection={renderPriceSection}
      renderAdditionalDetails={renderAdditionalDetails}
      renderMoreProductData={() => <MoreFarmProductData />}
      safetyTips={farmSafetyTips}
      avatarFallback="FP"
    />
  );
}

export default FarmPostProfile;
