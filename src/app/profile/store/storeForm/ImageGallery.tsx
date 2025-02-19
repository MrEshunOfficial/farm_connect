"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  deleteImage,
  updateImage,
  updateImageAvailability,
} from "@/store/store.slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2Icon,
  Check,
  X,
  Signal,
  ExternalLinkIcon,
  PodcastIcon,
  SignalIcon,
  Store,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import StoreGallery from "./StoreGallery";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { StoreImage } from "@/models/profileI-interfaces";

interface ImageGalleryProps {
  images: StoreImage[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(0);
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    imageId?: string;
    initialData?: StoreImage;
  }>({ isOpen: false });

  const imagesPerPage = 6;
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const currentImages = images.slice(
    currentPage * imagesPerPage,
    (currentPage + 1) * imagesPerPage
  );

  const handleEdit = (image: StoreImage) => {
    setEditDialog({
      isOpen: true,
      imageId: image._id,
      initialData: image,
    });
  };

  const handleDelete = async (imageId?: string) => {
    if (!imageId) return;

    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await dispatch(deleteImage(imageId)).unwrap();
        if (currentImages.length === 1 && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }
  };

  const handleEditSuccess = () => {
    setEditDialog({ isOpen: false });
  };

  const handleAvailabilityToggle = async (image: StoreImage) => {
    if (!image._id) return;
    try {
      await dispatch(
        updateImage({
          imageId: image._id,
          data: { ...image, available: !image.available },
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update availability:", error);
    }
  };

  return (
    <Card className="w-full h-full bg-gray-100 dark:bg-teal-950">
      <CardHeader className="w-full flex flex-row items-center justify-between">
        <CardTitle className="w-full flex items-center justify-between">
          <span className="flex items-center justify-start gap-2">
            <ImageIcon className="h-5 w-5" />
            Gallery
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size={"icon"}
                className="flex items-center justify-center p-2 rounded-md bg-blue-500 text-white"
              >
                <Plus size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <StoreGallery />
            </DialogContent>
          </Dialog>
        </CardTitle>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="w-full h-full grid grid-cols-2 lg:grid-cols-3 gap-4">
          {currentImages.map((image) => (
            <div key={image._id} className="relative group aspect-square">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer w-full h-full">
                    <Avatar className="w-full h-full rounded-md">
                      <AvatarImage
                        src={image.url}
                        alt={image.itemName}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-lg">
                        {image.itemName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="center">
                  <DropdownMenuItem disabled className="font-semibold">
                    {image.itemName}
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    Price: ${image.itemPrice}
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Status: {image.available ? "Available" : "Sold"}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => handleAvailabilityToggle(image)}
                        className={image.available ? "bg-gray-100" : ""}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Available
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAvailabilityToggle(image)}
                        className={!image.available ? "bg-gray-100" : ""}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Sold
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={() => handleEdit(image)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Item
                  </DropdownMenuItem>
                  <DropdownMenuItem className="w-full flex items-center justify-between">
                    <span className="flex items-center justify-start gap-2">
                      <Store className="h-4 w-4" /> Post as Ad
                    </span>
                    <Link
                      href={`/profile/product_post_form/store.ad.post/${image._id}`}
                    >
                      <ExternalLinkIcon className="w-3 h-3" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(image._id)}
                    className="text-red-600"
                  >
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Delete Item
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                <p className="text-sm font-medium truncate">{image.itemName}</p>
                <p className="text-xs w-full flex items-center justify-between">
                  <span>${image.itemPrice}</span>
                  <span>{image.available ? "available" : "sold"}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <Dialog
        open={editDialog.isOpen}
        onOpenChange={(open) =>
          setEditDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent className="sm:max-w-[425px]">
          <StoreGallery
            imageId={editDialog.imageId}
            initialData={editDialog.initialData}
            onSuccess={handleEditSuccess}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
