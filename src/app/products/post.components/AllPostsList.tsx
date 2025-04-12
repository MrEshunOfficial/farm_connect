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
  ShoppingCart,
  Heart,
  Filter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { AppDispatch, RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import useWishlist from "@/hooks/wishListUtilityHook";
import { WishlistItemType } from "@/models/profileI-interfaces";

const EnhancedPostsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [filter, setFilter] = useState("all");
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const { data: session, status } = useSession();

  const farmPosts = useSelector(selectAllFarmPosts);
  const storePosts = useSelector(selectAllStorePosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  const isAuthenticated = status === "authenticated" && !!session;

  useEffect(() => {
    if (!initialLoadDone) {
      dispatch(fetchAllPosts({ page: 1, limit: 12 }));
      setInitialLoadDone(true);
    }
  }, [dispatch, initialLoadDone]);

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
    const price = isFarm
      ? `${post.product.currency} ${post.product.pricePerUnit}/${post.product.unit}`
      : `${post.storeImage.currency} ${post.storeImage.itemPrice}`;
    const description = isFarm ? post.product.description : post.description;

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = `/cart/add/${post._id}?type=${type}`;
    };
    const { addItem, removeItem, isItemInWishlist, isAuthenticated } =
      useWishlist();

    const itemId = post._id.toString();
    const itemType =
      type === "farm"
        ? WishlistItemType.FarmProduct
        : WishlistItemType.StoreProduct;

    const [isWishlisted, setIsWishlisted] = useState(
      isItemInWishlist(itemId, itemType)
    );

    useEffect(() => {
      setIsWishlisted(isItemInWishlist(itemId, itemType));
    }, [itemId, itemType, isItemInWishlist]);

    const handleAddToWishlist = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated || !session?.user?.id) {
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
        window.location.href = "/auth/signin?redirect=/profile/wish_list";
        return;
      }

      if (isWishlisted) {
        const result = removeItem(itemId);

        if ("then" in result) {
          result
            .then((resultAction: any) => {
              setIsWishlisted(false);
            })
            .catch((error: any) => {
              console.error("Failed to remove from wishlist:", error);
            });
        } else {
          setIsWishlisted(false);
        }
      } else {
        const productName =
          type === "farm"
            ? post.product.nameOfProduct
            : post.storeImage.itemName;

        const productImage =
          type === "farm" ? post.productImages[0]?.url : post.storeImage.url;

        const price =
          type === "farm"
            ? post.product.pricePerUnit
            : post.storeImage.itemPrice;

        const currency =
          type === "farm" ? post.product.currency : post.storeImage.currency;

        const wishlistItem = {
          userId: session.user.id,
          itemId,
          itemType,
          productName,
          productImage,
          price,
          currency,
          notes: "",
        };

        const result = addItem(wishlistItem);

        if ("then" in result) {
          result
            .then((resultAction: any) => {
              setIsWishlisted(true);
            })
            .catch((error: any) => {
              console.error("Failed to add to wishlist:", error);
            });
        } else {
          setIsWishlisted(true);
        }
      }
    };

    return (
      <div className="h-full">
        <Card className="group h-full transition-all duration-300 hover:shadow-xl dark:hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden border-0 bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-700/10 rounded-xl">
          <CardContent className="p-0 flex flex-col h-full">
            <Link href={`/products/${type}s/${post._id}`}>
              <div className="relative">
                <div className="aspect-square relative overflow-hidden rounded-t-xl">
                  <Image
                    src={imageUrl || "/default-image.jpg"}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    className="transform transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <button
                    onClick={handleAddToWishlist}
                    className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full transition-all duration-300 hover:bg-white dark:hover:bg-slate-700 z-10"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={18}
                      className={`transition-colors duration-300 ${
                        isWishlisted
                          ? "text-rose-500 fill-rose-500"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    />
                  </button>
                </div>

                <Badge
                  className={`absolute top-3 left-3 font-medium rounded-full px-3 py-1 text-xs ${
                    isFarm
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  } backdrop-blur-sm shadow-sm`}
                >
                  {isFarm ? (
                    <Sprout size={14} className="mr-1" />
                  ) : (
                    <ShoppingBag size={14} className="mr-1" />
                  )}
                  {isFarm ? "Farm" : "Store"}
                </Badge>

                <div className="absolute bottom-3 right-3 bg-black/50 dark:bg-slate-900/70 text-white text-xs py-1 px-2 rounded-md backdrop-blur-sm">
                  <Calendar size={12} className="inline mr-1" />
                  {moment(post.createdAt).fromNow()}
                </div>
              </div>

              <div className="p-5 space-y-4 flex-grow">
                <h3 className="font-bold text-lg line-clamp-1 capitalize group-hover:text-primary transition-colors dark:text-white">
                  {title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                  {description}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <MapPin size={14} className="mr-1" />
                    {location}
                  </div>

                  <p className="font-semibold text-lg text-primary dark:text-indigo-400 flex items-center gap-1">
                    <TagIcon size={16} />
                    {price}
                  </p>
                </div>
              </div>
            </Link>

            <div className="mt-auto">
              <Button
                className="w-full rounded-t-none rounded-b-xl h-12 bg-primary hover:bg-primary/90 dark:bg-indigo-600 dark:hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all duration-300 text-white font-medium"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const allPosts = [...farmPosts, ...storePosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredPosts =
    filter === "all" ? allPosts : filter === "farm" ? farmPosts : storePosts;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="border-destructive/50 bg-destructive/10 dark:bg-destructive/20 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <p className="text-destructive font-medium">Error: {error}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:text-white">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight mb-2 dark:text-white">
              Featured Products
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Discover fresh farm products and unique store items
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className="cursor-pointer px-3 py-1 text-sm rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setFilter("all")}
            >
              All
            </Badge>
            <Badge
              variant={filter === "farm" ? "default" : "outline"}
              className="cursor-pointer px-3 py-1 text-sm rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setFilter("farm")}
            >
              <Sprout size={14} className="mr-1" />
              Farms
            </Badge>
            <Badge
              variant={filter === "store" ? "default" : "outline"}
              className="cursor-pointer px-3 py-1 text-sm rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setFilter("store")}
            >
              <ShoppingBag size={14} className="mr-1" />
              Stores
            </Badge>
          </div>
        </div>

        {loading && !filteredPosts.length ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader2
                size={40}
                className="animate-spin text-primary dark:text-indigo-400"
              />
              <p className="text-slate-500 dark:text-slate-400">
                Loading products...
              </p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card className="p-16 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-xl">
            <div className="text-center">
              <Filter
                size={48}
                className="mx-auto mb-4 text-slate-400 dark:text-slate-500"
              />
              <p className="text-xl font-medium text-slate-600 dark:text-slate-300 mb-2">
                No products found
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Try adjusting your filter to find what you&apos;re looking for
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
          <div className="flex justify-center py-8">
            <Loader2
              size={24}
              className="animate-spin text-primary dark:text-indigo-400"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPostsList;
