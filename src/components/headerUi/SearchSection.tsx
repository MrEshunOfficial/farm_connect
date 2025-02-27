import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  MapPin,
  PlusIcon,
  Search,
  StoreIcon,
  TractorIcon,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Region } from "@/store/type/apiTypes";
import { useDispatch } from "react-redux";
import { fetchAllPosts } from "@/store/post.slice";
import { AppDispatch } from "@/store";

interface SearchSectionProps {
  regions: Region[];
  onSearch?: (location: string, query: string) => void;
  initialSearchValue?: string;
}

const SearchSection = ({
  regions,
  onSearch,
  initialSearchValue = "",
}: SearchSectionProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(initialSearchValue);
  const [locationSearch, setLocationSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"regions" | "cities">("regions");

  useEffect(() => {
    if (initialSearchValue) {
      setSearchInput(initialSearchValue);
    }
  }, [initialSearchValue]);

  const filteredRegions = regions.filter((region) =>
    region.region.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredCities =
    selectedRegion?.cities.filter((city) =>
      city.toLowerCase().includes(locationSearch.toLowerCase())
    ) || [];

  const handleSearch = () => {
    const location = selectedCity || selectedRegion?.region || "";

    if (onSearch) {
      onSearch(location, searchInput);
    }

    dispatch(
      fetchAllPosts({
        page: 1,
        searchQuery: searchInput,
        location: selectedRegion
          ? {
              region: selectedRegion.region,
              district: selectedCity || undefined,
            }
          : undefined,
      })
    );

    const searchParams = new URLSearchParams();
    if (searchInput) searchParams.set("q", searchInput);
    if (selectedRegion) searchParams.set("region", selectedRegion.region);
    if (selectedCity) searchParams.set("city", selectedCity);

    const searchParamsString = searchParams.toString();
    router.push(
      `/products/search/${searchParamsString ? `?${searchParamsString}` : ""}`
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRegion(null);
    setSelectedCity(null);
  };

  const handleRegionClick = (region: Region) => {
    setSelectedRegion(region);
    setActiveTab("cities");

    dispatch(
      fetchAllPosts({
        page: 1,
        searchQuery: searchInput,
        location: {
          region: region.region,
        },
      })
    );

    router.push(`/products/location/${encodeURIComponent(region.region)}`);
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setIsOpen(false);

    if (selectedRegion) {
      dispatch(
        fetchAllPosts({
          page: 1,
          searchQuery: searchInput,
          location: {
            region: selectedRegion.region,
            district: city,
          },
        })
      );

      router.push(
        `/products/location/${encodeURIComponent(
          selectedRegion.region
        )}/${encodeURIComponent(city)}`
      );
    }
  };

  return (
    <Card className="w-full flex flex-col lg:flex-row items-stretch gap-4 p-2 bg-background shadow-lg overflow-hidden bg-opacity-50 backdrop-blur-lg">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between gap-2 h-12 px-4 w-full lg:w-72 relative group"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="truncate font-medium">
                {selectedCity ? (
                  <span className="flex items-center gap-1">
                    <span className="text-gray-500">
                      {selectedRegion?.region}
                    </span>
                    <span className="text-gray-400 mx-1">›</span>
                    <span>{selectedCity}</span>
                  </span>
                ) : selectedRegion?.region ? (
                  selectedRegion.region
                ) : (
                  "Select Location"
                )}
              </span>
            </div>
            {(selectedRegion || selectedCity) && (
              <button
                onClick={clearSelection}
                className="absolute right-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-96 p-4" align="start">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Search location..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full"
            />

            <div className="flex gap-2 border-b">
              <Button
                variant="ghost"
                size="sm"
                className={`pb-2 px-4 rounded-none ${
                  activeTab === "regions"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : ""
                }`}
                onClick={() => setActiveTab("regions")}
              >
                Regions
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`pb-2 px-4 rounded-none ${
                  activeTab === "cities"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : ""
                }`}
                onClick={() => setActiveTab("cities")}
                disabled={!selectedRegion}
              >
                Cities
              </Button>
            </div>

            <ScrollArea className="h-72">
              {activeTab === "regions" ? (
                <div className="space-y-1">
                  {filteredRegions.map((region) => (
                    <Button
                      key={region.region}
                      variant={
                        selectedRegion?.region === region.region
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full justify-between py-3"
                      onClick={() => handleRegionClick(region)}
                    >
                      <span className="truncate">{region.region}</span>
                      <span className="text-xs text-gray-500">
                        {region.cities.length} cities
                      </span>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCities.map((city) => (
                    <Button
                      key={city}
                      variant={selectedCity === city ? "secondary" : "ghost"}
                      className="w-full justify-start py-3"
                      onClick={() => handleCityClick(city)}
                    >
                      {city}
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full h-12 pl-4 pr-10"
            placeholder="Search agricultural products... and press enter"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-blue-500 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
        <div className="w-max flex items-center justify-end mx-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-blue-500 text-white hover:bg-blue-600 shadow-lg rounded-full transition duration-300"
                    >
                      <PlusIcon size={18} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-white rounded-xl shadow-lg border border-gray-200">
                    <h2 className="w-full text-lg text-start font-bold mb-4 text-blue-600">
                      What Do You Want to Sell?
                    </h2>
                    <nav>
                      <ul className="space-y-4">
                        <li>
                          <Link
                            href="/profile/f1"
                            className="flex flex-col items-start gap-2 w-full p-2 text-center bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium transition duration-300"
                          >
                            <span className="w-full flex items-center justify-start gap-2">
                              <TractorIcon className="h-5 w-5 text-blue-500" />
                              Sell Farm Produce
                            </span>
                            <span className="w-full text-start text-sm text-gray-500">
                              (e.g., fruits, vegetables, etc.)
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/profile/s1"
                            className="flex flex-col items-start gap-2 w-full p-2 text-center bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium transition duration-300"
                          >
                            <span className="w-full flex items-center justify-start gap-2">
                              <StoreIcon className="h-5 w-5 text-blue-500" />
                              Sell or Rent Store Products
                            </span>
                            <span className="w-full text-start text-sm text-gray-500">
                              (e.g., fertilizers, farm machineries, etc.)
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent side="top">Add Products to Sell</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
};

export default SearchSection;
