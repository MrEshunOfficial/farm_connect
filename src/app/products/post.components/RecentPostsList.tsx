import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPosts,
  selectAllFarmPosts,
  selectAllStorePosts,
  selectPostsError,
} from "@/store/post.slice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Sprout, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import moment from "moment";
import { AppDispatch } from "@/store";
import { Types } from "mongoose";

const MinimalRecentPosts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  const farmPosts = useSelector(selectAllFarmPosts);
  const storePosts = useSelector(selectAllStorePosts);
  const error = useSelector(selectPostsError);

  useEffect(() => {
    dispatch(fetchAllPosts({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentPosts = [...farmPosts, ...storePosts]
    .filter((post) => new Date(post.createdAt) > oneWeekAgo)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  if (error) {
    return (
      <div className="w-full mb-8">
        <Card className="border-destructive/50 bg-destructive/10 dark:bg-destructive/20">
          <div className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive font-medium">
              Error loading recent posts
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!recentPosts.length) {
    return null;
  }

  interface Post {
    _id: string;
    createdAt: Date;
    productImages?: { url: string }[];
    storeImage?: { url: string; itemName: string };
    product?: {
      nameOfProduct?: string;
      rentOptions?: boolean;
      rentPricing?: number;
      rentUnit?: string;
      negotiable?: boolean;
      discount?: boolean;
      bulk_discount?: string;
      rentInfo?: string;
    };
    storeProfile?: {
      _id: string | Types.ObjectId;
      storeName: string;
      description?: string;
      branches?: any[];
    };
    FarmProfile?: any;
  }

  const RecentPostCard = ({ post }: { post: Post }) => {
    const isFarm = "FarmProfile" in post;
    const imageUrl = isFarm
      ? post.productImages?.[0]?.url
      : post.storeImage?.url;
    const title = isFarm
      ? post.product?.nameOfProduct
      : post.storeImage?.itemName;
    const postType = isFarm ? "farms" : "stores";

    return (
      <Link href={`/products/${postType}/${post._id}`}>
        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 dark:bg-gray-800">
          <CardContent className="p-0">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={imageUrl || "/default-image.jpg"}
                alt={title || "Default title"}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-medium line-clamp-1 mb-1">
                  {title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-xs flex items-center gap-1 dark:bg-gray-700 dark:text-white"
                  >
                    {isFarm ? (
                      <>
                        <Sprout size={12} className="text-green-600" /> Farm
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={12} className="text-blue-600" />{" "}
                        Store
                      </>
                    )}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-xs flex items-center gap-1 dark:bg-gray-700 dark:text-white"
                  >
                    <Clock size={12} />
                    {moment(post.createdAt).fromNow()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <section className="w-full max-w-7xl mx-auto mb-12">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between px-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight dark:text-white">
              Recent Products
            </h2>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Fresh additions from the last 7 days
            </p>
          </div>
        </div>

        <div className="relative px-4">
          <div className="relative">
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {recentPosts.map((post) => (
                  <CarouselItem
                    key={post._id.toString()}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <RecentPostCard
                      post={{ ...post, _id: post._id.toString() }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="hidden sm:flex absolute left-0 -translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-background dark:bg-gray-700 dark:hover:bg-primary" />
              <CarouselNext className="hidden sm:flex absolute right-0 translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-background dark:bg-gray-700 dark:hover:bg-primary" />
            </Carousel>
          </div>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
            {recentPosts.map((_, index) => (
              <button
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  current === index
                    ? "bg-primary"
                    : "bg-primary/20 dark:bg-primary/40"
                }`}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MinimalRecentPosts;
