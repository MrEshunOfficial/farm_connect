import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { IFarmProfileForm } from "@/store/type/farmProfileTypes";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApi } from "@/hooks/useApi";
import { ApiService } from "@/services/api-service";
import { Region } from "@/store/type/apiTypes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronDown, ChevronRight, MapPin } from "lucide-react";

interface LocationFormProps {
  form: UseFormReturn<IFarmProfileForm>;
}

const apiService = new ApiService();

export const FarmLocationForm: React.FC<LocationFormProps> = ({ form }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const {
    data: regions,
    loading: regionsLoading,
    error: regionsError,
    execute: executeRegions,
  } = useApi<Region[]>();

  useEffect(() => {
    const loadRegions = async () => {
      try {
        await executeRegions(() => apiService.getRegions());
      } catch (error) {
        console.error("Failed to load regions:", error);
      }
    };

    loadRegions();
  }, [executeRegions]);

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setSelectedDistrict(null);
    form.setValue("farmLocation.region", region.region, {
      shouldValidate: true,
      shouldDirty: true,
    });
    // Clear the district when region changes
    form.setValue("farmLocation.district", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    form.setValue("farmLocation.district", district, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsOpen(false);
  };

  const getDisplayText = () => {
    const region = form.watch("farmLocation.region");
    const district = form.watch("farmLocation.district");
    if (district) return `${region} - ${district}`;
    if (region) return region;
    return "Select Location";
  };

  return (
    <div className="space-y-4">
      {regionsError && (
        <Alert variant="destructive">
          <AlertDescription>{regionsError}</AlertDescription>
        </Alert>
      )}

      <FormField
        control={form.control}
        name="farmLocation"
        render={() => (
          <FormItem className="space-y-1">
            <FormLabel>Farm Location</FormLabel>
            <FormControl>
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center justify-between gap-2 h-12 px-4 w-full"
                    disabled={regionsLoading}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{getDisplayText()}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-80" align="start">
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-2">
                      <ScrollArea className="h-80 border-r pr-2">
                        {regions?.map((region) => (
                          <Button
                            key={region.region}
                            variant={
                              form.watch("farmLocation.region") ===
                              region.region
                                ? "secondary"
                                : "ghost"
                            }
                            className="w-full justify-between mb-1"
                            onClick={() => handleRegionSelect(region)}
                          >
                            <span className="truncate">{region.region}</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        ))}
                      </ScrollArea>

                      <ScrollArea className="h-80 pl-2">
                        {selectedRegion?.cities.map((district) => (
                          <Button
                            key={district}
                            variant={
                              form.watch("farmLocation.district") === district
                                ? "secondary"
                                : "ghost"
                            }
                            className="w-full justify-start mb-1"
                            onClick={() => handleDistrictSelect(district)}
                            disabled={!selectedRegion}
                          >
                            <span className="truncate">{district}</span>
                          </Button>
                        ))}
                      </ScrollArea>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FarmLocationForm;
