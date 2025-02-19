import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TagIcon, Sprout, ShoppingBag, Calendar } from "lucide-react";
import moment from "moment";
import {
  IFarmPostDocument,
  IStorePostDocument,
} from "@/models/profileI-interfaces";

interface PostGridProps {
  posts: (IFarmPostDocument | IStorePostDocument)[];
  type: "farm" | "store";
}

const formatPrice = (
  post: IFarmPostDocument | IStorePostDocument,
  type: "farm" | "store"
): string => {
  if (type === "farm") {
    const farmPost = post as IFarmPostDocument;
    if (farmPost.product?.pricePerUnit) {
      return `${farmPost.product.currency} ${farmPost.product.pricePerUnit}/${farmPost.product.unit}`;
    }
    return "Price on request";
  } else {
    const storePost = post as IStorePostDocument;
    const price = storePost.storeImage?.itemPrice;
    const currency = storePost.storeImage?.currency || "USD";
    return price ? `${currency} ${price}` : "Price on request";
  }
};

const getPostTitle = (post: IFarmPostDocument | IStorePostDocument): string => {
  if ("product" in post && "nameOfProduct" in post.product) {
    return (post as IFarmPostDocument).product.nameOfProduct;
  }
  return (post as IStorePostDocument).storeImage?.itemName || "Untitled";
};

const getPostImage = (post: IFarmPostDocument | IStorePostDocument): string => {
  if ("productImages" in post) {
    return (
      (post as IFarmPostDocument).productImages?.[0]?.url ||
      "/default-image.jpg"
    );
  }
  return (post as IStorePostDocument).storeImage?.url || "/default-image.jpg";
};

const getPostDescription = (
  post: IFarmPostDocument | IStorePostDocument
): string => {
  if ("product" in post && "description" in post.product) {
    return (post as IFarmPostDocument).product.description;
  }
  return (post as IStorePostDocument).description || "No description available";
};

const getLocation = (post: IFarmPostDocument | IStorePostDocument): string => {
  if ("postLocation" in post) {
    const farmPost = post as IFarmPostDocument;
    const location = farmPost.useFarmLocation
      ? farmPost.FarmProfile?.farmLocation
      : farmPost.postLocation;

    if (!location?.region) {
      return "Location not available";
    }
    return location.region;
  }

  const storePost = post as IStorePostDocument;
  return storePost.storeLocation?.region || "Location not available";
};

export function PostGrid({ posts, type }: PostGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {posts.map((post) => (
        <div key={post._id.toString()} className="w-full">
          <Link href={`/products/${type}s/${post._id}`}>
            <Card className="group h-full transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <Image
                      src={getPostImage(post)}
                      alt={getPostTitle(post)}
                      layout="fill"
                      objectFit="cover"
                      className="transform transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <Badge
                    className={`absolute top-3 left-3 ${
                      type === "farm"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {type === "farm" ? (
                      <Sprout size={14} className="mr-1" />
                    ) : (
                      <ShoppingBag size={14} className="mr-1" />
                    )}
                    {type === "farm" ? "Farm" : "Store"}
                  </Badge>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg line-clamp-1 capitalize">
                    {getPostTitle(post)}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {getPostDescription(post)}
                  </p>

                  <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <MapPin size={14} />
                      {getLocation(post)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Calendar size={14} />
                      {moment(post.createdAt).fromNow()}
                    </Badge>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="font-medium text-primary flex items-center gap-2">
                      <TagIcon size={16} />
                      {formatPrice(post, type)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
}
