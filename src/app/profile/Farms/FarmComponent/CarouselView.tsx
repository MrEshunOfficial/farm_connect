import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  X,
  PauseIcon,
  PlayIcon,
  ExpandIcon,
  MinimizeIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCcwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import Autoplay from "embla-carousel-autoplay";
import { updateFarmProfile } from "@/store/farm.slice";
import { AppDispatch } from "@/store";
import useEmblaCarousel from "embla-carousel-react";
import Thumbnail from "./Thumbnail";

interface CarouselViewProps {
  images: Array<{ url: string; fileName: string }>;
  initialSlide: number;
  onClose: () => void;
  farmId: string;
}

const CarouselView: React.FC<CarouselViewProps> = ({
  images,
  initialSlide,
  onClose,
  farmId,
}) => {
  // State Management
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{
    image: { url: string; fileName: string };
    index: number;
  } | null>(null);

  // Initialize Embla Carousel with autoplay plugin
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      startIndex: initialSlide,
      loop: true,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  // Refs
  const imageRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(initialSlide);
      emblaApi.on("select", () => {
        setCurrentSlide(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi, initialSlide]);

  const navigateSlide = useCallback(
    (direction: "prev" | "next") => {
      if (emblaApi) {
        direction === "next" ? emblaApi.scrollNext() : emblaApi.scrollPrev();
      }
    },
    [emblaApi]
  );

  // Effect for handling keyboard events
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          navigateSlide("prev");
          break;
        case "ArrowRight":
          navigateSlide("next");
          break;
        case "+":
          handleZoom("in");
          break;
        case "-":
          handleZoom("out");
          break;
        case "r":
          handleRotate();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigateSlide, onClose]);

  // Functions for image manipulation
  const handleZoom = (direction: "in" | "out") => {
    setZoomLevel((prev) => {
      const newZoom = direction === "in" ? prev * 1.2 : prev / 1.2;
      return Math.min(Math.max(newZoom, 0.5), 3);
    });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Playback controls
  const toggleAutoplay = () => {
    if (emblaApi) {
      if (isPlaying) {
        emblaApi.plugins().autoplay?.stop();
      } else {
        emblaApi.plugins().autoplay?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullScreen = async () => {
    try {
      if (!isFullScreen) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      setIsFullScreen(!isFullScreen);
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // Delete handling
  const handleDeleteImage = async (
    image: { url: string; fileName: string },
    index: number
  ) => {
    try {
      await dispatch(
        updateFarmProfile({
          id: farmId,
          arrayUpdates: [
            {
              operation: "remove",
              field: "farmImages",
              index: index,
            },
          ],
        })
      ).unwrap();
      setShowDeleteAlert(false);
      setImageToDelete(null);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
    >
      <div className="relative w-full max-w-7xl mx-auto px-4">
        {/* Controls Bar */}
        <div className="absolute -top-16 left-0 right-0 flex justify-between items-center px-6 py-3 bg-black/60 backdrop-blur-sm rounded-t-lg">
          <div className="flex items-center gap-4">
            <Button
              onClick={toggleAutoplay}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              title={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
            </Button>
            <span className="text-white text-sm font-medium">
              {currentSlide + 1} / {images.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleZoom("out")}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              disabled={zoomLevel <= 0.5}
              title="Zoom out"
            >
              <ZoomOutIcon size={20} />
            </Button>
            <Button
              onClick={() => handleZoom("in")}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              disabled={zoomLevel >= 3}
              title="Zoom in"
            >
              <ZoomInIcon size={20} />
            </Button>
            <Button
              onClick={handleRotate}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              title="Rotate image"
            >
              <RotateCcwIcon size={20} />
            </Button>
            <Button
              onClick={toggleFullScreen}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullScreen ? (
                <MinimizeIcon size={20} />
              ) : (
                <ExpandIcon size={20} />
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              title="Close"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Main Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0"
                style={{ position: "relative" }}
              >
                <motion.div
                  ref={imageRef}
                  className="relative w-full aspect-video"
                  style={{
                    cursor: zoomLevel > 1 ? "grab" : "default",
                  }}
                  drag={zoomLevel > 1}
                  dragMomentum={false}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ cursor: "grabbing" }}
                  dragConstraints={imageRef}
                >
                  <motion.div
                    className="w-full h-full p-2"
                    style={{
                      scale: zoomLevel,
                      rotate: rotation,
                      x: position.x,
                      y: position.y,
                    }}
                  >
                    <Avatar className="w-full h-full rounded-md">
                      <AvatarImage
                        src={image.url}
                        alt={image.fileName}
                        className="object-contain w-full h-full"
                        draggable={false}
                      />
                      <AvatarFallback>FP</AvatarFallback>
                    </Avatar>
                  </motion.div>
                  {/* Image Caption */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white p-3 text-center text-sm font-medium">
                    {image.fileName}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="mt-6 px-12">
          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <Thumbnail
                key={index}
                image={image}
                index={index}
                isActive={currentSlide === index}
                onSelect={() => {
                  if (emblaApi) {
                    emblaApi.scrollTo(index);
                  }
                }}
                onDelete={(image, index) => {
                  setImageToDelete({ image, index });
                  setShowDeleteAlert(true);
                }}
              />
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {!isMobile && (
          <>
            <Button
              onClick={() => navigateSlide("prev")}
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            >
              <ChevronLeftIcon size={24} />
            </Button>
            <Button
              onClick={() => navigateSlide("next")}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            >
              <ChevronRightIcon size={24} />
            </Button>
          </>
        )}

        {/* Delete Confirmation Alert */}
        <AnimatePresence>
          {showDeleteAlert && imageToDelete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md"
            >
              <Alert className="bg-destructive text-destructive-foreground">
                <AlertDescription className="flex items-center justify-between">
                  <span>Are you sure you want to delete this image?</span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setShowDeleteAlert(false);
                        setImageToDelete(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleDeleteImage(
                          imageToDelete.image,
                          imageToDelete.index
                        )
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CarouselView;
