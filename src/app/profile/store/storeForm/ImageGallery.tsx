"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { deleteImage, updateImage } from "@/store/store.slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2Icon,
  Check,
  X,
  ExternalLinkIcon,
  Store,
  LayoutGrid,
  List,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ImageGalleryProps {
  images: StoreImage[];
}

type ViewMode = "grid" | "list";
const VIEW_MODE_STORAGE_KEY = "gallery-view-mode";

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(0);
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    imageId?: string;
    initialData?: StoreImage;
  }>({ isOpen: false });

  const getInitialViewMode = (): ViewMode => {
    if (typeof window === "undefined") {
      return "list"; // Default for SSR
    }

    try {
      const savedViewMode = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
      if (savedViewMode === "grid" || savedViewMode === "list") {
        return savedViewMode as ViewMode;
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }

    return "list"; // Fallback default
  };

  const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [viewMode]);

  const imagesPerPage = viewMode === "grid" ? 6 : 8;
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const currentImages = images.slice(
    currentPage * imagesPerPage,
    (currentPage + 1) * imagesPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [viewMode]);

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

  const renderGridView = () => (
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
  );

  const renderListView = () => (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentImages.map((image) => (
            <TableRow key={image._id}>
              <TableCell>
                <Avatar className="w-12 h-12 rounded-md">
                  <AvatarImage
                    src={image.url}
                    alt={image.itemName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg">
                    {image.itemName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{image.itemName}</TableCell>
              <TableCell>${image.itemPrice}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    image.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {image.available ? "Available" : "Sold"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(image)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Item</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAvailabilityToggle(image)}
                        >
                          {image.available ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {image.available
                            ? "Mark as Sold"
                            : "Mark as Available"}
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/profile/product_post_form/store.ad.post/${image._id}`}
                        >
                          <Button variant="outline" size="sm">
                            <Store className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Post as Ad</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(image._id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Item</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card className="w-full h-full">
      <CardHeader className="w-full flex flex-row items-center justify-between">
        <CardTitle className="w-full flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 flex items-center  gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Grid View</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>List View</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </CardTitle>
        {totalPages > 1 && (
          <div className="flex items-center gap-2 ml-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous Page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="text-sm">
              {currentPage + 1} / {totalPages}
            </span>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={currentPage === totalPages - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next Page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {viewMode === "grid" ? renderGridView() : renderListView()}
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
