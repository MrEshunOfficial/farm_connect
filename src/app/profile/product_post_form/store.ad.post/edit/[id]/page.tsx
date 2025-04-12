"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PostParentComponent from "../../../post.form.components/PostParentComponent";
import {
  fetchStorePostsParam,
  selectCurrentStorePost,
} from "@/store/post.slice";
import { Loader2 } from "lucide-react";

export default function StoreProductUpdateParams({
  params,
}: {
  params: { id: string };
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const currentPost = useAppSelector(selectCurrentStorePost);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchStorePostsParam({ id: params.id }))
        .unwrap()
        .then(() => setIsLoading(false))
        .catch((error) => {
          console.error("Failed to fetch post:", error);
          setIsLoading(false);
        });
    }
  }, [dispatch, params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PostParentComponent
      initialData={currentPost || undefined}
      storeId={params.id}
      mode="store"
    />
  );
}
