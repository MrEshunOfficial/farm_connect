import RenderSearchPosts from "../post.components/RenderSearchPosts";

interface SearchPageProps {
  searchParams: Promise<{
    search?: string;
    regions?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const search = params.search || "";

  // Parse regions if it's a stringified array
  let regions: any[] = [];
  if (params.regions) {
    try {
      regions = JSON.parse(params.regions);
    } catch (error) {
      // If parsing fails, treat as single region or comma-separated
      regions = params.regions.split(",").filter(Boolean);
    }
  }

  return (
    <div className="w-full">
      <RenderSearchPosts search={search} regions={regions} />
    </div>
  );
}
