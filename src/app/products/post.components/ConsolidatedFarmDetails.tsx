import React from "react";
import {
  Package,
  FileText,
  Tag,
  LeafIcon,
  Signal,
  CreditCard,
  HandshakeIcon,
  Scale,
  ArrowRight,
  CatIcon,
  MapPin,
  Locate,
  Wheat,
  ScaleIcon,
  Building2,
  Calendar,
  RefreshCcw,
  Truck,
  DollarSign,
  Clock,
  Box,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { IFarmPostDocument } from "@/models/profileI-interfaces";
import moment from "moment";

interface ProductDetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
}

const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
  icon,
  label,
  value,
  className = "",
}) => (
  <div
    className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}
  >
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
          {value}
        </div>
      </div>
    </div>
  </div>
);

const FarmProductPostDetails = ({
  currentPost,
}: {
  currentPost: IFarmPostDocument | null;
}) => {
  if (!currentPost) return null;

  const getPriceDisplay = () => {
    const { currency, productPrice, pricePerUnit, unit } = currentPost.product;
    if (!productPrice) return "Price on request";
    const basePrice = `${currency} ${productPrice}`;
    return pricePerUnit && unit ? `${basePrice} per ${unit}` : basePrice;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      <ProductDetailCard
        icon={<Package className="w-4 h-4 text-blue-600" />}
        label="Product Name"
        value={currentPost.product.nameOfProduct}
      />

      <ProductDetailCard
        icon={<FileText className="w-4 h-4 text-blue-600" />}
        label="Description"
        value={currentPost.product.description || "N/A"}
      />
      <ProductDetailCard
        icon={<LeafIcon className="w-4 h-4 text-blue-600" />}
        label="Harvest Status"
        value={
          currentPost.product.awaitingHarvest
            ? "Harvested already"
            : `Expected Harvest: ${moment(
                currentPost.product.dateHarvested
              ).format("lll")}`
        }
      />

      <ProductDetailCard
        icon={<Signal className="w-4 h-4 text-blue-600" />}
        label="Status"
        value={currentPost.product.availabilityStatus ? "Available" : "Sold"}
      />

      <ProductDetailCard
        icon={<CreditCard className="w-4 h-4 text-blue-600" />}
        label="Price"
        value={getPriceDisplay()}
      />

      <ProductDetailCard
        icon={<DollarSign className="w-4 h-4 text-blue-600" />}
        label="Discount"
        value={
          currentPost.product.discount
            ? `${currentPost.product.bulk_discount}`
            : "No discount available"
        }
      />

      <ProductDetailCard
        icon={<Scale className="w-4 h-4 text-blue-600" />}
        label="Available Quantity"
        value={
          currentPost.product.availableQuantity
            ? `${currentPost.product.availableQuantity}`
            : "N/A"
        }
      />

      <ProductDetailCard
        icon={<HandshakeIcon className="w-4 h-4 text-blue-600" />}
        label="Negotiable"
        value={
          currentPost.product.negotiablePrice
            ? `${
                currentPost.product.baseStartingPrice &&
                "Negotiable price " + getPriceDisplay()
              }`
            : "Non-negotiable"
        }
      />

      <ProductDetailCard
        icon={<FileText className="w-4 h-4 text-blue-600" />}
        label="Quality Grade"
        value={currentPost.product.quality_grade || "N/A"}
      />

      <ProductDetailCard
        icon={<Tag className="w-4 h-4 text-blue-600" />}
        label="Tags"
        value={
          currentPost.tags ? (
            <div className="space-y-1">
              {currentPost.tags.map((tag) => (
                <div key={tag.label} className="flex items-center gap-2">
                  <span className="font-medium">{tag.label}</span>
                  <ArrowRight size={14} />
                  <span>{tag.value}</span>
                </div>
              ))}
            </div>
          ) : (
            "N/A"
          )
        }
      />

      <ProductDetailCard
        icon={<CatIcon className="w-4 h-4 text-blue-600" />}
        label="Category"
        value={
          <p className="flex items-center gap-2">
            <span>{currentPost.category.name}</span>
            <ArrowRight size={14} />
            <span>{currentPost.subcategory.name}</span>
          </p>
        }
      />
    </div>
  );
};

export default FarmProductPostDetails;

interface FarmDetailCardProps {
  icon: React.ReactElement;
  label: string;
  value: React.ReactNode;
  className?: string;
}

const FarmDetailCard: React.FC<FarmDetailCardProps> = ({
  icon,
  label,
  value,
  className = "",
}) => (
  <div
    className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow ${className}`}
  >
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
        {React.cloneElement(icon, {
          className: "w-4 h-4 text-green-600 dark:text-green-400",
        })}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
          {value}
        </div>
      </div>
    </div>
  </div>
);

export const FarmInformation: React.FC<{
  currentPost: IFarmPostDocument | null;
}> = ({ currentPost }) => {
  if (!currentPost) return null;

  const getLocationDisplay = () => {
    if (currentPost.useFarmLocation && currentPost.FarmProfile.farmLocation) {
      return `${currentPost.FarmProfile.farmLocation.region}, ${currentPost.FarmProfile.farmLocation.district}`;
    }
    return currentPost.postLocation
      ? `${currentPost.postLocation.region}, ${currentPost.postLocation.district}`
      : "Location not specified";
  };

  return (
    <div className="space-y-3">
      {/* Primary Farm Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <FarmDetailCard
          icon={<Building2 />}
          label="Farm Name"
          value={currentPost.FarmProfile.farmName}
        />

        <FarmDetailCard
          icon={<MapPin />}
          label="Location"
          value={getLocationDisplay()}
        />

        <FarmDetailCard
          icon={<Locate />}
          label="GPS Address"
          value={currentPost.FarmProfile.gpsAddress || "Not specified"}
        />
      </div>

      {/* Farm Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <FarmDetailCard
          icon={<Wheat />}
          label="Production Scale"
          value={currentPost.FarmProfile.productionScale}
        />

        <FarmDetailCard
          icon={<ScaleIcon />}
          label="Farm Size"
          value={`${currentPost.FarmProfile.farmSize || "Not specified"}`}
        />
      </div>
    </div>
  );
};

interface InfoDetailCardProps {
  icon: React.ReactElement;
  label: string;
  value: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

const InfoDetailCard: React.FC<InfoDetailCardProps> = ({
  icon,
  label,
  value,
  className = "",
  highlight = false,
}) => (
  <div
    className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow ${
      highlight ? "border-l-4 border-l-purple-500" : ""
    } ${className}`}
  >
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
        {React.cloneElement(icon, {
          className: "w-4 h-4 text-purple-600 dark:text-purple-400",
        })}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
          {value}
        </div>
      </div>
    </div>
  </div>
);

export const AdditionalInformation: React.FC<{
  currentPost: IFarmPostDocument | null;
}> = ({ currentPost }) => {
  if (!currentPost) return null;

  const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeliveryStatus = () => {
    if (!currentPost.deliveryAvailable) {
      return (
        <div className="flex items-center text-gray-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          No Delivery Service Provided
        </div>
      );
    }
    return (
      <div className="flex items-center text-green-600 dark:text-green-400">
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Delivery Service Available
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Delivery Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <InfoDetailCard
          icon={<Truck />}
          label="Delivery Status"
          value={getDeliveryStatus()}
          highlight={currentPost.deliveryAvailable}
          className="lg:col-span-2"
        />

        {currentPost.deliveryAvailable && (
          <>
            <InfoDetailCard
              icon={<Box />}
              label="Delivery Requirements"
              value={
                currentPost.delivery?.deliveryRequirement ||
                "No specific requirements"
              }
            />

            <InfoDetailCard
              icon={<DollarSign />}
              label="Delivery Cost"
              value={
                <div className="flex items-center">
                  <span className="font-medium">
                    {currentPost.delivery?.delivery_cost ||
                      "Contact for pricing"}
                  </span>
                </div>
              }
            />
          </>
        )}
      </div>

      {/* Timestamps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <InfoDetailCard
          icon={<Calendar />}
          label="Posted On"
          value={formatDate(currentPost.createdAt)}
        />

        <InfoDetailCard
          icon={<RefreshCcw />}
          label="Last Updated"
          value={formatDate(currentPost.updatedAt)}
        />

        <InfoDetailCard
          icon={<Clock />}
          label="Listing Duration"
          value={
            <div className="flex items-center">
              {Math.ceil(
                (new Date().getTime() -
                  new Date(currentPost.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days
            </div>
          }
        />
      </div>
    </div>
  );
};
