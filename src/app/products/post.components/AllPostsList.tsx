import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPosts,
  selectAllFarmPosts,
  selectAllStorePosts,
  selectPostsLoading,
  selectPostsError,
} from "@/store/post.slice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ShoppingBag,
  TagIcon,
  AlertCircle,
  MapPin,
  Sprout,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { AppDispatch } from "@/store";

const EnhancedPostsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [filter, setFilter] = useState("all");

  const farmPosts = useSelector(selectAllFarmPosts);
  const storePosts = useSelector(selectAllStorePosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  useEffect(() => {
    dispatch(fetchAllPosts({ page: 1, limit: 12 }));
  }, [dispatch]);

  interface PostCardProps {
    post: any;
    type: string;
  }

  const PostCard: React.FC<PostCardProps> = ({ post, type }) => {
    const isFarm = type === "farm";
    const imageUrl = isFarm ? post.productImages[0]?.url : post.storeImage.url;
    const title = isFarm
      ? post.product.nameOfProduct
      : post.storeImage.itemName;
    const location = isFarm
      ? `${post.FarmProfile?.farmLocation?.region || post.postLocation?.region}`
      : post.storeLocation.region;

    return (
      <Link href={`/products/${type}s/${post._id}`}>
        <Card className="group h-full transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-0">
            <div className="relative">
              <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                <Image
                  src={imageUrl || "/default-image.jpg"}
                  alt={title}
                  layout="fill"
                  objectFit="cover"
                  className="transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <Badge
                className={`absolute top-3 left-3 ${
                  isFarm
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {isFarm ? (
                  <Sprout size={14} className="mr-1" />
                ) : (
                  <ShoppingBag size={14} className="mr-1" />
                )}
                {isFarm ? "Farm" : "Store"}
              </Badge>
            </div>

            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-lg line-clamp-1 capitalize">
                {title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {isFarm ? post.product.description : post.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin size={14} />
                  {location}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar size={14} />
                  {moment(post.createdAt).fromNow()}
                </Badge>
              </div>

              <div className="pt-2 border-t">
                <p className="font-medium text-primary flex items-center gap-2">
                  <TagIcon size={16} />
                  {isFarm
                    ? `${post.product.currency} ${post.product.pricePerUnit}/${post.product.unit}`
                    : `${post.storeImage.currency} ${post.storeImage.itemPrice}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="border-destructive/50 bg-destructive/10 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive font-medium">Error: {error}</p>
          </div>
        </Card>
      </div>
    );
  }

  const allPosts = [...farmPosts, ...storePosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredPosts =
    filter === "all" ? allPosts : filter === "farm" ? farmPosts : storePosts;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">
            Featured Products
          </h1>

          <div className="flex items-center gap-2">
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("all")}
            >
              All
            </Badge>
            <Badge
              variant={filter === "farm" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("farm")}
            >
              Farms
            </Badge>
            <Badge
              variant={filter === "store" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("store")}
            >
              Stores
            </Badge>
          </div>
        </div>

        {loading && !filteredPosts.length ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No posts found
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id.toString()}
                post={post}
                type={"FarmProfile" in post ? "farm" : "store"}
              />
            ))}
          </div>
        )}

        {loading && filteredPosts.length > 0 && (
          <div className="flex justify-center py-4">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPostsList;
