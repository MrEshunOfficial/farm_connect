"use client";

import RenderSearchPosts from "../post.components/RenderSearchPosts";

interface SearchPageProps {
  initialSearchTerm: string;
  regionsData: any[];
}

export default function SearchPage({
  initialSearchTerm,
  regionsData,
}: SearchPageProps) {
  return (
    <div className="w-full">
      <RenderSearchPosts search={initialSearchTerm} regions={regionsData} />
    </div>
  );
}
