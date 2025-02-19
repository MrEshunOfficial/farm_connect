import React from "react";
import Link from "next/link";
import { Edit2Icon, Settings, Trash2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Logout from "@/app/authclient/Logout";
import { IUserProfile } from "@/models/profileI-interfaces";

interface FooterActionsProps {
  activeProfile: IUserProfile;
}

const FooterActions: React.FC<FooterActionsProps> = ({ activeProfile }) => {
  const actionButtons = [
    {
      icon: !activeProfile ? (
        <Link href="/profile/profile_form">
          <UserCircle className="w-4 h-4" />
        </Link>
      ) : (
        <Link href={`/profile/${activeProfile._id}`}>
          <Edit2Icon className="w-4 h-4" />
        </Link>
      ),
      tooltip: !activeProfile ? "Create Profile" : "Update Profile",
      className: "hover:bg-blue-50 hover:text-blue-600",
    },
    {
      icon: <Settings className="w-4 h-4" />,
      tooltip: "Settings",
      className: "hover:bg-blue-50 hover:text-blue-600",
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      tooltip: "Delete Account",
      className: "hover:bg-red-50 hover:text-red-600",
    },
  ];

  return (
    <div className="space-y-3 pt-4 border-t dark:border-gray-700">
      <div className="flex gap-3 items-center justify-center flex-wrap">
        {actionButtons.map((button, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`
                    transition-all duration-200 
                    bg-white dark:bg-gray-950 
                    hover:border-blue-200 dark:hover:border-gray-700
                    dark:hover:bg-gray-800 dark:hover:text-blue-400 
                    dark:border-gray-800
                    shadow-sm hover:shadow-md
                    ${button.className}
                  `}
                >
                  {button.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg border dark:border-gray-700">
                <p>{button.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="
            transition-all duration-200 
            bg-white dark:bg-gray-950 
            hover:bg-blue-50 hover:text-blue-600 
            hover:border-blue-200 dark:hover:border-gray-700
            dark:hover:bg-gray-800 dark:hover:text-blue-400 
            dark:border-gray-800
            shadow-sm hover:shadow-md
          "
        >
          <Logout />
        </Button>
      </div>
    </div>
  );
};

export default FooterActions;
