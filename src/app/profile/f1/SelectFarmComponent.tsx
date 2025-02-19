// FarmPostForm.tsx
import React from "react";
import { IFarmPostDocument, IFarmProfile } from "@/models/profileI-interfaces";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface FarmPostFormProps {
  initialData?: Partial<IFarmPostDocument>;
  farmId?: string;
}

const SelectFarmComponent: React.FC<{
  farmProfiles: IFarmProfile[];
  selectedFarm: IFarmProfile | null;
  setSelectedFarm: React.Dispatch<React.SetStateAction<IFarmProfile | null>>;
}> = ({ farmProfiles, selectedFarm, setSelectedFarm }) => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col space-y-6 p-4 rounded-lg shadow-lg max-w-2xl mx-auto bg-white dark:bg-gray-800 transition-colors duration-300">
      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center">
        Select a Farm to Associate with Your Post
      </h1>
      <span className="text-gray-600 dark:text-gray-300 text-sm text-center">
        Don’t have a farm profile yet?{" "}
        <a
          href="/profile/Farms/new"
          className="text-blue-600 dark:text-yellow-400 hover:underline font-medium"
        >
          Click here
        </a>{" "}
        to create one.
      </span>

      {/* Farm Profiles */}
      <ScrollArea className="w-full max-w-md grid gap-6 h-[400px] overflow-y-auto p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
        {farmProfiles.map((farm) => (
          <Card
            key={farm?._id ? farm._id.toString() : `farm-${Math.random()}`}
            className={`cursor-pointer transition-transform transform hover:scale-105 rounded-md overflow-hidden ${
              selectedFarm?._id === farm._id
                ? "border-2 border-blue-500"
                : "border border-gray-200 dark:border-gray-600"
            }`}
            onClick={() => {
              setSelectedFarm(farm);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  {farm?.farmName ?? "Unnamed Farm"}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {farm?.farmLocation?.region}, {farm?.farmLocation?.district}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                <span className="font-semibold">Size:</span> {farm?.farmSize}{" "}
                acres
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Scale:</span>{" "}
                {farm?.productionScale}
              </p>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
};

export default SelectFarmComponent;
