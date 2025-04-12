import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Store, TractorIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import FarmProfileView from "./FarmProfileView";
import StoreProfileView from "./StoreProfileView";
import {
  IFarmProfile,
  IStoreProfile,
  IUserProfile,
} from "@/models/profileI-interfaces";

interface DynamicPostRenderingProps {
  activeProfile: IUserProfile | null;
  storeProfile: IStoreProfile | null;
  farmProfiles: IFarmProfile[];
  currentFarmProfile: IFarmProfile | null;
  storeLoading: boolean;
  storeError: string | null;
  farmLoading: "idle" | "loading" | "succeeded" | "failed";
  farmError: string | null;
  onTabChange?: (value: string) => void;
}

const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const DynamicProfileRendering: React.FC<DynamicPostRenderingProps> = ({
  activeProfile,
  storeProfile,
  farmProfiles,
  currentFarmProfile,
  storeLoading,
  storeError,
  farmLoading,
  farmError,
  onTabChange,
}) => {
  const renderFarmAndStoreProfileColumn = () => {
    if (!activeProfile) return null;

    switch (activeProfile.role) {
      case "Farmer":
        return (
          <motion.div {...fadeAnimation}>
            <FarmProfileView
              farmProfiles={farmProfiles}
              currentFarmProfile={currentFarmProfile}
              isLoading={farmLoading !== "idle" && farmLoading !== "succeeded"}
              error={farmError || undefined}
            />
          </motion.div>
        );
      case "Seller":
        return (
          <motion.div {...fadeAnimation}>
            {storeProfile && <StoreProfileView storeProfile={storeProfile} />}
          </motion.div>
        );

      case "Both":
        return (
          <Tabs
            defaultValue="farms"
            className="w-full p-2"
            onValueChange={onTabChange}
          >
            <TabsList className="w-full p-3 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
              <TabsTrigger
                value="farms"
                className="flex items-center mr-2 justify-center gap-2 w-1/2 px-4 py-2 font-medium transition-all duration-300 rounded-md 
               hover:bg-blue-100 dark:hover:bg-blue-900 dark:text-gray-200"
              >
                <TractorIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                Explore Farms
              </TabsTrigger>
              <TabsTrigger
                value="store"
                className="flex items-center justify-center gap-2 w-1/2 px-4 py-2 font-medium transition-all duration-300 rounded-md 
               hover:bg-blue-100 dark:hover:bg-blue-900 dark:text-gray-200"
              >
                <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Browse Store
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="farms" className="mt-0">
                <motion.div {...fadeAnimation}>
                  <FarmProfileView
                    farmProfiles={farmProfiles}
                    currentFarmProfile={currentFarmProfile}
                    isLoading={
                      farmLoading !== "idle" && farmLoading !== "succeeded"
                    }
                    error={farmError || undefined}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="store" className="mt-0">
                {storeLoading ? (
                  <Card className="h-full">
                    <CardContent className="flex items-center justify-center h-full">
                      <div>Loading store profile...</div>
                    </CardContent>
                  </Card>
                ) : storeError ? (
                  <Card className="h-full">
                    <CardContent className="flex items-center justify-center h-full">
                      <div>Error loading store profile: {storeError}</div>
                    </CardContent>
                  </Card>
                ) : (
                  storeProfile && (
                    <StoreProfileView storeProfile={storeProfile} />
                  )
                )}
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        );

      default:
        return null;
    }
  };

  return <>{renderFarmAndStoreProfileColumn()}</>;
};

export default DynamicProfileRendering;
