import React, {  } from "react";
import { useSelector } from "react-redux";
import { selectCurrentStorePost } from "@/store/post.slice";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import ActionButtons from "./ActionButtons";
import Link from "next/link";
import StorePostProductDetails, {
  AdditionalInformation,
  StoreInformation,
} from "./ConsolidatedStoreDetails";

interface DataItem {
  icon: JSX.Element;
  label: string;
  value: string | JSX.Element;
}

const MoreStoreProductData: React.FC = () => {
  const currentPost = useSelector(selectCurrentStorePost);

  if (!currentPost) return null;

  const shareInfo = {
    itemName: currentPost.storeImage.itemName,
    sourceName: currentPost.storeProfile.storeName,
  };

  return (
    <Card className="mt-8 border rounded-xl shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <ActionButtons shareInfo={shareInfo} />
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto dark:border-gray-700">
          <TabsTrigger
            value="details"
            className="flex-1 py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none dark:data-[state=active]:border-blue-300"
          >
            Product Details
          </TabsTrigger>
          <TabsTrigger
            value="store"
            className="flex-1 py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none dark:data-[state=active]:border-blue-300 flex items-center justify-between"
          >
            <>Store Information</>
            <Link href={"#"}>
              <ExternalLink size={14} />
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="meta"
            className="flex-1 py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none dark:data-[state=active]:border-blue-300"
          >
            Additional Info
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-0">
          <StorePostProductDetails product={currentPost} />
        </TabsContent>
        <TabsContent value="store" className="mt-0">
          <StoreInformation store={currentPost} />
        </TabsContent>
        <TabsContent value="meta" className="mt-0">
          <AdditionalInformation data={currentPost} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MoreStoreProductData;
