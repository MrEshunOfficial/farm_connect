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
import { IUserProfile } from "@/models/profileI-interfaces";

interface SearchSectionProps {
  profile: IUserProfile | null;
  regions: Region[];
  onSearch?: (location: string, query: string) => void;
  initialSearchValue?: string;
}

// Type for location parameters
interface LocationParams {
  region: string;
  district?: string;
}

const SearchSection = ({
  profile,
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

  // Helper function to build location parameters
  const buildLocationParams = (): LocationParams | undefined => {
    if (!selectedRegion) return undefined;

    return {
      region: selectedRegion.region,
      district: selectedCity || undefined,
    };
  };

  // Helper function to dispatch search with current parameters
  const dispatchSearch = (locationParams?: LocationParams) => {
    dispatch(
      fetchAllPosts({
        page: 1,
        searchQuery: searchInput,
        location: locationParams,
      })
    );
  };

  // Helper function to build URL search parameters
  const buildSearchParams = (): URLSearchParams => {
    const searchParams = new URLSearchParams();
    if (searchInput) searchParams.set("q", searchInput);
    if (selectedRegion) searchParams.set("region", selectedRegion.region);
    if (selectedCity) searchParams.set("city", selectedCity);
    return searchParams;
  };

  // Helper function to navigate to search results
  const navigateToSearch = () => {
    const searchParams = buildSearchParams();
    const searchParamsString = searchParams.toString();
    router.push(
      `/products/search/${searchParamsString ? `?${searchParamsString}` : ""}`
    );
  };

  // Helper function to navigate to location
  const navigateToLocation = (region: string, city?: string) => {
    const path = city
      ? `/products/location/${encodeURIComponent(region)}/${encodeURIComponent(
          city
        )}`
      : `/products/location/${encodeURIComponent(region)}`;
    router.push(path);
  };

  const handleSearch = () => {
    const location = selectedCity || selectedRegion?.region || "";

    if (onSearch) {
      onSearch(location, searchInput);
    }

    const locationParams = buildLocationParams();
    dispatchSearch(locationParams);
    navigateToSearch();
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

    dispatchSearch({
      region: region.region,
    });

    navigateToLocation(region.region);
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setIsOpen(false);

    if (selectedRegion) {
      dispatchSearch({
        region: selectedRegion.region,
        district: city,
      });

      navigateToLocation(selectedRegion.region, city);
    }
  };

  // Component for rendering product type options
  const ProductTypeOptions = () => {
    // Helper function to render a product type link
    const ProductTypeLink = ({
      href,
      icon: Icon,
      title,
      description,
    }: {
      href: string;
      icon: React.ElementType;
      title: string;
      description: string;
    }) => (
      <li>
        <Link
          href={href}
          className="group block w-full rounded-lg transition-all duration-200 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <div className="p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-lg group-hover:shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 p-2 bg-white rounded-full shadow-sm">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-800 group-hover:text-blue-700">
                {title}
              </span>
            </div>
            <div className="ml-10 text-sm text-gray-500 group-hover:text-gray-700">
              {description}
            </div>
          </div>
        </Link>
      </li>
    );

    if (profile?.role === "Farmer") {
      return (
        <ProductTypeLink
          href="/profile/f1"
          icon={TractorIcon}
          title="Sell Farm Produce"
          description="(e.g., fruits, vegetables, etc.)"
        />
      );
    }

    if (profile?.role === "Seller") {
      return (
        <ProductTypeLink
          href="/profile/s1"
          icon={StoreIcon}
          title="Sell or Rent Store Products"
          description="(e.g., fertilizers, farm machineries, etc.)"
        />
      );
    }

    return (
      <>
        <ProductTypeLink
          href="/profile/f1"
          icon={TractorIcon}
          title="Sell Farm Produce"
          description="(e.g., fruits, vegetables, etc.)"
        />
        <ProductTypeLink
          href="/profile/s1"
          icon={StoreIcon}
          title="Sell or Rent Store Products"
          description="(e.g., fertilizers, farm machineries, etc.)"
        />
      </>
    );
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
                  <PopoverContent className="w-96 bg-white rounded-lg shadow-lg border border-gray-100 p-5 overflow-hidden">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800">
                          What Do You Want to Sell?
                        </h2>
                        <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
                      </div>

                      <nav>
                        <ul className="space-y-3">
                          <ProductTypeOptions />
                        </ul>
                      </nav>
                    </div>
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
