"use client";
import React, { useState } from "react";
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
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import StoreProfileFormComponent from "./storeForm/StoreProfileFormComponent";
import { StoreBranch } from "./storeForm/StoreBranch";
import { Button } from "@/components/ui/button";
import StoreGallery from "./storeForm/StoreGallery";
import { ImageGallery } from "./storeForm/ImageGallery";

export default function StorePage() {
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector(selectStoreProfile);
  const loading = useSelector(selectStoreLoading);
  const [selectedBranch, setSelectedBranch] = useState<BranchConstants | null>(
    null
  );

  const handleBranchDelete = async (branchId?: string) => {
    if (!branchId) return;

    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await dispatch(deleteBranch(branchId)).unwrap();
      } catch (error) {
        console.error("Failed to delete branch:", error);
      }
    }
  };

  const handleBranchSuccess = () => {
    dispatch(fetchStoreProfile());
    setSelectedBranch(null);
  };

  const handleDeleteStore = async () => {
    if (window.confirm("Are you sure you want to delete the store profile?")) {
      try {
        await dispatch(deleteStoreProfile()).unwrap();
      } catch (error) {
        console.error("Failed to delete store profile:", error);
      }
    }
  };

  React.useEffect(() => {
    dispatch(fetchStoreProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="w-full p-6 space-y-4">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!store)
    return (
      <main className="w-full h-full flex items-center justify-center p-2">
        <div className="w-1/3">
          <StoreProfileFormComponent />
        </div>
      </main>
    );

  return (
    <div className="w-full h-full max-w-7xl mx-auto space-y-3 bg-gray-50 dark:bg-gray-900">
      <header className="w-full flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {store.storeName}
          </h1>
          <div className="flex items-center gap-2 mt-2 lowercase">
            <Badge variant="secondary">{store.StoreOwnerShip}</Badge>/
            <Badge variant="secondary">{store.productionScale}</Badge>/
            {store.belongsToGroup && (
              <Badge variant="outline">{store.groupName}</Badge>
            )}
          </div>
        </div>
        <Button onClick={handleDeleteStore} size={"sm"} variant={"destructive"}>
          <Trash2Icon size={20} />
        </Button>
      </header>
      <section className="w-full h-full flex items-start gap-2 ">
        <div className="w-2/5 space-y-6">
          <Card className="bg-gray-100 dark:bg-teal-950">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span className="flex items-center justify-start gap-2">
                  Store Details
                </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Badge className="flex items-center justify-start gap-2 p-1 cursor-pointer">
                      <Edit size={16} />
                    </Badge>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <StoreProfileFormComponent />
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {store.productSold && store.productSold.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">We Deal In</h4>
                    <div className="flex flex-wrap gap-2">
                      {store.productSold.map((product, index) => (
                        <span key={index} className="p-2 rounded-md shadow-md">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start my-3">
                <p className="font-bold mt-3">About {store.storeName}</p>
                <span className="w-full max-h-10 rounded-md truncate text-start text-wrap text-sm overflow-scroll">
                  {store.description}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-100 dark:bg-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span className="flex items-center justify-start gap-2">
                  <Building2 className="h-5 w-5" />
                  Branches
                </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Badge
                      className="flex items-center justify-start gap-2 p-1 cursor-pointer"
                      onClick={() => setSelectedBranch(null)}
                    >
                      <Store size={16} />
                      Add Branch
                    </Badge>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <StoreBranch onSuccess={handleBranchSuccess} />
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center overflow-x-scroll overflow-y-hidden gap-4">
                {store.branches?.map(
                  (branch: BranchConstants, index: number) => (
                    <Card
                      key={index}
                      className="p-0 w-full h-full flex items-center justify-center dark:bg-teal-950"
                    >
                      <CardContent className="w-full h-full p-2">
                        <div className="w-full flex items-center justify-between border-b mb-2 p-0 capitalize flex-nowrap">
                          <span className="text-start w-1/2 truncate font-semibold text-sm">
                            {branch.branchName}
                          </span>
                          <div className="flex-1 flex items-center justify-end">
                            <Trash2Icon
                              size={16}
                              className="text-red-500"
                              onClick={() => handleBranchDelete(branch._id)}
                            />
                            <Dialog>
                              <DialogTrigger asChild>
                                <Badge
                                  variant={"secondary"}
                                  className="flex items-center justify-center cursor-pointer"
                                  onClick={() => setSelectedBranch(branch)}
                                >
                                  <Edit size={14} />
                                </Badge>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <StoreBranch
                                  branchId={branch._id}
                                  initialData={branch}
                                  onSuccess={handleBranchSuccess}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span>{branch.branchLocation}</span>
                          </div>
                          {branch.gpsAddress && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span>{branch.gpsAddress}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span>{branch.branchPhone}</span>
                          </div>
                          {branch.branchEmail && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span>{branch.branchEmail}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1 space-y-3">
          {store.storeImages && store.storeImages.length > 0 ? (
            <ImageGallery images={store.storeImages} />
          ) : (
            <StoreGallery />
          )}
        </div>
      </section>
    </div>
  );
}
