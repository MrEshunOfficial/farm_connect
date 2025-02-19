import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, Users, ScrollText, Info } from "lucide-react";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              {farmImage ? (
                <AvatarImage
                  src={farmImage.url}
                  alt={farmImage.fileName}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-primary/10 text-lg">
                  {farm.farmName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{farm.farmName}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {farm.farmType} • {farm.productionScale}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Location Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin size={18} />
              Location Details
            </h3>
            <div className="grid gap-2 text-sm pl-6">
              <p>Region: {farm.farmLocation.region}</p>
              <p>District: {farm.farmLocation.district}</p>
              {farm.gpsAddress && <p>GPS Address: {farm.gpsAddress}</p>}
              {farm.nearbyLandmarks && farm.nearbyLandmarks.length > 0 && (
                <p>Nearby Landmarks: {farm.nearbyLandmarks.join(", ")}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Phone size={18} />
              Contact Information
            </h3>
            <div className="grid gap-2 text-sm pl-6">
              <p>Contact Person: {farm.fullName}</p>
              <p>Phone: {farm.contactPhone}</p>
              {farm.contactEmail && <p>Email: {farm.contactEmail}</p>}
            </div>
          </div>

          {/* Farm Details */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Info size={18} />
              Farm Details
            </h3>
            <div className="grid gap-2 text-sm pl-6">
              <p>Farm Size: {farm.farmSize} acres</p>
              <p>Ownership: {farm.ownershipStatus}</p>
              <p>Production Scale: {farm.productionScale}</p>
            </div>
          </div>

          {/* Production Details */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <ScrollText size={18} />
              Production Details
            </h3>
            <div className="grid gap-2 text-sm pl-6">
              {farm.cropsGrown && farm.cropsGrown.length > 0 && (
                <p>Crops: {farm.cropsGrown.join(", ")}</p>
              )}
              {farm.livestockProduced && farm.livestockProduced.length > 0 && (
                <p>Livestock: {farm.livestockProduced.join(", ")}</p>
              )}
              {farm.aquacultureType && farm.aquacultureType.length > 0 && (
                <p>Aquaculture: {farm.aquacultureType.join(", ")}</p>
              )}
              {farm.nurseryType && farm.nurseryType.length > 0 && (
                <p>Nursery: {farm.nurseryType.join(", ")}</p>
              )}
              {farm.poultryType && farm.poultryType.length > 0 && (
                <p>Poultry: {farm.poultryType.join(", ")}</p>
              )}
            </div>
          </div>

          {/* Cooperative Information */}
          {farm.belongsToCooperative && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Users size={18} />
                Cooperative Information
              </h3>
              <div className="grid gap-2 text-sm pl-6">
                <p>Member of Cooperative: {farm.cooperativeName}</p>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {farm.additionalNotes && (
            <div className="space-y-3">
              <h3 className="font-semibold">Additional Notes</h3>
              <p className="text-sm pl-6">{farm.additionalNotes}</p>
            </div>
          )}
          {/* Farm Images */}
          {farm.farmImages && farm.farmImages.length > 0 && (
            <RenderFarmImages farm={farm} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FarmDetailsModal;
