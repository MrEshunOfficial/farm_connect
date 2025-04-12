import React from "react";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, LogIn } from "lucide-react";
import Link from "next/link";
// Icons
import { ShoppingBag, Leaf } from "lucide-react";

// Components
import {
  FarmPostsList,
  StorePostsList,
} from "@/app/products/post.components/StorePostsList";

// Import interfaces
import {
  UserRole,
  IFarmPostDocument,
  IStorePostDocument,
} from "@/models/profileI-interfaces";
import { ExtendedUserProfile } from "./page";

interface ProfileContentProps {
  activeProfile: ExtendedUserProfile;
  postsLoading: boolean;
  postsError: string | null;
  farmPosts: IFarmPostDocument[];
  storePosts: IStorePostDocument[];
  activeTab?: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  activeProfile,
  postsLoading,
  postsError,
  farmPosts,
  storePosts,
  activeTab,
}) => {
  if (!activeProfile) {
    return (
      <Card className="h-full shadow-md border-0">
        <CardHeader>
          <CardTitle>Profile Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-500 py-8">
          <p>The requested profile could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  if (postsLoading) {
    return (
      <Card className="h-full shadow-md border-0">
        <CardHeader>
          <CardTitle>Listings</CardTitle>
          <CardDescription>Loading profile content...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="space-y-4 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-40 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (postsError) {
    return (
      <ErrorState
        profileName={activeProfile.fullName}
        loginPath="/authclient/Login"
      />
    );
  }

  let defaultTab = "store-posts";
  if (
    activeTab === "farms" ||
    (farmPosts.length > 0 && storePosts.length === 0)
  ) {
    defaultTab = "farm-posts";
  }

  const isSingleRole =
    activeProfile.role === UserRole.Farmer ||
    activeProfile.role === UserRole.Seller;

  if (isSingleRole) {
    const isFarmer = activeProfile.role === UserRole.Farmer;
    const posts = isFarmer ? farmPosts : storePosts;
    const icon = isFarmer ? (
      <Leaf className="w-5 h-5 text-green-500" />
    ) : (
      <ShoppingBag className="w-5 h-5 text-blue-500" />
    );

    return (
      <Card className="h-full shadow-md border-0">
        <CardHeader className="flex flex-row items-center gap-2 border-b">
          {icon}
          <div>
            <CardTitle>
              {isFarmer ? "Farm Listings" : "Store Listings"} ({posts.length})
            </CardTitle>
            <CardDescription>
              {posts.length === 0
                ? `No ${isFarmer ? "farm" : "store"} listings available`
                : `Browse ${activeProfile.username}'s ${
                    isFarmer ? "farm" : "store"
                  } listings`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {posts.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              <p>No listings available</p>
              <p className="text-sm mt-2">Check back later for updates</p>
            </div>
          ) : isFarmer ? (
            <FarmPostsList farmPosts={posts as IFarmPostDocument[]} />
          ) : (
            <StorePostsList storePosts={posts as IStorePostDocument[]} />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-md border-0">
      <CardHeader>
        <CardTitle>Marketplace Listings</CardTitle>
        <CardDescription>
          Browse all offerings from {activeProfile.username}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger
              value="store-posts"
              className="flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Store ({storePosts.length})
            </TabsTrigger>
            <TabsTrigger value="farm-posts" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Farm ({farmPosts.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="store-posts" className="p-3">
            {storePosts.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <p>No store listings available</p>
              </div>
            ) : (
              <StorePostsList storePosts={storePosts} />
            )}
          </TabsContent>
          <TabsContent value="farm-posts" className="p-3">
            {farmPosts.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <p>No farm listings available</p>
              </div>
            ) : (
              <FarmPostsList farmPosts={farmPosts} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfileContent;

interface ErrorStateProps {
  profileName: string;
  loginPath?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  profileName,
  loginPath = "/authclient/Login",
}) => {
  return (
    <Card className="h-full border-0 shadow-lg overflow-hidden bg-white rounded-xl">
      <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b pb-6 pt-6">
        <CardTitle className="flex items-center gap-3 text-gray-800">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <span className="text-lg font-semibold">Authentication Required</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12 px-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="bg-red-50 p-6 rounded-xl mb-4">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-white shadow-sm">
              <LogIn className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600">
              You need to be logged in to view posts from{" "}
              <span className="font-semibold text-gray-800">{profileName}</span>
            </p>
          </div>

          <Link href={loginPath} passHref>
            <Button className="mt-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-6 h-auto rounded-lg font-medium shadow-md transition-all duration-300 w-full">
              <LogIn className="h-5 w-5 mr-2" />
              Sign in to Continue
            </Button>
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            New user?{" "}
            <Link
              href="/authclient/Register"
              className="text-red-500 hover:text-red-700 underline underline-offset-2"
            >
              Create an account
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
