"use client";

import { useParams } from "next/navigation";
import { PostsPage } from "../post.components/PostPage";

export default function CategoryPage() {
  const params = useParams();

  if (!params.categoryId) {
    return <div>Category ID is required</div>;
  }

  return <PostsPage categoryId={params.categoryId as string} />;
}
