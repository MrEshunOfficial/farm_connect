import React, { useState } from "react";
import Link from "next/link";
import { Edit2Icon, Settings, Trash2, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/components/ui/use-toast";
import { IUserProfile } from "@/models/profileI-interfaces";
import { deleteUserAccount } from "@/store/profile.slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";

interface FooterActionsProps {
  activeProfile: IUserProfile;
}

const FooterActions: React.FC<FooterActionsProps> = ({ activeProfile }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const resultAction = await dispatch(deleteUserAccount());

      if (deleteUserAccount.fulfilled.match(resultAction)) {
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
          variant: "default",
        });
        router.push("/authclient/Login");
      } else {
        toast({
          title: "Error",
          description:
            (resultAction.payload as string) ||
            "Failed to delete account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleLogout = () => {
    // Assuming Logout component has a function to handle logout
    // This would need to be implemented based on how your Logout component works
    router.push("/authclient/Login");
  };

  return (
    <div className="pt-6 border-t dark:border-gray-700">
      <div className="flex justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-1">
          {/* Main button with dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
              <DropdownMenuLabel className="text-gray-600 dark:text-gray-300">
                Account Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 focus:bg-blue-50 dark:focus:bg-gray-700 rounded-md transition-colors"
                onClick={() =>
                  !activeProfile
                    ? router.push("/profile/profile_form")
                    : router.push(`/profile/${activeProfile._id}`)
                }
              >
                {!activeProfile ? (
                  <>
                    <UserCircle className="w-4 h-4 text-blue-500" />
                    Create Profile
                  </>
                ) : (
                  <>
                    <Edit2Icon className="w-4 h-4 text-blue-500" />
                    Update Profile
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 focus:bg-blue-50 dark:focus:bg-gray-700 rounded-md transition-colors"
                onClick={() => router.push("/settings")}
              >
                <Settings className="w-4 h-4 text-blue-500" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 focus:bg-blue-50 dark:focus:bg-gray-700 rounded-md transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 text-blue-500" />
                Logout
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 rounded-md transition-colors"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 border-none"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FooterActions;
