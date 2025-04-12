import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  StarIcon,
  Store,
  TractorIcon,
} from "lucide-react";
import {
  fetchProfiles,
  selectUserProfiles,
  selectPagination,
  selectUserProfileLoading,
  setPage,
} from "@/store/profile.slice";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { IUserProfile } from "@/models/profileI-interfaces";

const ProfileList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useAppSelector((state) => selectUserProfiles(state));
  const pagination = useAppSelector((state) => selectPagination(state));
  const loading = useAppSelector((state) => selectUserProfileLoading(state));
  const [farmerProfiles, setFarmerProfiles] = useState<IUserProfile[]>([]);
  const [sellerProfiles, setSellerProfiles] = useState<IUserProfile[]>([]);
  const [activeTab, setActiveTab] = useState("farmers");
  const { data: session } = useSession();
  const userId = session?.user?.id as string;

  useEffect(() => {
    dispatch(fetchProfiles({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (profiles && profiles.length > 0) {
      setFarmerProfiles(
        profiles.filter((p) => p.role === "Farmer" || p.role === "Both")
      );
      setSellerProfiles(profiles.filter((p) => p.role === "Seller"));
    }
  }, [profiles]);

  const handleScroll = (role: string) => {
    if (loading === "pending") return;

    const nextPage = pagination.page + 1;
    dispatch(setPage(nextPage));
    dispatch(
      fetchProfiles({
        role: role as "Farmer" | "Both" | "Seller",
        page: nextPage,
        limit: pagination.limit,
      })
    );
  };

  return (
    <div className="w-full h-full p-2 dark:bg-gray-900 dark:text-gray-100 bg-white text-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3"
      >
        <h1 className="font-bold text-gray-900 dark:text-gray-100 text-xl">
          Profile Directory
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Discover and connect with farmers and sellers in our community
        </p>
      </motion.div>

      <Tabs
        defaultValue="farmers"
        className="w-full p-0"
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full p-2 mb-4 bg-gray-200 dark:bg-gray-700">
          <TabsTrigger
            value="farmers"
            className="flex items-center gap-2 w-1/2 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100"
          >
            <TractorIcon className="w-4 h-4" />
            Farmer
          </TabsTrigger>
          <TabsTrigger
            value="sellers"
            className="flex items-center gap-2 w-1/2 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100"
          >
            <Store className="w-4 h-4" />
            Store Owners
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="farmers" className="mt-0">
            <ProfileColumn
              key="farmers"
              role="Farmers"
              description="Connect with registered farmers and explore their produce"
              profiles={farmerProfiles}
              onScroll={() => handleScroll("Farmer")}
              loading={loading}
              isActive={activeTab === "farmers"}
              userId={userId}
            />
          </TabsContent>

          <TabsContent value="sellers" className="mt-0">
            <ProfileColumn
              key="sellers"
              role="Sellers"
              description="Find trusted sellers of agricultural tools and equipment"
              profiles={sellerProfiles}
              onScroll={() => handleScroll("Seller")}
              loading={loading}
              isActive={activeTab === "sellers"}
              userId={userId}
            />
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

interface ProfileColumnProps {
  role: string;
  description: string;
  profiles: IUserProfile[];
  onScroll: () => void;
  loading: string;
  isActive: boolean;
  userId: string;
}

const ProfileColumn: React.FC<ProfileColumnProps> = ({
  role,
  description,
  profiles,
  onScroll,
  loading,
  isActive,
  userId,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      exit="exit"
      variants={containerVariants}
      className="w-full flex flex-col"
    >
      <div className="mb-3">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">
          {role}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
          {description}
        </p>
      </div>

      <ScrollArea
        className="flex-1 border rounded-lg bg-gray-50/50 dark:bg-gray-800/50"
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            onScroll();
          }
        }}
      >
        <div className="p-2 space-y-4">
          {profiles.map((profile) => (
            <motion.div key={profile._id.toString()} variants={itemVariants}>
              <Card className="shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-700 dark:hover:bg-gray-600">
                <div className="flex items-center p-4">
                  <CardHeader className="p-0">
                    <Avatar className="w-14 h-14 rounded-full ring-2 ring-gray-100 dark:ring-gray-600">
                      <AvatarImage
                        src={
                          typeof profile?.profilePicture === "string"
                            ? profile?.profilePicture
                            : profile?.profilePicture?.url ||
                              "https://images.pexels.com/photos/916406/pexels-photo-916406.jpeg?auto=compress&cs=tinysrgb&w=600"
                        }
                        alt={profile?.username || "Profile picture"}
                        className="object-cover"
                      />
                    </Avatar>
                  </CardHeader>
                  <CardContent className="p-0 ml-3">
                    <h3 className="w-full flex items-center justify-between capitalize">
                      <span className="flex flex-col items-start">
                        <b className="dark:text-gray-100">{profile.fullName}</b>
                        <small className="dark:text-gray-400">
                          {profile.userId === userId && "(my profile)"}
                        </small>
                      </span>
                      {!profile.verified && (
                        <StarIcon size={16} className="text-yellow-500" />
                      )}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {profile.country}
                      </span>
                      <span>•</span>
                      <Link
                        href={
                          profile.userId === userId
                            ? "/profile"
                            : `/public_profiles/${profile._id}`
                        }
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        <small>View Profile</small>
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
          {loading === "pending" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4 text-center text-gray-500 dark:text-gray-400"
            >
              Loading more profiles...
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default ProfileList;
