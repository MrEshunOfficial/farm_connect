// app/location/[region]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { LocationBasedPosts } from "../../post.components/LocationBasedPosts";

export default function RegionPage() {
  const params = useParams();

  if (!params.region) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Region parameter is required
          </p>
        </div>
      </div>
    );
  }

  return <LocationBasedPosts region={params.region as string} />;
}
