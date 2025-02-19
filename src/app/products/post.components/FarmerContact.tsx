import React, {  } from "react";
import {
  Check,
  Copy,
} from "lucide-react";
import { FaWhatsapp, FaFacebookF, FaTwitter } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface StoreLocation {
  region: string;
  district: string;
}

interface StoreProfile {
  storeName: string;
  description: string;
}

interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
}



type CopyableContactType = "phone" | "email";
type SharePlatform = "facebook" | "twitter" | "whatsapp" | "copy";

// Extracted components
interface ContactInfoItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  copyType?: CopyableContactType;
  onCopy?: (type: CopyableContactType) => void;
  copied: CopyableContactType | null;
}

const ContactInfoItem: React.FC<ContactInfoItemProps> = ({
  icon,
  title,
  value,
  copyType,
  onCopy,
  copied,
}) => (
  <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-lg transition-colors hover:bg-secondary/50 group">
    {icon}
    <div className="flex-1">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
    {copyType && onCopy && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onCopy(copyType)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Copy ${title}`}
      >
        {copied === copyType ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </Button>
    )}
  </div>
);

interface ShareMenuProps {
  isVisible: boolean;
  onShare: (platform: SharePlatform) => void;
  onClose: () => void;
}

const ShareMenu: React.FC<ShareMenuProps> = ({
  isVisible,
  onShare,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-4 right-20 z-50 backdrop-blur-xl bg-opacity-50 p-4 rounded-lg shadow-lg space-y-2"
      role="menu"
      aria-label="Share options"
    >
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onShare("facebook");
          onClose();
        }}
      >
        <FaFacebookF className="h-4 w-4 mr-2" /> Share on Facebook
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onShare("twitter");
          onClose();
        }}
      >
        <FaTwitter className="h-4 w-4 mr-2" /> Share on Twitter
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onShare("whatsapp");
          onClose();
        }}
      >
        <FaWhatsapp className="h-4 w-4 mr-2" /> Share on WhatsApp
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onShare("copy");
          onClose();
        }}
      >
        <Copy className="h-4 w-4 mr-2" /> Copy Link
      </Button>
    </div>
  );
};