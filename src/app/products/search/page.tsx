"use client";

import { RenderSearchPosts } from "../post.components/RenderSearchPosts";

interface RenderSearchPostsProps {
  initialSearchTerm: string;
  regionsData: any[];
}

export default function SearPage({
  initialSearchTerm,
  regionsData,
}: RenderSearchPostsProps) {
  return (
    <div className="w-full">
      <RenderSearchPosts search={initialSearchTerm} regions={regionsData} />
    </div>
  );
}
