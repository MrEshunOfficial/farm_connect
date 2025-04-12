"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPostsLoading,
  selectPostsError,
  selectCurrentFarmPost,
} from "@/store/post.slice";
import { Loader2 } from "lucide-react";

import { useSession } from "next-auth/react";
import FarmPostProfile from "../../post.components/FarmPostProfile";

// Enhanced ProductDetails Component
export default function ProductDetails() {
  const params = useParams();
  const paramsId = params.farmId as string;
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const currentPost = useSelector(selectCurrentFarmPost);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  const [mainImage, setMainImage] = useState<string>("");
  const [allImages, setAllImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isContactShown, setIsContactShown] = useState(false);

  useEffect(() => {
    const fetchFarmPosts = async () => {
      try {
        const response = await fetch(`/api/postapi/me/farm-post/${paramsId}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        if (data.success) {
          dispatch({ type: "posts/setCurrentFarmPost", payload: data.data });
        }
      } catch (err) {
        console.error("Error fetching store post:", err);
      }
    };

    if (paramsId) {
      fetchFarmPosts();
    }

    return () => {
      dispatch({ type: "posts/setCurrentFarmPost", payload: null });
    };
  }, [paramsId, dispatch]);

  useEffect(() => {
    if (currentPost) {
      const mainImg = currentPost.productImages[0].url;
      const subImages = currentPost.productImages?.map((img) => img.url) || [];
      const allImgs = [mainImg, ...subImages];

      setMainImage(mainImg);
      setAllImages(allImgs);
    }
  }, [currentPost]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-red-500 rounded-lg">Error: {error}</div>
    );
  }

  if (!currentPost) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const handleImageClick = (index: number) => {
    setMainImage(allImages[index]);
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    const newIndex =
      (currentImageIndex - 1 + allImages.length) % allImages.length;
    setMainImage(allImages[newIndex]);
    setCurrentImageIndex(newIndex);
  };

  const handleNextImage = () => {
    const newIndex = (currentImageIndex + 1) % allImages.length;
    setMainImage(allImages[newIndex]);
    setCurrentImageIndex(newIndex);
  };

  return (
    <div className="container mx-auto p-2 max-w-7xl">
      <FarmPostProfile
        currentPost={currentPost}
        mainImage={mainImage}
        allImages={allImages}
        currentImageIndex={currentImageIndex}
        isContactShown={isContactShown}
        userId={session?.user?.id}
        onImageClick={handleImageClick}
        onPrevImage={handlePrevImage}
        onNextImage={handleNextImage}
        onToggleContact={() => setIsContactShown(!isContactShown)}
      />
    </div>
  );
}
