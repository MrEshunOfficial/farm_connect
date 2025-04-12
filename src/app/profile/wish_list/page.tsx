"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useWishlist from "@/hooks/wishListUtilityHook";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WishlistItemType, IWishlistItem } from "@/models/profileI-interfaces";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Changed import to your UI components
import {
  Heart,
  Trash2,
  ShoppingCart,
  RefreshCw,
  X,
  ShoppingBag,
  Sprout,
  TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Fixed import
import { Badge } from "@/components/ui/badge"; // Fixed import
import Image from "next/image";

export default function WishListPage() {
  const { data: session } = useSession();
  const {
    wishlistItems,
    loading,
    error,
    summary,
    isAuthenticated,
    removeItem,
    clearItems,
    refreshWishlist,
  } = useWishlist();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isConfirmingClear, setIsConfirmingClear] = useState<boolean>(false);

  // Filter items based on the active tab
  const filteredItems = React.useMemo(() => {
    if (activeTab === "all") return wishlistItems;
    if (activeTab === "farm")
      return wishlistItems.filter(
        (item) => item.itemType === WishlistItemType.FarmProduct
      );
    if (activeTab === "store")
      return wishlistItems.filter(
        (item) => item.itemType === WishlistItemType.StoreProduct
      );
    return wishlistItems;
  }, [wishlistItems, activeTab]);

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleClearWishlist = () => {
    if (isConfirmingClear) {
      clearItems();
      setIsConfirmingClear(false);
    } else {
      setIsConfirmingClear(true);
      setTimeout(() => setIsConfirmingClear(false), 3000);
    }
  };

  const EmptyWishlist = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Heart className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Items you add to your wishlist will appear here. Start browsing to add
        items you like!
      </p>
      <div className="flex gap-4">
        <Link href="/farm-products">
          <Button variant="outline">Browse Farm Products</Button>
        </Link>
        <Link href="/store-products">
          <Button variant="outline">Browse Store Products</Button>
        </Link>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Card key={item} className="overflow-hidden">
          <Skeleton className="w-full h-48" />
          <CardContent className="pt-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/3 mb-4" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const WishlistItemCard = ({ item }: { item: IWishlistItem }) => {
    const productImage = item.productImage || "/placeholder-image.jpg";
    const productType =
      item.itemType === WishlistItemType.FarmProduct ? "farms" : "stores";
    const productLink = `/products/${productType}/${item.itemId}`;

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = `/cart/add/${item.itemId}?type=${
        item.itemType === WishlistItemType.FarmProduct ? "farm" : "store"
      }`;
    };

    return (
      <div className="h-full">
        <Card className="group h-full transition-all duration-300 hover:shadow-xl dark:hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden border-0 bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-700/10 rounded-xl">
          <CardContent className="p-0 flex flex-col h-full">
            <Link href={productLink}>
              <div className="relative">
                <div className="aspect-square relative overflow-hidden rounded-t-xl">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt={item.productName}
                      layout="fill"
                      objectFit="cover"
                      className="transform transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <Heart className="h-16 w-16 text-gray-300" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <Badge
                  className={`absolute top-3 left-3 font-medium rounded-full px-3 py-1 text-xs ${
                    item.itemType === WishlistItemType.FarmProduct
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  } backdrop-blur-sm shadow-sm`}
                >
                  {item.itemType === WishlistItemType.FarmProduct ? (
                    <Sprout size={14} className="mr-1" />
                  ) : (
                    <ShoppingBag size={14} className="mr-1" />
                  )}
                  {item.itemType === WishlistItemType.FarmProduct
                    ? "Farm"
                    : "Store"}
                </Badge>
              </div>

              <div className="p-5 space-y-4 flex-grow">
                <h3 className="font-bold text-lg line-clamp-1 capitalize group-hover:text-primary transition-colors dark:text-white">
                  {item.productName}
                </h3>

                {item.notes && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {item.notes}
                  </p>
                )}

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-sm">
                    <div
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        item.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </div>
                  </div>

                  <p className="font-semibold text-lg text-primary dark:text-indigo-400 flex items-center gap-1">
                    <TagIcon size={16} />
                    {item.price
                      ? `${item.currency || "$"} ${item.price.toFixed(2)}`
                      : "Price not available"}
                  </p>
                </div>
              </div>
            </Link>

            <div className="mt-auto">
              <div className="flex">
                <Button
                  variant="outline"
                  className="flex-1 rounded-none border-y border-r-0 h-12 flex items-center justify-center gap-2"
                  onClick={() => handleRemoveItem(item._id.toString())}
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
                <Button
                  className="flex-1 rounded-t-none rounded-b-xl h-12 bg-primary hover:bg-primary/90 dark:bg-indigo-600 dark:hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all duration-300 text-white font-medium"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Error Message Component
  if (error) {
    return (
      <div className="w-full p-6 text-center">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
          <p>Error: {error}</p>
          <Button onClick={refreshWishlist} variant="outline" className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-gray-600">
            {isAuthenticated
              ? `Welcome back, ${session?.user?.name || "User"}`
              : "You're browsing as a guest. Sign in to save your wishlist."}
          </p>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={refreshWishlist}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button
            variant={isConfirmingClear ? "destructive" : "outline"}
            onClick={handleClearWishlist}
            disabled={wishlistItems.length === 0}
          >
            {isConfirmingClear ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Confirm Clear
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Summary</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <div className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded">
                  {summary.totalItems}
                </div>
              </div>
              <div className="flex justify-between">
                <span>Farm Products:</span>
                <div className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded">
                  {summary.farmProducts}
                </div>
              </div>
              <div className="flex justify-between">
                <span>Store Products:</span>
                <div className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded">
                  {summary.storeProducts}
                </div>
              </div>

              {!isAuthenticated && (
                <div className="pt-4 mt-4 border-t">
                  <p className="text-sm text-amber-600 mb-4">
                    Sign in to sync your wishlist across devices and save it
                    permanently.
                  </p>
                  <Link href="/auth/signin">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All Items ({summary.totalItems})
              </TabsTrigger>
              <TabsTrigger value="farm">
                Farm Products ({summary.farmProducts})
              </TabsTrigger>
              <TabsTrigger value="store">
                Store Products ({summary.storeProducts})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <LoadingSkeleton />
              ) : filteredItems.length === 0 ? (
                <EmptyWishlist />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <WishlistItemCard key={item._id.toString()} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
