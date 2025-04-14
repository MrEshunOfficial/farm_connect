"use client";

import RenderSearchPosts from "../post.components/RenderSearchPosts";

interface SearchPageProps {
  search: string;
  regions: any[];
}

export default function SearchPage({ search, regions }: SearchPageProps) {
  return (
    <div className="w-full">
      <RenderSearchPosts search={search} regions={regions} />
    </div>
  );
}
