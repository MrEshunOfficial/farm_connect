import React, {  } from "react";
import { useSelector } from "react-redux";
import { selectCurrentFarmPost } from "@/store/post.slice";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  if (!currentPost) return null;

  const shareInfo = {
    itemName: currentPost.product.nameOfProduct,
    sourceName: currentPost.FarmProfile.farmName,
  };

  return (
    <Card className="mt-8 border rounded-xl shadow-lg dark:border-gray-700">
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
