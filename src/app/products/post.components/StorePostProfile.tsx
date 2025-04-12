import React from "react";
import { Badge } from "@/components/ui/badge";
import MoreStoreProductData from "./MoreStoreProductData";
import { IStorePostDocument } from "@/models/profileI-interfaces";
import { BasePostProfile } from "./SharedPostLayout";

interface StorePostProfileProps {
  currentPost: IStorePostDocument;
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

export function StorePostProfile(props: StorePostProfileProps) {
  const renderPriceSection = () => (
    <>
      <Badge
        className="w-full text-lg font-bold text-teal-500 flex items-center justify-between"
        variant="secondary"
      >
        {props.currentPost.storeImage.currency || "$"}{" "}
        {props.currentPost.storeImage.itemPrice}
        {props.currentPost.product.negotiable && <Badge>negotiable</Badge>}
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

  const storeSafetyTips = [
    "Always use our Escrow protection - your payment stays securely held until you confirm receipt of exactly what you ordered.",
    "Never pay outside the platform - Escrow safeguards your money until you approve the transaction after receiving your item.",
    "When meeting sellers, always choose public spaces with security cameras or witnesses present.",
    "Carefully inspect your purchase before approving payment release in the Escrow system - check quality, authenticity, and match with the listing.",
    "Verify the item being shipped is identical to what you physically inspected before closing the transaction.",
    "Only mark orders as 'completed' in the Escrow system when fully satisfied with your purchase.",
  ];

  return (
    <BasePostProfile
      {...props}
      postType="store"
      renderPriceSection={renderPriceSection}
      renderMoreProductData={() => <MoreStoreProductData />}
      safetyTips={storeSafetyTips}
      avatarFallback="CN"
    />
  );
}
