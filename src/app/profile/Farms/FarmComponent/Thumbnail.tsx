import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";

interface ThumbnailProps {
  image: { url: string; fileName: string };
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (image: { url: string; fileName: string }, index: number) => void;
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  image,
  index,
  isActive,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      className={`
        group relative flex-shrink-0 w-16 h-16 
        rounded-lg overflow-hidden transition-all 
        hover:ring-2 hover:ring-white hover:ring-opacity-50 m-2
        ${
          isActive
            ? "ring-2 ring-white ring-offset-2 ring-offset-black"
            : "opacity-50 hover:opacity-100"
        }
      `}
    >
      <button onClick={onSelect} className="w-full h-full">
        <Avatar className="w-full h-full">
          <AvatarImage
            src={image.url}
            alt={image.fileName}
            className="object-cover"
          />
          <AvatarFallback>FP</AvatarFallback>
        </Avatar>
      </button>

      <Button
        variant="destructive"
        size="icon"
        className="
          absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2
          w-6 h-6 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-200
          bg-red-600 hover:bg-red-700
          shadow-lg
          z-10
        "
        onClick={(e) => {
          e.stopPropagation();
          onDelete(image, index);
        }}
      >
        <Trash2 size={14} className="text-white" />
      </Button>
    </div>
  );
};

export default Thumbnail;
