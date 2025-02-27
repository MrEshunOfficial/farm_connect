"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PostParentComponent from "../../../post.form.components/PostParentComponent";
import { selectCurrentFarmPost } from "@/store/post.slice";
import { Loader2 } from "lucide-react";

export default function FarmProductUpdateParams({
  params,
}: {
  params: { id: string };
}) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const currentPost = useAppSelector(selectCurrentFarmPost);

  useEffect(() => {
    const fetchFarmPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/postapi/me/farm-post/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        if (data.success) {
          dispatch({ type: "posts/setCurrentFarmPost", payload: data.data });
        }
      } catch (err) {
        console.error("Error fetching farm post:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchFarmPosts();
    }

    return () => {
      dispatch({ type: "posts/setCurrentFarmPost", payload: null });
    };
  }, [dispatch, params.id]);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <Loader2 className="w-8 h-8 animate-spin text-primary" />
  //     </div>
  //   );
  // }

  // In FarmProductUpdateParams
  return (
    <PostParentComponent
      initialData={currentPost || undefined}
      farmId={params.id}
      formId={params.id}
      mode="farm"
    />
  );
}
