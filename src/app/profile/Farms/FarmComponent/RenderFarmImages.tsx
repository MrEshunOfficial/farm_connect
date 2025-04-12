import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon, UploadCloud, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import FarmImageUpdate from "../FarmComponent/FarmImageUpdate";
import CarouselView from "./CarouselView";
import { IFarmProfile } from "@/models/profileI-interfaces";

interface RenderFarmImagesProps {
  farm: IFarmProfile;
}

const RenderFarmImages: React.FC<RenderFarmImagesProps> = ({ farm }) => {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!farm.farmImages || farm.farmImages.length === 0) {
    return <FarmImageUpdate farmId={farm._id.toString()} existingImages={[]} />;
  }

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <ImageIcon className="w-5 h-5" />
            Farm Images ({farm.farmImages.length})
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <UploadCloud
                  size={18}
                  className="text-gray-600 dark:text-gray-300"
                />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 sm:max-w-[425px]">
              <FarmImageUpdate
                farmId={farm._id.toString()}
                existingImages={farm.farmImages}
              />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>

      {/* Grid View */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {farm.farmImages.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer"
            onClick={() => {
              setCurrentSlide(index);
              setIsCarouselOpen(true);
            }}
          >
            <Avatar className="w-full h-full">
              <AvatarImage
                src={image.url}
                alt={image.fileName}
                className="object-cover w-full h-full transition-transform group-hover:scale-110"
              />
              <AvatarFallback>FP</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="text-white w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Carousel Modal */}
      {isCarouselOpen && (
        <CarouselView
          images={farm.farmImages}
          initialSlide={currentSlide}
          onClose={() => setIsCarouselOpen(false)}
          farmId={farm._id.toString()}
        />
      )}
    </Card>
  );
};

export default RenderFarmImages;
