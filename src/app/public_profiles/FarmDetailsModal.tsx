import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Users,
  ScrollText,
  Info,
  Calendar,
  Rows2,
  Leaf,
} from "lucide-react";
import RenderFarmImages from "../profile/Farms/FarmComponent/RenderFarmImages";
import { IFarmProfile } from "@/models/profileI-interfaces";

interface FarmDetailsModalProps {
  farm: IFarmProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

const FarmDetailsModal: React.FC<FarmDetailsModalProps> = ({
  farm,
  isOpen,
  onClose,
}) => {
  if (!farm) return null;

  const getFarmImage = (images: { url: string; fileName: string }[]) => {
    if (images.length === 0) return null;
    const firstImage = images[0];
    return Array.isArray(firstImage) ? firstImage[0] : firstImage;
  };

  const farmImage = getFarmImage(farm.farmImages || []);

  const SectionTitle = ({
    icon,
    title,
  }: {
    icon: React.ReactNode;
    title: string;
  }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="font-semibold text-base">{title}</h3>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 rounded-md border shadow-sm">
              {farmImage ? (
                <AvatarImage
                  src={farmImage.url}
                  alt={farmImage.fileName}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-primary/10 text-xl font-medium rounded-md">
                  {farm.farmName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold">
                {farm.farmName}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 font-medium">
                  {farm.farmType}
                </Badge>
                <Badge variant="outline" className="bg-primary/5 font-medium">
                  {farm.productionScale}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Location Information */}
            <Card className="overflow-hidden border rounded-lg shadow-sm">
              <CardContent className="p-4">
                <SectionTitle
                  icon={<MapPin size={16} className="text-primary" />}
                  title="Location Details"
                />
                <div className="grid gap-2 text-sm pl-2">
                  <div className="flex">
                    <span className="w-24 font-medium text-muted-foreground">
                      Region:
                    </span>
                    <span>{farm.farmLocation.region}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-medium text-muted-foreground">
                      District:
                    </span>
                    <span>{farm.farmLocation.district}</span>
                  </div>
                  {farm.gpsAddress && (
                    <div className="flex">
                      <span className="w-24 font-medium text-muted-foreground">
                        GPS:
                      </span>
                      <span>{farm.gpsAddress}</span>
                    </div>
                  )}
                  {farm.nearbyLandmarks && farm.nearbyLandmarks.length > 0 && (
                    <div className="flex">
                      <span className="w-24 font-medium text-muted-foreground">
                        Landmarks:
                      </span>
                      <span>{farm.nearbyLandmarks.join(", ")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="overflow-hidden border rounded-lg shadow-sm">
              <CardContent className="p-4">
                <SectionTitle
                  icon={<Phone size={16} className="text-primary" />}
                  title="Contact Information"
                />
                <div className="grid gap-2 text-sm pl-2">
                  <div className="flex">
                    <span className="w-24 font-medium text-muted-foreground">
                      Person:
                    </span>
                    <span>{farm.fullName}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-medium text-muted-foreground">
                      Phone:
                    </span>
                    <span>{farm.contactPhone}</span>
                  </div>
                  {farm.contactEmail && (
                    <div className="flex">
                      <span className="w-24 font-medium text-muted-foreground">
                        Email:
                      </span>
                      <span>{farm.contactEmail}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Farm Details */}
            <Card className="overflow-hidden border rounded-lg shadow-sm">
              <CardContent className="p-4">
                <SectionTitle
                  icon={<Info size={16} className="text-primary" />}
                  title="Farm Details"
                />
                <div className="grid gap-2 text-sm pl-2">
                  <div className="flex">
                    <span className="w-24 font-medium text-muted-foreground">
                      Size:
                    </span>
                    <span>{farm.farmSize} acres</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-medium text-muted-foreground">
                      Ownership:
                    </span>
                    <span>{farm.ownershipStatus}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-medium text-muted-foreground">
                      Scale:
                    </span>
                    <span>{farm.productionScale}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Production Details */}
            <Card className="overflow-hidden border rounded-lg shadow-sm">
              <CardContent className="p-4">
                <SectionTitle
                  icon={<Leaf size={16} className="text-primary" />}
                  title="Production Details"
                />
                <div className="grid gap-3 text-sm pl-2">
                  {farm.cropsGrown && farm.cropsGrown.length > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Crops:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {farm.cropsGrown.map((crop, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-secondary/20"
                          >
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {farm.livestockProduced &&
                    farm.livestockProduced.length > 0 && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          Livestock:
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {farm.livestockProduced.map((livestock, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-secondary/20"
                            >
                              {livestock}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  {farm.aquacultureType && farm.aquacultureType.length > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Aquaculture:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {farm.aquacultureType.map((type, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-secondary/20"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {farm.nurseryType && farm.nurseryType.length > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Nursery:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {farm.nurseryType.map((type, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-secondary/20"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {farm.poultryType && farm.poultryType.length > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Poultry:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {farm.poultryType.map((type, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-secondary/20"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cooperative Information */}
            {farm.belongsToCooperative && (
              <Card className="overflow-hidden border rounded-lg shadow-sm">
                <CardContent className="p-4">
                  <SectionTitle
                    icon={<Users size={16} className="text-primary" />}
                    title="Cooperative Information"
                  />
                  <div className="grid gap-2 text-sm pl-2">
                    <div className="flex">
                      <span className="w-24 font-medium text-muted-foreground">
                        Name:
                      </span>
                      <span>{farm.cooperativeName}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Notes */}
            {farm.additionalNotes && (
              <Card className="overflow-hidden border rounded-lg shadow-sm">
                <CardContent className="p-4">
                  <SectionTitle
                    icon={<ScrollText size={16} className="text-primary" />}
                    title="Additional Notes"
                  />
                  <p className="text-sm pl-2">{farm.additionalNotes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Farm Images */}
        {farm.farmImages && farm.farmImages.length > 0 && (
          <div className="mt-6">
            <Card className="overflow-hidden border rounded-lg shadow-sm">
              <CardContent className="p-4">
                <SectionTitle
                  icon={<Rows2 size={16} className="text-primary" />}
                  title="Farm Gallery"
                />
                <RenderFarmImages farm={farm} />
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FarmDetailsModal;
