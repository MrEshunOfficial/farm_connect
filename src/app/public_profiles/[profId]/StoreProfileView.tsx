import { useSelector } from "react-redux";
import { selectStoreLoading, selectStoreError } from "@/store/store.slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Store,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { IStoreProfile } from "@/models/profileI-interfaces";
import { useState } from "react";

interface StoreProfileViewProps {
  storeProfile: IStoreProfile;
}

export default function StoreProfileView({
  storeProfile,
}: StoreProfileViewProps) {
  const isLoading = useSelector(selectStoreLoading);
  const error = useSelector(selectStoreError);
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2 text-gray-500">
            <Store className="animate-spin w-5 h-5" />
            <span>Loading store profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full border-red-200">
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!storeProfile) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2 text-gray-500">
            <Store className="w-5 h-5" />
            <span>No store profile found</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const toggleBranch = (branchId: string) => {
    setExpandedBranch(expandedBranch === branchId ? null : branchId);
  };

  return (
    <Card className="max-h-[70vh] overflow-auto bg-white dark:bg-gray-900">
      <CardHeader className="bg-white dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-200">
          {storeProfile.storeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Store Info */}
        <div className="space-y-4">
          {storeProfile.description && (
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              {storeProfile.description}
            </p>
          )}
          <Separator className="my-6 dark:bg-gray-700" />
        </div>

        {/* Branches */}
        {storeProfile.branches && storeProfile.branches.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-200">
              <Store className="w-5 h-5" />
              Store Branches
            </h3>
            <div className="grid gap-4">
              {storeProfile.branches.map((branch) => (
                <Card
                  key={branch._id}
                  className="bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-4">
                    <button
                      onClick={() => toggleBranch(branch._id)}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-lg text-gray-900 dark:text-gray-200">
                          {branch.branchName}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                          >
                            {branch.branchLocation}
                          </Badge>
                          {expandedBranch === branch._id ? (
                            <ChevronUp className="w-4 h-4 text-gray-900 dark:text-gray-200" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-900 dark:text-gray-200" />
                          )}
                        </div>
                      </div>
                    </button>

                    <div
                      className={`grid gap-3 overflow-hidden transition-all duration-300 ${
                        expandedBranch === branch._id
                          ? "mt-4 max-h-48"
                          : "max-h-0"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-200">
                        <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span>{branch.branchLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-200">
                        <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <a
                          href={`tel:${branch.branchPhone}`}
                          className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                          {branch.branchPhone}
                        </a>
                      </div>
                      {branch.branchEmail && (
                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-200">
                          <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <a
                            href={`mailto:${branch.branchEmail}`}
                            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                          >
                            {branch.branchEmail}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {storeProfile.storeImages && storeProfile.storeImages.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-200">
              <Store className="w-5 h-5" />
              Gallery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storeProfile.storeImages.map((image) => (
                <Card
                  key={image._id}
                  className="overflow-hidden bg-white dark:bg-gray-800 group transition-all duration-300 hover:shadow-xl"
                  onMouseEnter={() => setHoveredImage(image._id)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <div className="flex flex-col">
                    <div className="relative">
                      <div className="h-48 overflow-hidden">
                        <Avatar className="w-full h-full rounded-md">
                          <AvatarImage
                            src={image.url}
                            alt={image.itemName}
                            className={`object-cover w-full h-full transition-transform duration-300 ${
                              hoveredImage === image._id
                                ? "scale-105"
                                : "scale-100"
                            }`}
                          />
                        </Avatar>
                      </div>
                      {typeof image.available !== "undefined" && (
                        <Badge
                          variant={image.available ? "default" : "secondary"}
                          className={`absolute top-2 right-2 ${
                            image.available
                              ? "bg-[#6BAE40]/90 dark:bg-[#A4C639]/90"
                              : "bg-red-500/90"
                          } text-white backdrop-blur-sm`}
                        >
                          {image.available ? "In Stock" : "Out of Stock"}
                        </Badge>
                      )}
                    </div>
                    <div className="w-full flex items-center justify-between p-4 my-2 flex-wrap gap-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-200 line-clamp-2">
                        {image.itemName}
                      </h4>
                      <Badge className=" font-semibold text-[#6BAE40] dark:text-[#A4C639]">
                        {image.currency} {image.itemPrice}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
