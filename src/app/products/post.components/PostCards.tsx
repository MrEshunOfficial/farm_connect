import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  TagIcon,
  MapPin,
  HeartPulse,
  Sprout,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import {
  IFarmPostDocument,
  IStorePostDocument,
} from "@/models/profileI-interfaces";

interface PostDateProps {
  date: Date;
  className?: string;
}

const PostDate: React.FC<PostDateProps> = ({ date, className }) => (
  <div
    className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
  >
    <Clock size={14} />
    <time dateTime={date.toISOString()}>
      {moment(date).format("MMMM D, YYYY [at] h:mm A")}
    </time>
  </div>
);

export const FarmPostCard: React.FC<{ post: IFarmPostDocument }> = ({
  post,
}) => (
  <Link href={`/products/farms/${post._id}`} className="block">
    <Card className="group hover:shadow-xl transition-all duration-300 h-full bg-white/50 backdrop-blur-sm border-2">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-48 aspect-square rounded-xl overflow-hidden">
            <Image
              src={post.productImages[0]?.url || "/default-image.jpg"}
              alt={post.product.nameOfProduct}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-green-600 mb-1">
                <Sprout size={20} className="text-green-500" />
                {post.product.nameOfProduct}
              </h3>
              <PostDate date={new Date(post.createdAt)} />
            </div>

            <div className="flex items-center gap-2 text-primary font-medium">
              <TagIcon size={18} className="text-primary/80" />
              {post.product.pricingMethod === "unit" ? (
                <span>
                  {post.product.currency} {post.product.pricePerUnit}/
                  {post.product.unit}
                </span>
              ) : (
                <span>
                  {post.product.currency} {post.product.productPrice}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {post.product.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-primary/5 hover:bg-primary/10"
              >
                <MapPin size={14} className="mr-1" />
                {post.useFarmLocation
                  ? `${post.FarmProfile?.farmLocation?.region || ""} - ${
                      post.FarmProfile?.farmLocation?.district || ""
                    }`
                  : `${post.postLocation?.region || ""} - ${
                      post.postLocation?.district || ""
                    }`}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-primary/5 hover:bg-primary/10"
              >
                <HeartPulse size={14} className="mr-1" />
                Grade: {post.product.quality_grade}
              </Badge>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-green-50">
                {post.category.name}
              </Badge>
              <Badge variant="outline" className="bg-green-50">
                {post.subcategory.name}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export const StorePostCard: React.FC<{ post: IStorePostDocument }> = ({
  post,
}) => (
  <Link href={`/products/store/${post._id}`} className="block">
    <Card className="group hover:shadow-xl transition-all duration-300 h-full bg-white/50 backdrop-blur-sm border-2">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-48 aspect-square rounded-xl overflow-hidden">
            <Image
              src={post.storeImage.url}
              alt={post.storeImage.itemName}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-600 mb-1">
                <ShoppingBag size={20} className="text-yellow-500" />
                {post.storeImage.itemName}
              </h3>
              <PostDate date={new Date(post.createdAt)} />
            </div>

            <div className="flex items-center gap-2 text-primary font-medium">
              <TagIcon size={18} className="text-primary/80" />
              {post.product.rentOptions ? (
                <span>
                  {post.storeImage.currency || "GHS"}{" "}
                  {post.storeImage.itemPrice}/{post.product.rentUnit}
                </span>
              ) : (
                <span>
                  {post.storeImage.currency || "GHS"}{" "}
                  {post.storeImage.itemPrice}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {post.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-primary/5 hover:bg-primary/10"
              >
                <MapPin size={14} className="mr-1" />
                {post.storeLocation.region || ""} -{" "}
                {post.storeLocation.district || ""}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-primary/5 hover:bg-primary/10"
              >
                <HeartPulse size={14} className="mr-1" />
                {post.condition || "Very Good"} condition
              </Badge>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-yellow-50">
                {post.category.name}
              </Badge>
              <Badge variant="outline" className="bg-yellow-50">
                {post.subcategory.name}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);
