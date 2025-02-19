"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Heart,
  ExternalLink,
  Loader2,
  MapPin,
  Store,
  Truck,
  TagIcon,
  ShoppingBag,
  Sprout,
  Calendar,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import {
  ISanitizedWishlistItem,
  ISanitizedStoreWishlistItem,
  getWishlistFromStorage,
  removeFromWishlist,
  clearWishlist,
} from "@/hooks/wishListUtility";

interface WishlistItemProps {
  item: ISanitizedWishlistItem;
  onRemove: (id: string) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ item, onRemove }) => {
  const isStoreItem = (
    item: ISanitizedWishlistItem
  ): item is ISanitizedStoreWishlistItem => item.type === "store";

  const getItemDetails = () => {
    if (isStoreItem(item)) {
      return {
        image: item.storeImage.url,
        title: item.storeImage.itemName,
        price: `${item.storeImage.currency || "GHS"} ${
          item.storeImage.itemPrice
        }`,
        location: `${item.storeLocation.region}, ${item.storeLocation.district}`,
        type: "store",
      };
    }
    return {
      image: item.productImages?.[0]?.url || "/default-image.jpg",
      title: item.product.nameOfProduct,
      price: `${item.product.currency} ${item.product.productPrice}`,
      location: item.FarmProfile.farmLocation
        ? `${item.FarmProfile.farmLocation.region}`
        : item.postLocation
        ? `${item.postLocation.region}`
        : "Location not specified",
      type: "farm",
    };
  };

  const details = getItemDetails();

  return (
    <Card className="group h-full transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
            <Image
              src={details.image}
              alt={details.title}
              layout="fill"
              objectFit="cover"
              className="transform transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <Badge
            className={`absolute top-3 left-3 ${
              details.type === "farm"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {details.type === "farm" ? (
              <Sprout size={14} className="mr-1" />
            ) : (
              <ShoppingBag size={14} className="mr-1" />
            )}
            {details.type === "farm" ? "Farm" : "Store"}
          </Badge>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8"
            onClick={() => onRemove(item._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg line-clamp-1 capitalize">
            {details.title}
          </h3>

          <div className="flex items-center justify-between text-sm">
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin size={14} />
              {details.location}
            </Badge>
          </div>

          <div className="pt-2 border-t space-y-2">
            <p className="font-medium text-primary flex items-center gap-2">
              <TagIcon size={16} />
              {details.price}
            </p>
            {item.delivery?.deliveryAvailable && (
              <p className="text-sm text-green-600 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Delivery available
              </p>
            )}
          </div>

          <Link
            href={`/products/${item._id}`}
            className="mt-2 inline-flex items-center justify-center w-full p-2 text-sm font-medium text-primary hover:text-primary/80 border rounded-md hover:bg-primary/5 transition-colors"
          >
            View Details
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<ISanitizedWishlistItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const items = getWishlistFromStorage();
        setWishlistItems(items);
      } catch (error) {
        console.error("Error loading wishlist:", error);
        toast({
          title: "Error",
          description: "Failed to load wishlist items",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [toast]);

  const handleRemoveItem = (itemId: string) => {
    try {
      const newWishlist = removeFromWishlist(itemId);
      setWishlistItems(newWishlist);
      toast({
        title: "Item removed",
        description: "Successfully removed from wishlist",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const handleClearWishlist = () => {
    try {
      clearWishlist();
      setWishlistItems([]);
      toast({
        title: "Wishlist cleared",
        description: "Successfully cleared all items from wishlist",
      });
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="border-dashed p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Heart className="w-20 h-20 text-muted-foreground/25" />
            <h3 className="text-2xl font-semibold text-foreground">
              Your wishlist is empty
            </h3>
            <p className="text-muted-foreground max-w-md">
              Start adding items to your wishlist to keep track of products
              you&apos;re interested in!
            </p>
            <Link href="/">
              <Button size="lg" className="font-semibold">
                Browse Products
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              My Wishlist
            </h2>
            <p className="text-sm text-muted-foreground">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "item" : "items"}
            </p>
          </div>
          <Button variant="destructive" onClick={handleClearWishlist}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Wishlist
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <WishlistItem
              key={item._id}
              item={item}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
