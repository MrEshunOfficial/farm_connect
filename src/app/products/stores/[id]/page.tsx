"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentStorePost,
  selectPostsLoading,
  selectPostsError,
} from "@/store/post.slice";
import { Loader2 } from "lucide-react";

import { useSession } from "next-auth/react";
import { StorePostProfile } from "../../post.components/StorePostProfile";

// Enhanced ProductDetails Component
export default function ProductDetails() {
  const params = useParams();
  const paramsId = params.id as string;
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const currentPost = useSelector(selectCurrentStorePost);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  const [mainImage, setMainImage] = useState<string>("");
  const [allImages, setAllImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isContactShown, setIsContactShown] = useState(false);

  useEffect(() => {
    const fetchStorePost = async () => {
      try {
        const response = await fetch(`/api/postapi/me/store-post/${paramsId}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        if (data.success) {
          dispatch({ type: "posts/setCurrentStorePost", payload: data.data });
        }
      } catch (err) {
        console.error("Error fetching store post:", err);
      }
    };

    if (paramsId) {
      fetchStorePost();
    }

    return () => {
      dispatch({ type: "posts/setCurrentStorePost", payload: null });
    };
  }, [paramsId, dispatch]);

  useEffect(() => {
    if (currentPost) {
      const mainImg = currentPost.storeImage.url;
      const subImages =
        currentPost.ProductSubImages?.map((img) => img.url) || [];
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
      <div className="w-full h-full flex items-center justify-center p-4 text-red-500 border-red-500 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 text-gray-500 rounded-lg">
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
    <StorePostProfile
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
  );
}
