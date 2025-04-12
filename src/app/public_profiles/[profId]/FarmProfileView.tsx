import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import FarmDetailsModal from "../FarmDetailsModal";
import { IFarmProfile } from "@/models/profileI-interfaces";

interface FarmProfileViewProps {
  farmProfiles: IFarmProfile[];
  currentFarmProfile: IFarmProfile | null;
  isLoading?: boolean;
  error?: string;
}

const FarmCard: React.FC<{
  farm: IFarmProfile;
  isActive: boolean;
  onClick: () => void;
}> = ({ farm, isActive, onClick }) => {
  const getFarmImage = (images: { url: string; fileName: string }[]) => {
    if (images.length === 0) return null;
    const firstImage = images[0];
    return Array.isArray(firstImage) ? firstImage[0] : firstImage;
  };

  const farmImage = getFarmImage(farm.farmImages || []);

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg transition-all duration-200 hover:scale-102 cursor-pointer",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg"
          : "border hover:bg-gray-50 dark:hover:bg-gray-700"
      )}
    >
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12 shrink-0">
          {farmImage ? (
            <AvatarImage
              src={farmImage.url}
              alt={farmImage.fileName}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-primary/10">
              {farm.farmName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="font-medium text-sm truncate">{farm.farmName}</p>
            <span className="text-sm whitespace-nowrap">
              {farm.farmSize} acre{farm.farmSize !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-sm opacity-80 truncate">
            {farm.farmType} • {farm.productionScale}
          </p>
        </div>

        <ChevronRight
          size={16}
          className={cn(
            "transform transition-transform duration-200",
            isActive
              ? "text-primary-foreground"
              : "text-gray-400 group-hover:translate-x-1 dark:group-hover:text-gray-300"
          )}
        />
      </div>
    </div>
  );
};

const FarmProfileView: React.FC<FarmProfileViewProps> = ({
  farmProfiles,
  currentFarmProfile,
  isLoading = false,
  error,
}) => {
  const [selectedFarm, setSelectedFarm] = useState<IFarmProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-destructive">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="space-y-4 w-full max-w-md">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (farmProfiles.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No farms available</p>
        </CardContent>
      </Card>
    );
  }

  const handleFarmClick = (farm: IFarmProfile) => {
    setSelectedFarm(farm);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="h-full dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-md capitalize">Registered Farms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {farmProfiles.map((farm) => (
            <div key={farm._id.toString()} className="block group">
              <FarmCard
                farm={farm}
                isActive={currentFarmProfile?._id === farm._id}
                onClick={() => handleFarmClick(farm)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <FarmDetailsModal
        farm={selectedFarm}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default FarmProfileView;
