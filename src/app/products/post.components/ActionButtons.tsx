import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Copy } from "lucide-react";
import { FaWhatsapp, FaFacebookF, FaTwitter } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";

interface ShareInfo {
  itemName: string;
  sourceName: string;
}

interface ActionButtonsProps {
  shareInfo: ShareInfo;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ shareInfo }) => {
  const handleShare = (
    platform: "facebook" | "twitter" | "whatsapp" | "copy"
  ) => {
    const url = window.location.href;
    const text = `Check out ${shareInfo.itemName} at ${shareInfo.sourceName}`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copied!",
          description: "The product link has been copied to your clipboard",
        });
      });
      return;
    }

    window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
      <TooltipProvider>
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleShare("facebook")}
              >
                <FaFacebookF size={16} className="text-blue-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share on Facebook</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleShare("twitter")}
              >
                <FaTwitter size={16} className="text-blue-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share on Twitter</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleShare("whatsapp")}
              >
                <FaWhatsapp size={16} className="text-green-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share on WhatsApp</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleShare("copy")}
              >
                <Copy size={16} className="text-gray-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Link</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default ActionButtons;
