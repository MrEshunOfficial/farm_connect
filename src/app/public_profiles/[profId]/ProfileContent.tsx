// ProfileContent.tsx
import React from "react";
import { useRouter } from "next/navigation";

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
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  activeProfile,
  postsLoading,
  postsError,
  farmPosts,
  storePosts,
}) => {
  const router = useRouter();

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
      <Card className="h-full shadow-md border-0">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-red-500 py-8">
          <p>Error loading content: {postsError}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // User with either farm or store but not both
  if (
    activeProfile?.role === UserRole.Farmer ||
    activeProfile?.role === UserRole.Seller
  ) {
    const isFarmer = activeProfile.role === UserRole.Farmer;
    const posts = isFarmer ? farmPosts : storePosts;
    const PostsList = isFarmer ? FarmPostsList : StorePostsList;
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

  // User with both farm and store
  return (
    <Card className="h-full shadow-md border-0">
      <CardHeader>
        <CardTitle>Marketplace Listings</CardTitle>
        <CardDescription>
          Browse all offerings from {activeProfile?.username}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="store-posts" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-3 px-3 pt-3">
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
