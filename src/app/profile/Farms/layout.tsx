"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import {
  Search,
  Store,
  ChevronRight,
  Plus,
  Loader2,
  ExternalLinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/store/hooks";
import { fetchFarmProfiles } from "@/store/farm.slice";
import { ReactNode } from "react";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const Layout = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const userId = session?.user?.id as string;
  const [searchTerm, setSearchTerm] = useState("");
  const { farmProfiles, currentFarmProfile, loading, error } = useAppSelector(
    (state) => state.farmProfiles
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchFarmProfiles({ userId: userId, page: 1, limit: 10 }));
    }
  }, [dispatch, userId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const renderFarmList = () => {
    if (loading === "pending") {
      return (
        <div className="flex items-center justify-center min-h-32 p-6 text-gray-500 border border-dashed rounded-lg dark:text-gray-400 dark:border-gray-700">
          <Loader2 className="animate-spin w-5 h-5 mr-2" />
          <span className="font-medium">Loading farms...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 text-red-500 bg-red-50 border border-red-100 rounded-lg dark:text-red-400 dark:bg-red-900 dark:border-red-700">
          <p className="font-semibold mb-1">Error occurred</p>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      );
    }

    // Type-safe filtering with null checks
    const filteredFarms = farmProfiles.filter((farm) => {
      if (!farm?.farmName) return false;
      return farm.farmName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (!filteredFarms.length) {
      return (
        <div className="flex flex-col items-center justify-center min-h-32 p-6 text-gray-500 border border-dashed rounded-lg dark:text-gray-400 dark:border-gray-700">
          <Store className="w-10 h-10 mb-2 opacity-50" />
          <p className="font-medium">No farms found</p>
          <p className="text-sm opacity-75">Try adjusting your search terms</p>
        </div>
      );
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {filteredFarms.map((farm) => (
          <motion.div
            key={farm._id.toString()}
            variants={itemVariants}
            className="group"
          >
            <Link href={`/profile/Farms/${farm._id}`}>
              <div
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentFarmProfile?._id === farm._id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "border hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    {Array.isArray(farm.farmImages) &&
                      farm.farmImages.length > 0 && (
                        <Avatar className="w-11 h-11">
                          <AvatarImage
                            src={
                              Array.isArray(farm.farmImages[0])
                                ? farm.farmImages[0][0]?.url
                                : farm.farmImages[0]?.url
                            }
                            alt={
                              Array.isArray(farm.farmImages[0])
                                ? farm.farmImages[0][0]?.fileName
                                : farm.farmImages[0]?.fileName
                            }
                            className="object-cover w-full"
                          />
                          <AvatarFallback>
                            {farm.farmName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col items-start">
                    <div className="w-full flex items-center justify-between gap-2">
                      <p className="flex-1 text-start text-sm truncate text-blue-500 dark:text-blue-400">
                        {farm.farmName}
                      </p>
                      <span className="flex-1 text-end text-sm shrink-0 text-yellow-500 dark:text-yellow-400">
                        {farm.farmSize} acre(s)
                      </span>
                    </div>
                    <b className="w-full text-start text-sm mt-1 opacity-80 truncate border-t dark:border-gray-700">
                      {farm.farmType} • {farm.productionScale}
                    </b>
                  </div>

                  <ChevronRight
                    size={16}
                    className={`transform transition-all ${
                      currentFarmProfile?._id === farm._id
                        ? "text-primary-foreground opacity-100"
                        : "text-gray-400 opacity-0 group-hover:opacity-100 dark:text-gray-500"
                    } group-hover:translate-x-1`}
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full flex items-start gap-6"
    >
      <motion.aside
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="w-80 h-full flex flex-col gap-4 p-2 rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700"
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={16}
          />
          <Input
            placeholder="Search farms..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 dark:hover:scrollbar-thumb-gray-600">
          {renderFarmList()}
        </div>
        <div className="w-full flex flex-col gap-2 items-center p-2 bg-gray-200/50 rounded-lg shadow-md dark:bg-gray-800/50">
          <Link href="/profile/Farms/new">
            <Button
              size="icon"
              variant="default"
              className="bg-blue-500 text-white rounded-full flex items-center justify-center dark:bg-blue-600"
            >
              <Plus size={20} />
            </Button>
          </Link>

          <b>Create new farm</b>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <p className="flex items-center text-xs opacity-80 p-2 cursor-pointer dark:text-gray-400">
                <span className="text-muted-foreground mr-2">Or sell a</span>
                <span className="text-yellow-500 flex items-center gap-2 p-0 dark:text-yellow-400">
                  produce
                </span>
              </p>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 dark:bg-gray-800 dark:border-gray-700">
              <DropdownMenuLabel className="group">
                <span className="text-gray-600 border-b dark:text-gray-400 dark:border-gray-700">
                  Select a farm to sell from
                </span>
              </DropdownMenuLabel>
              {farmProfiles.map((farm) => (
                <DropdownMenuItem
                  key={
                    farm?._id ? farm._id.toString() : `farm-${Math.random()}`
                  }
                  className="p-2 group border w-full mt-1 dark:border-gray-700"
                >
                  <Link
                    href={`/profile/product_post_form/farm.ad.post/${
                      farm?._id ?? ""
                    }`}
                    className="w-full"
                  >
                    <div className={`w-full flex items-center justify-between`}>
                      <p className="flex-1 flex items-center justify-between text-sm truncate">
                        <span>{farm?.farmName ?? "Unnamed Farm"}</span>
                        <ExternalLinkIcon size={14} />
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>

      <motion.section
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-md h-full"
      >
        {children}
      </motion.section>
    </motion.main>
  );
};

export default Layout;
