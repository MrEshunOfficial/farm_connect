import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingBag, TagIcon, AlertCircle } from "lucide-react";
import Link from "next/link";
import { selectPostsError, selectPostsLoading } from "@/store/post.slice";
import { useSelector } from "react-redux";
import { ScrollArea } from "@radix-ui/react-scroll-area";
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
  <Link href={href} passHref>
    <Card className="w-full group h-full hover:shadow-xl transition-all duration-300 bg-background/50 hover:bg-background border-2">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
          <Image
            src={imageSrc}
            alt={imageAlt}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold capitalize line-clamp-1 tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary flex-shrink-0" />
            {title}
          </h3>

          <p className="flex items-center gap-2 text-base font-bold text-primary">
            <TagIcon className="h-4 w-4 flex-shrink-0" />
            {rentOptions
              ? `Rate: ${currency} ${price}/${rentUnit}`
              : `Price: ${currency} ${price}`}
          </p>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline" className="text-xs">
              {condition}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {category} - {subcategory}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const StorePostsList: React.FC<StorePostsListProps> = ({ storePosts }) => {
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!storePosts) return <EmptyState type="store" />;

  return (
    <ScrollArea className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
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
      </div>
    </ScrollArea>
  );
};

const FarmPostsList: React.FC<FarmPostsListProps> = ({ farmPosts }) => {
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!farmPosts) return <EmptyState type="farm" />;

  return (
    <ScrollArea className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
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
      </div>
    </ScrollArea>
  );
};

export { FarmPostsList, StorePostsList };
