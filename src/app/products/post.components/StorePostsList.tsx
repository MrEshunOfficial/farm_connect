import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingBag, TagIcon, AlertCircle } from "lucide-react";
import Link from "next/link";
import { selectPostsError, selectPostsLoading } from "@/store/post.slice";
import { useSelector } from "react-redux";
import {
  IFarmPostDocument,
  IStorePostDocument,
} from "@/models/profileI-interfaces";

interface StorePostsListProps {
  storePosts: IStorePostDocument[];
}

interface FarmPostsListProps {
  farmPosts: IFarmPostDocument[];
}

const LoadingState = () => (
  <div className="flex items-center justify-center w-full h-96">
    <div className="flex flex-col items-center gap-6">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-xl font-medium text-muted-foreground">
        Loading posts...
      </p>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="w-full rounded-xl border-2 border-destructive/50 bg-destructive/5 p-8 my-4">
    <div className="flex items-center gap-3 text-destructive">
      <AlertCircle className="h-6 w-6" />
      <p className="text-lg font-medium">Error: {error}</p>
    </div>
  </div>
);

const EmptyState = ({ type }: { type: "store" | "farm" }) => (
  <div className="flex items-center justify-center h-96">
    <p className="text-xl font-medium text-muted-foreground">
      No {type} posts found
    </p>
  </div>
);

interface PostCardProps {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  price: number;
  currency?: string;
  description: string;
  condition: string;
  category: string;
  subcategory: string;
  rentOptions?: boolean;
  rentUnit?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  href,
  imageSrc,
  imageAlt,
  title,
  price,
  currency = "GHS",
  description,
  condition,
  category,
  subcategory,
  rentOptions = false,
  rentUnit = "",
}) => (
  <Link href={href} passHref className="block h-full">
    <Card className="h-full flex flex-col group overflow-hidden hover:shadow-xl transition-all duration-300 bg-background/50 hover:bg-background border hover:border-primary/20 border-border">
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant="secondary"
            className="font-medium bg-background/80 backdrop-blur-sm"
          >
            {condition}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          <h3 className="text-base font-semibold capitalize tracking-tight line-clamp-1 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="truncate">{title}</span>
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        <div className="space-y-3 mt-auto">
          <div className="flex items-center">
            <Badge variant="outline" className="text-xs truncate max-w-full">
              {category} - {subcategory}
            </Badge>
          </div>

          <p className="flex items-center gap-2 text-base font-bold text-primary">
            <TagIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {rentOptions
                ? `${currency} ${price.toLocaleString()}/${rentUnit}`
                : `${currency} ${price.toLocaleString()}`}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const PostsGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    {children}
  </div>
);

const StorePostsList: React.FC<StorePostsListProps> = ({ storePosts }) => {
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!storePosts?.length) return <EmptyState type="store" />;

  return (
    <div className="w-full px-4 py-6">
      <PostsGrid>
        {storePosts.map((post) => (
          <PostCard
            key={post._id.toString()}
            href={`/products/stores/${post._id}`}
            imageSrc={post.storeImage.url}
            imageAlt={post.storeImage.itemName}
            title={post.storeImage.itemName}
            price={parseFloat(post.storeImage.itemPrice)}
            currency={post.storeImage.currency}
            description={post.description}
            condition={post.condition || "Very Good"}
            category={post.category.name}
            subcategory={post.subcategory.name}
            rentOptions={post.product.rentOptions}
            rentUnit={post.product.rentUnit}
          />
        ))}
      </PostsGrid>
    </div>
  );
};

const FarmPostsList: React.FC<FarmPostsListProps> = ({ farmPosts }) => {
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!farmPosts?.length) return <EmptyState type="farm" />;

  return (
    <div className="w-full px-4 py-6">
      <PostsGrid>
        {farmPosts.map((post) => (
          <PostCard
            key={post._id.toString()}
            href={`/products/farms/${post._id}`}
            imageSrc={post.productImages[0].url}
            imageAlt={post.productImages[0].fileName || "Product image"}
            title={post.product.nameOfProduct}
            price={post.product.productPrice ?? 0}
            currency={post.product.currency}
            description={post.product.description}
            condition={post.product.quality_grade || "Very Good"}
            category={post.category.name}
            subcategory={post.subcategory.name}
          />
        ))}
      </PostsGrid>
    </div>
  );
};

export { FarmPostsList, StorePostsList };
