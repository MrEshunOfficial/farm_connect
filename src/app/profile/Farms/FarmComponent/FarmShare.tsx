import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  Share2Icon,
  DownloadIcon,
  Trash2,
  Edit,
  StoreIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { deleteFarmProfile } from "@/store/farm.slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { IFarmProfile } from "@/models/profileI-interfaces";

interface FarmShareProps {
  farm: IFarmProfile;
}

export default function FarmShare({ farm }: FarmShareProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useAppSelector((state) => state.farmProfiles);

  const handleShare = (farm: IFarmProfile) => {
    if (!farm) return;

    const getProduceByFarmType = (farm: IFarmProfile): string[] => {
      switch (farm.farmType) {
        case "Crop Farming":
          return farm.cropsGrown || [];
        case "Livestock Farming":
          return farm.livestockProduced || [];
        case "Mixed":
          return farm.mixedCropsGrown || [];
        case "Aquaculture":
          return farm.aquacultureType || [];
        case "Nursery":
          return farm.nurseryType || [];
        case "Poultry":
          return farm.poultryType || [];
        case "Others":
          return farm.othersType || [];
        default:
          return [];
      }
    };

    const produce = getProduceByFarmType(farm);
    const shareText = `
      🌾 Farm Name: ${farm.farmName}
      📍 Location: ${farm.farmLocation}
      🗺️ GPS Address: ${farm.gpsAddress}
      ⚖️ Farm Size: ${farm.farmSize} acres
      📞 Contact: ${farm.contactPhone}
      📨 Email: ${farm.contactEmail}
      🌱 Farm type: ${farm.farmType}
      🧺 Main Produce: ${produce.join(", ")}`;

    if (navigator.share) {
      navigator
        .share({
          title: `Farm Profile: ${farm.farmName}`,
          text: shareText,
        })
        .catch((error: Error) => {
          console.error("Share failed:", error);
          handleClipboardCopy(shareText);
        });
    } else {
      handleClipboardCopy(shareText);
    }
  };

  const handleClipboardCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Farm Profile Copied",
          description: "Farm profile details copied to clipboard.",
          variant: "default",
        });
      })
      .catch((error) => {
        console.error("Clipboard copy failed:", error);
        toast({
          title: "Copy Failed",
          description: "Unable to copy farm profile to clipboard.",
          variant: "destructive",
        });
      });
  };

  // Fixed download functionality
  const handleDownloadPDF = async () => {
    const element = document.getElementById(farm._id.toString());
    if (!element) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Could not find farm profile content.",
      });
      return;
    }

    try {
      // Set up PDF options
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Capture the element with better quality settings
      const canvas = await html2canvas(element, {
        scale: 2, // Increased quality
        useCORS: true, // Handle cross-origin images
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Calculate dimensions while maintaining aspect ratio
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add content to PDF
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Handle multi-page content if necessary
      let heightLeft = imgHeight;
      let position = 0;
      let page = 1;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        page++;
      }

      // Add metadata
      pdf.setProperties({
        title: `${farm.farmName} - Farm Profile`,
        subject: "Farm Profile Details",
        creator: "Farm Management System",
        author: farm.farmName,
        keywords: "farm profile, agriculture",
      });

      // Save the PDF
      pdf.save(
        `${farm.farmName.replace(/\s+/g, "-").toLowerCase()}-profile.pdf`
      );

      toast({
        title: "Download Successful",
        description: "Farm profile has been downloaded as PDF.",
        variant: "default",
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
      });
    }
  };

  const handleDeleteProfile = () => {
    if (farm?._id) {
      dispatch(deleteFarmProfile(farm._id.toString()))
        .then((result) => {
          if (deleteFarmProfile.fulfilled.match(result)) {
            toast({
              title: "Farm Profile Deleted",
              description: `${farm.farmName} has been successfully deleted.`,
              variant: "default",
            });
          } else if (deleteFarmProfile.rejected.match(result)) {
            console.error("Delete Action Rejected:", result.payload);
            toast({
              title: "Delete Failed",
              description:
                typeof result.payload === "string"
                  ? result.payload
                  : "An error occurred while deleting the farm profile.",
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          console.error("Unexpected Delete Error:", error);
          toast({
            title: "Delete Failed",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Delete Failed",
        description: "No profile selected or profile ID missing.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="secondary">
        <Link
          href={`/profile/product_post_form/farm.ad.post/${farm._id}`}
          className="flex items-center gap-2"
        >
          <StoreIcon size={16} />
          <span>Sell from this farm?</span>
        </Link>
      </Button>
      <Button variant="secondary" size="icon">
        <Link href={`/profile/Farms/edit/${farm._id}`}>
          <Edit size={16} />
        </Link>
      </Button>
      <Button variant="secondary" size="icon" onClick={() => handleShare(farm)}>
        <Share2Icon size={18} />
      </Button>
      <Button variant="secondary" size="icon" onClick={handleDownloadPDF}>
        <DownloadIcon size={18} />
      </Button>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            title="Delete Farm Profile"
            className="text-white w-full sm:w-auto"
          >
            <Trash2 size={16} />
            <span className="sm:hidden ml-2">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the farm profile for{" "}
              <strong>{farm.farmName}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProfile}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </div>
  );
}
