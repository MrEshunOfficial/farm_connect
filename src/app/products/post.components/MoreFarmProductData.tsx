import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentFarmPost } from "@/store/post.slice";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  getWishlistFromStorage,
  addToWishlist,
  removeFromWishlist,
} from "@/hooks/wishListUtility";
import { IFarmPostDocument } from "@/models/profileI-interfaces";
import ActionButtons from "./ActionButtons";
import FarmProductPostDetails, {
  AdditionalInformation,
  FarmInformation,
} from "./ConsolidatedFarmDetails";

interface DataItem {
  icon: JSX.Element;
  label: string;
  value: React.ReactNode;
}

const MoreFarmProductData: React.FC = () => {
  const currentPost = useSelector(
    selectCurrentFarmPost
  ) as IFarmPostDocument | null;
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (currentPost) {
      const wishlist = getWishlistFromStorage();
      setIsInWishlist(
        wishlist.some((item) => item._id === currentPost._id.toString())
      );
    }
  }, [currentPost]);

  const toggleWishlist = () => {
    if (!currentPost) return;
    try {
      if (isInWishlist) {
        removeFromWishlist(currentPost._id.toString());
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist",
        });
      } else {
        addToWishlist(currentPost);
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist",
        });
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!currentPost) return null;

  const shareInfo = {
    itemName: currentPost.product.nameOfProduct,
    sourceName: currentPost.FarmProfile.farmName,
  };

  const renderDataItem = ({ icon, label, value }: DataItem) => (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all rounded-lg">
      <div className="flex-shrink-0 mt-1">
        <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );

  return (
    <Card className="mt-8 border rounded-xl shadow-lg dark:border-gray-700">
      <ActionButtons
        isInWishlist={isInWishlist}
        onToggleWishlist={toggleWishlist}
        shareInfo={shareInfo}
      />
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto dark:border-gray-700">
          <TabsTrigger
            value="details"
            className="flex-1 py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none dark:data-[state=active]:border-blue-300"
          >
            Product Details
          </TabsTrigger>
          <TabsTrigger
            value="farm"
            className="flex-1 py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none dark:data-[state=active]:border-blue-300"
          >
            Farm Information
          </TabsTrigger>
          <TabsTrigger
            value="meta"
            className="flex-1 py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none dark:data-[state=active]:border-blue-300"
          >
            Additional Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0 p-4">
          <FarmProductPostDetails currentPost={currentPost} />
        </TabsContent>

        <TabsContent value="farm" className="mt-0 p-4">
          <FarmInformation currentPost={currentPost} />
        </TabsContent>

        <TabsContent value="meta" className="mt-0 p-4">
          <AdditionalInformation currentPost={currentPost} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MoreFarmProductData;
