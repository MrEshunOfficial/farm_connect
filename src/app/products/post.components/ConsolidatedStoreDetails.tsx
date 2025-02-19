import React from "react";
import {
  Package,
  FileText,
  Box,
  Tag,
  CatIcon,
  ArrowRight,
  Store,
  MapPin,
  Building2,
  Calendar,
  RefreshCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IStorePostDocument } from "@/models/profileI-interfaces";

interface ProductDetailsProps {
  product: IStorePostDocument;
}

const DataItem: React.FC<{
  icon: JSX.Element;
  label: string;
  value: string | JSX.Element;
  className?: string;
}> = ({ icon, label, value, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all ${className}`}
  >
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">{icon}</div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </p>
        <div className="text-base text-gray-900 dark:text-gray-100">
          {value}
        </div>
      </div>
    </div>
  </div>
);

const StorePostProductDetails: React.FC<ProductDetailsProps> = ({
  product,
}) => {
  const renderRentDetails = () => {
    if (!product.product.rentOptions) return null;

    return (
      <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-2">
        <DataItem
          icon={
            <Package className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
          label="Rent Option"
          value="Available for rent"
        />
        <DataItem
          icon={
            <Package className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
          label="Rent Details"
          value={product.product.rentInfo || "N/A"}
        />
        <DataItem
          icon={
            <Package className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
          label="Rate"
          value={
            product.product.rentPricing !== undefined &&
            product.product.rentUnit !== undefined &&
            Number(product.product.rentUnit) !== 0
              ? `${(
                  product.product.rentPricing / Number(product.product.rentUnit)
                ).toFixed(2)} per ${product.product.rentUnit}`
              : "N/A"
          }
        />
      </div>
    );
  };

  return (
    <Card className="p-3 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <DataItem
          icon={
            <Package className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
          label="Product Name"
          value={product.storeImage.itemName}
        />
        <DataItem
          icon={
            <Package className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
          label="Status"
          value={product.storeImage.available ? "Available" : "Sold"}
        />
      </div>

      {renderRentDetails()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {product.product.negotiable && (
          <DataItem
            icon={
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            }
            label="Negotiable"
            value="Price is Negotiable"
          />
        )}
        <DataItem
          icon={
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
          label="Discount"
          value={
            product.product.discount
              ? product.product.bulk_discount ?? "N/A"
              : "N/A"
          }
        />
      </div>

      <div className="col-span-full">
        <DataItem
          icon={
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
          label="Description"
          value={product.description || "N/A"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <DataItem
          icon={<Box className="w-4 h-4 text-blue-600 dark:text-blue-300" />}
          label="Condition"
          value={product.condition ?? "N/A"}
        />
        <DataItem
          icon={
            <CatIcon className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
          label="Category"
          value={
            <Badge className="inline-flex items-center gap-2">
              {product.category.name}
              <ArrowRight size={14} />
              {product.subcategory.name}
            </Badge>
          }
        />
      </div>

      {product.tags && (
        <div className="col-span-full">
          <DataItem
            icon={<Tag className="w-4 h-4 text-blue-600 dark:text-blue-300" />}
            label="Tags"
            value={
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge
                    key={tag.label}
                    className="inline-flex items-center gap-2"
                  >
                    {tag.label}
                    <ArrowRight size={14} />
                    {tag.value}
                  </Badge>
                ))}
              </div>
            }
          />
        </div>
      )}
    </Card>
  );
};

export default StorePostProductDetails;

interface StoreInformationProps {
  store: IStorePostDocument;
}

export const StoreInformation: React.FC<StoreInformationProps> = ({
  store,
}) => {
  return (
    <Card className="p-3 space-y-3">
      {/* Store Identity Section */}
      <div className="grid grid-cols-1 gap-2">
        <DataItem
          icon={<Store className="w-4 h-4 text-blue-600 dark:text-blue-300" />}
          label="Store Name"
          value={store.storeProfile.storeName}
          className="bg-blue-50 dark:bg-blue-900/20"
        />
        <DataItem
          icon={
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
          label="Store Description"
          value={store.storeProfile.description || "N/A"}
        />
      </div>

      {/* Location Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <DataItem
          icon={<MapPin className="w-4 h-4 text-blue-600 dark:text-blue-300" />}
          label="Location"
          value={`${store.storeLocation.region}, ${store.storeLocation.district}`}
        />
        <DataItem
          icon={<MapPin className="w-4 h-4 text-blue-600 dark:text-blue-300" />}
          label="GPS Address"
          value={store.GPSLocation || "N/A"}
        />
      </div>

      {/* Store Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <DataItem
          icon={
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          }
          label="Number of Branches"
          value={`${store.storeProfile.branches?.length || 0}`}
        />
        {store.storeProfile.branches &&
          store.storeProfile.branches.length > 0 && (
            <DataItem
              icon={
                <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-300" />
              }
              label="Branch Locations"
              value={
                <ul className="list-disc list-inside space-y-1">
                  {store.storeProfile.branches.map(
                    (branch: any, index: number) => (
                      <li key={index} className="text-sm">
                        {branch.location}
                      </li>
                    )
                  )}
                </ul>
              }
            />
          )}
      </div>
    </Card>
  );
};

interface AdditionalInformationProps {
  data: {
    delivery?: {
      deliveryAvailable?: boolean;
      deliveryRequirement?: string;
      delivery_cost?: string;
    };
    createdAt: string | Date;
    updatedAt: string | Date;
  };
}

export const AdditionalInformation: React.FC<AdditionalInformationProps> = ({
  data,
}) => {
  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="p-6 space-y-6">
      {data.delivery?.deliveryAvailable && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataItem
            icon={
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            }
            label="Delivery Service"
            value="Delivery Service Available"
            className="bg-green-50 dark:bg-green-900/20"
          />
          <DataItem
            icon={
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            }
            label="Delivery Cost"
            value={data.delivery.delivery_cost || "N/A"}
          />
          <DataItem
            icon={
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            }
            label="Delivery Requirements"
            value={data.delivery.deliveryRequirement || "N/A"}
            className="md:col-span-2"
          />
        </div>
      )}

      {/* Timeline Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Timeline
          </h3>
          <DataItem
            icon={
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            }
            label="Posted On"
            value={formatDate(data.createdAt)}
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Last Update
          </h3>
          <DataItem
            icon={
              <RefreshCcw className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            }
            label="Last Updated"
            value={formatDate(data.updatedAt)}
          />
        </div>
      </div>

      {/* If no delivery service */}
      {!data.delivery?.deliveryAvailable && (
        <div className="grid grid-cols-1 gap-4">
          <DataItem
            icon={
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            }
            label="Delivery Service"
            value="No delivery service available"
            className="bg-gray-50 dark:bg-gray-700/50"
          />
        </div>
      )}
    </Card>
  );
};
