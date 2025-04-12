"use client";

import { useParams } from "next/navigation";
import { PostsPage } from "../../post.components/PostPage";

export default function SubcategoryPage() {
  const params = useParams();

  if (!params.categoryId || !params.subcategoryId) {
    return <div>Category ID and Subcategory ID are required</div>;
  }

  return (
    <PostsPage
      categoryId={params.categoryId as string}
      subcategoryId={params.subcategoryId as string}
    />
  );
}
