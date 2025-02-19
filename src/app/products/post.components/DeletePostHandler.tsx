import { useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteFarmPost, deleteStorePost } from "@/store/post.slice";
import { AppDispatch } from "@/store";

interface DeletePostButtonProps {
  postId: string;
  postType: "farm" | "store";
  onSuccess?: () => void;
}

export const DeletePostButton = ({
  postId,
  postType,
  onSuccess,
}: DeletePostButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const deleteAction =
        postType === "farm" ? deleteFarmPost(postId) : deleteStorePost(postId);

      const resultAction = dispatch(deleteAction);

      if (
        deleteFarmPost.fulfilled.match(resultAction) ||
        deleteStorePost.fulfilled.match(resultAction)
      ) {
        toast({
          title: "Success",
          description: "Post deleted successfully",
          variant: "default",
        });
        onSuccess?.();
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex-1" disabled={isDeleting}>
          <Trash2 size={18} className="mr-2" />
          {isDeleting ? "Deleting..." : "Delete Ad"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your post
            and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
