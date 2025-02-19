"use client";

import { useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Users,
  Landmark,
  ClipboardList,
  Building,
  AlertCircle,
  Map,
  TractorIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import FarmImageUpdate from "../FarmComponent/FarmImageUpdate";
import FarmShare from "../FarmComponent/FarmShare";
import RenderFarmImages from "../FarmComponent/RenderFarmImages";
import FarmProductionDetails from "../../FarmProductionDetails";

export default function FarmListDetails() {
  const params = useParams();
  const paramsId = params.id as string;
  const { farmProfiles, loading, error } = useAppSelector(
    (state) => state.farmProfiles
  );

  const farm = farmProfiles.find((f) => f._id.toString() === paramsId);

  if (loading === "pending") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-base font-medium text-gray-700">
            Loading farm details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-red-500">
              <AlertCircle className="w-12 h-12 text-yellow-500" />
              <p className="text-base font-medium">Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {farm ? (
        <div className="w-full h-[77vh] overflow-auto bg-gray-50 dark:bg-gray-800 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <Card className="w-full overflow-hidden bg-yellow-500">
              <CardHeader className="w-full p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-grow min-w-0">
                  {Array.isArray(farm.farmImages) &&
                    farm.farmImages.length > 0 && (
                      <Avatar className="w-16 h-16 flex-shrink-0">
                        <AvatarImage
                          src={
                            Array.isArray(farm.farmImages[0])
                              ? farm.farmImages[0][0]?.url
                              : farm.farmImages[0]?.url
                          }
                          alt={
                            Array.isArray(farm.farmImages[0])
                              ? farm.farmImages[0][0]?.fileName
                              : farm.farmImages[0]?.fileName
                          }
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {farm.farmName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  <div className="flex flex-col min-w-0">
                    <CardTitle className="text-xl font-semibold truncate text-gray-900 dark:text-gray-100">
                      {farm.farmName}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {farm.farmType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 sm:ml-auto">
                  <FarmShare farm={farm} />
                </div>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-blue-700">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Landmark className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-sm text-gray-700">
                        Farm Location
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {farm.farmLocation?.region ?? ""}{" "}
                        {farm.farmLocation?.district
                          ? `- ${farm.farmLocation.district}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  {farm.gpsAddress && (
                    <div className="flex items-start gap-3">
                      <Map className="w-5 h-5 text-yellow-500 mt-1" />
                      <div>
                        <p className="font-medium text-sm text-gray-700">
                          GPS Address
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {farm.gpsAddress}
                        </p>
                      </div>
                    </div>
                  )}
                  {farm.nearbyLandmarks && farm.nearbyLandmarks.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium text-sm text-gray-700">
                          Nearby Landmarks
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {farm.nearbyLandmarks.map(
                            (landmark: string, i: number) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
                                {landmark}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Farm Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-blue-700">
                    <TractorIcon className="w-5 h-5 text-yellow-500" />
                    Farm Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Farm Size
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {farm.farmSize} acres
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Ownership
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {farm.ownershipStatus}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Scale
                      </p>
                      <Badge variant="outline" className="text-xs font-medium">
                        {farm.productionScale}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Type
                      </p>
                      <Badge variant="outline" className="text-xs font-medium">
                        {farm.farmType}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-blue-700">
                    <Phone className="w-5 h-5 text-yellow-500" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm text-gray-700">
                        Contact Person
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {farm.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-sm text-gray-700">Phone</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {farm.contactPhone}
                      </p>
                    </div>
                  </div>
                  {farm.contactEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm text-gray-700">
                          Email
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {farm.contactEmail}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Production Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-blue-700">
                    <ClipboardList className="w-5 h-5 text-yellow-500" />
                    Production Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FarmProductionDetails
                    farm={{
                      ...farm,
                      cropsGrown: farm.cropsGrown ?? [],
                      livestockProduced: farm.livestockProduced ?? [],
                      mixedCropsGrown: farm.mixedCropsGrown ?? [],
                      aquacultureType: farm.aquacultureType ?? [],
                      nurseryType: farm.nurseryType ?? [],
                      poultryType: farm.poultryType ?? [],
                      othersType: farm.othersType ?? [],
                    }}
                  />
                  {farm.belongsToCooperative && (
                    <div className="mt-4">
                      <p className="font-medium text-sm text-gray-700">
                        Cooperative Membership
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {farm.cooperativeName}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Farm Images */}
            {farm.farmImages && farm.farmImages.length > 0 ? (
              <RenderFarmImages farm={farm} />
            ) : (
              <FarmImageUpdate
                farmId={farm._id.toString()}
                existingImages={farm.farmImages}
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
