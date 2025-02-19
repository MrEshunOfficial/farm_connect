import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  MapPin,
  PlusIcon,
  Search,
  StoreIcon,
  TractorIcon,
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
import { Region } from "@/store/type/apiTypes";
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

interface SearchSectionProps {
  regions: Region[];
  onSearch?: (location: string, query: string) => void;
}

const SearchSection = ({ regions, onSearch }: SearchSectionProps) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    const location = selectedCity || selectedRegion?.region || "";
    onSearch?.(location, searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="w-full flex flex-col lg:flex-row items-stretch gap-4 p-2 bg-background shadow-lg overflow-hidden bg-opacity-50 backdrop-blur-lg dark:bg-gray-800 dark:bg-opacity-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between gap-2 h-12 px-4 w-full lg:w-64 dark:bg-gray-700 dark:text-white"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
              <span className="truncate">
                {selectedCity || selectedRegion?.region || "Select Location"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 dark:bg-gray-700 dark:text-white"
          align="start"
        >
          <div className="p-2">
            <div className="grid grid-cols-2 gap-2">
              <ScrollArea className="h-80 border-r pr-2 dark:border-gray-600">
                {regions?.map((region) => (
                  <Button
                    key={region.region}
                    variant={
                      selectedRegion?.region === region.region
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full justify-between mb-1 dark:bg-gray-600 dark:text-white"
                    onClick={() => setSelectedRegion(region)}
                  >
                    <span className="truncate">{region.region}</span>
                    <ChevronRight className="h-4 w-4 dark:text-gray-300" />
                  </Button>
                ))}
              </ScrollArea>

              <ScrollArea className="h-80 pl-2">
                {selectedRegion?.cities.map((city) => (
                  <Button
                    key={city}
                    variant={selectedCity === city ? "secondary" : "ghost"}
                    className="w-full justify-start mb-1 dark:bg-gray-600 dark:text-white"
                    onClick={() => {
                      setSelectedCity(city);
                      setIsOpen(false);
                    }}
                  >
                    <span className="truncate">{city}</span>
                  </Button>
                ))}
              </ScrollArea>
            </div>
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
            className="w-full h-12 pl-4 pr-10 dark:bg-gray-700 dark:text-white"
            placeholder="Search agricultural products... and press enter"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-gray-300" />
        </div>
        <div className={`w-max flex items-center justify-end mx-2`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-blue-500 text-white hover:bg-blue-600 shadow-lg rounded-full transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      <PlusIcon size={18} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-white rounded-xl shadow-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                    <h2 className="w-full text-lg text-start font-bold mb-4 text-blue-600 dark:text-blue-400">
                      What Do You Want to Sell?
                    </h2>
                    <nav>
                      <ul className="space-y-4">
                        <li>
                          <Link
                            href="/profile/f1"
                            className="flex flex-col items-start gap-2 w-full p-2 text-center bg-blue-50 hover:bg-blue-200 rounded-lg text-blue-700 font-medium transition duration-300 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-400"
                          >
                            <span className="w-full flex items-center justify-start gap-2">
                              <TractorIcon className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                              Sell Farm Produce
                            </span>
                            <span className="w-full text-start text-sm text-gray-500 dark:text-gray-400">
                              (e.g., fruits, vegetables, etc.)
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/profile/s1"
                            className="flex flex-col items-start gap-2 w-full p-2 text-center bg-blue-50 hover:bg-blue-200 rounded-lg text-blue-700 font-medium transition duration-300 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-400"
                          >
                            <span className="w-full flex items-center justify-start gap-2">
                              <StoreIcon className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                              Sell or Rent Store Products
                            </span>
                            <span className="w-full text-start text-sm text-gray-500 dark:text-gray-400">
                              (e.g., fertilizers, farm machineries, etc.)
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-gray-800 text-white text-sm py-2 px-3 rounded-md shadow-md"
              >
                Add Products to Sell
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
};

export default SearchSection;
