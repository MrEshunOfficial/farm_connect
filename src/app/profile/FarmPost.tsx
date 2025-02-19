import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Tag, Calendar, Package } from "lucide-react";
import { IFarmPostDocument } from "@/models/profileI-interfaces";

const FarmPostCard = ({ post }: { post: IFarmPostDocument }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency?: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      {post.productImages?.[0]?.url && (
        <div>
          <Image
            src={post.productImages[0].url}
            alt={post.product.nameOfProduct}
            layout="fill"
            objectFit="cover"
          />
          {!post.product.availabilityStatus && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive">Sold Out</Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">
          {post.product.nameOfProduct}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span>
            {post.useFarmLocation
              ? `${post.FarmProfile.farmLocation?.region}, ${post.FarmProfile.farmLocation?.district}`
              : `${post.postLocation?.region}, ${post.postLocation?.district}`}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {post.product.productPrice && (
            <div className="text-lg font-semibold">
              {formatCurrency(post.product.productPrice, post.product.currency)}
              {post.product.pricePerUnit && (
                <span className="text-sm text-gray-500">
                  /{post.product.unit}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-gray-500" />
            <span>
              {post.product.availableQuantity} {post.product.unit} available
            </span>
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag.label}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-gray-500">
        <div>{post.FarmProfile.farmName}</div>
        <div>{post.FarmProfile.productionScale}</div>
      </CardFooter>
    </Card>
  );
};

export default FarmPostCard;
