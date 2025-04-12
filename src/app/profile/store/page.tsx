"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  fetchStoreProfile,
  selectStoreLoading,
  selectStoreProfile,
  deleteBranch,
  deleteStoreProfile,
} from "@/store/store.slice";
import { StoreBranch as BranchConstants } from "@/models/profileI-interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Store,
  Edit,
  Trash2Icon,
  Clock,
  Info,
  Image as ImageIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import StoreProfileFormComponent from "./storeForm/StoreProfileFormComponent";
import { StoreBranch } from "./storeForm/StoreBranch";
import { Button } from "@/components/ui/button";
import StoreGallery from "./storeForm/StoreGallery";
import { ImageGallery } from "./storeForm/ImageGallery";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StorePage() {
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector(selectStoreProfile);
  const loading = useSelector(selectStoreLoading);
  const [selectedBranch, setSelectedBranch] = useState<BranchConstants | null>(
    null
  );
  const [isDeleteStoreDialogOpen, setIsDeleteStoreDialogOpen] = useState(false);
  const [isDeleteBranchDialogOpen, setIsDeleteBranchDialogOpen] =
    useState(false);
  const [branchToDelete, setBranchToDelete] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    dispatch(fetchStoreProfile());
  }, [dispatch]);

  const handleBranchDelete = async (branchId?: string) => {
    if (!branchId) return;
    setBranchToDelete(branchId);
    setIsDeleteBranchDialogOpen(true);
  };

  const confirmBranchDelete = async () => {
    if (!branchToDelete) return;

    try {
      await dispatch(deleteBranch(branchToDelete)).unwrap();
      setBranchToDelete(undefined);
      setIsDeleteBranchDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete branch:", error);
    }
  };

  const handleBranchSuccess = () => {
    dispatch(fetchStoreProfile());
    setSelectedBranch(null);
  };

  const handleDeleteStore = async () => {
    setIsDeleteStoreDialogOpen(true);
  };

  const confirmDeleteStore = async () => {
    try {
      await dispatch(deleteStoreProfile()).unwrap();
      setIsDeleteStoreDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete store profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-16 w-64 rounded-lg" />
        <div className="flex gap-8">
          <div className="w-1/3 space-y-4">
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
          <Skeleton className="h-96 w-2/3 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!store)
    return (
      <main className="w-full h-full flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-lg shadow-lg border-0">
          <CardHeader className="bg-primary/5 pb-2">
            <CardTitle className="text-xl font-semibold">
              Create Your Store Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <StoreProfileFormComponent />
          </CardContent>
        </Card>
      </main>
    );

  const storeInitial = store.storeName
    ? store.storeName.charAt(0).toUpperCase()
    : "S";

  const storeImage =
    store.storeImages && store.storeImages.length > 0
      ? store.storeImages[0]
      : undefined;

  return (
    <div className="w-full h-[75vh] overflow-auto max-w-7xl mx-auto p-4 md:p-6 space-y-3">
      {/* Header Section */}
      <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-r from-primary/10 to-background">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <Avatar className="h-20 w-20 rounded-md border-2 border-primary/20 shadow-sm">
              <AvatarImage src={storeImage?.url} alt={store.storeName} />
              <AvatarFallback className="text-2xl font-bold bg-primary/20">
                {storeInitial}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {store.storeName}
                </h1>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit size={16} /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogTitle>Edit Store Profile</DialogTitle>
                      <StoreProfileFormComponent />
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={handleDeleteStore}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2Icon size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary" className="capitalize">
                  {store.StoreOwnerShip}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {store.productionScale}
                </Badge>
                {store.belongsToGroup && (
                  <Badge variant="outline" className="flex gap-1">
                    <Building2 size={14} /> {store.groupName}
                  </Badge>
                )}
              </div>

              {store.description && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {store.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-3">
          {/* Store Details Card */}
          <Card className="shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
            <CardHeader className="bg-primary/5 pb-2">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Info size={18} />
                  Store Details
                </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Edit Store Details</DialogTitle>
                    <StoreProfileFormComponent />
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4">
              {store.description && (
                <div className="mb-4">
                  <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">
                    About
                  </h3>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">
                    {store.description}
                  </p>
                </div>
              )}

              {store.productSold && store.productSold.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">
                    Products & Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {store.productSold.map((product, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-primary/5"
                      >
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="shadow-md border border-gray-100 dark:border-gray-800">
            <CardHeader className="bg-primary/5 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock size={18} />
                Quick Actions
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 grid gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <Store size={16} className="mr-2" />
                    Add New Branch
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Add Branch</DialogTitle>
                  <StoreBranch onSuccess={handleBranchSuccess} />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <ImageIcon size={16} className="mr-2" />
                    Update Stock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Store Gallery</DialogTitle>
                  <StoreGallery />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-3">
          {/* Branches Tab Card */}
          <Card className="shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
            <CardHeader className="bg-primary/5 pb-2">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Building2 size={18} />
                  Store Branches
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4">
              {!store.branches || store.branches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Building2 className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <h3 className="text-lg font-medium">No branches yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
                    Add your first branch to get started
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Store size={16} className="mr-2" />
                        Add Branch
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Add Branch</DialogTitle>
                      <StoreBranch onSuccess={handleBranchSuccess} />
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {store.branches.map((branch, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
                    >
                      <CardHeader className="bg-muted/30 p-3 flex flex-row items-center justify-between">
                        <h3 className="font-medium truncate">
                          {branch.branchName}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setSelectedBranch(branch)}
                              >
                                <Edit size={14} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogTitle>Edit Branch</DialogTitle>
                              <StoreBranch
                                branchId={branch._id}
                                initialData={branch}
                                onSuccess={handleBranchSuccess}
                              />
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            onClick={() => handleBranchDelete(branch._id)}
                          >
                            <Trash2Icon size={14} />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            {branch.branchLocation}
                          </span>
                        </div>

                        {branch.gpsAddress && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {branch.gpsAddress}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span className="text-sm">{branch.branchPhone}</span>
                        </div>

                        {branch.branchEmail && (
                          <div className="flex items-start gap-2">
                            <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm break-all">
                              {branch.branchEmail}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Store Gallery */}
          <Card className="shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
            <CardHeader className="bg-primary/5 pb-2">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <ImageIcon size={18} />
                  Store Gallery
                </span>
                {(!store.storeImages || store.storeImages.length === 0) && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ImageIcon size={14} /> Upload
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Upload Images</DialogTitle>
                      <StoreGallery />
                    </DialogContent>
                  </Dialog>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4">
              {store.storeImages && store.storeImages.length > 0 ? (
                <ImageGallery images={store.storeImages} />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <h3 className="text-lg font-medium">No gallery images</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
                    Upload images to showcase your store
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <ImageIcon size={16} className="mr-2" />
                        Upload Images
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Upload Images</DialogTitle>
                      <StoreGallery />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Store Confirmation Dialog */}
      <AlertDialog
        open={isDeleteStoreDialogOpen}
        onOpenChange={setIsDeleteStoreDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Store Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your store profile? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteStore}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Branch Confirmation Dialog */}
      <AlertDialog
        open={isDeleteBranchDialogOpen}
        onOpenChange={setIsDeleteBranchDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Branch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this branch? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBranchDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
