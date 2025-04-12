"use client";
import { UserRole } from "@/models/profileI-interfaces";
import React, { useState } from "react";

// Mock data for buyers based on the provided interfaces
interface Buyer {
  _id: string;
  userId: string;
  fullName: string;
  username: string;
  profilePicture?: {
    url: string;
  };
  bio?: string;
  role: string;
  rating: number;
  country: string;
  region: string;
  purchaseHistory: {
    totalPurchases: number;
    categories: string[];
    averageOrderValue: number;
    currency: string;
  };
  verified: boolean;
  lastActive: string;
}

const mockBuyers: Buyer[] = [
  {
    _id: "b1",
    userId: "user1",
    fullName: "Emma Johnson",
    username: "emmaj",
    profilePicture: {
      url: "/api/placeholder/100/100",
    },
    bio: "Looking for fresh organic produce for my restaurant chain",
    role: UserRole.Buyer,
    rating: 4.8,
    country: "Ghana",
    region: "Greater Accra",
    purchaseHistory: {
      totalPurchases: 78,
      categories: ["Vegetables", "Fruits", "Grains"],
      averageOrderValue: 1200,
      currency: "GHS",
    },
    verified: true,
    lastActive: "Today",
  },
  {
    _id: "b2",
    userId: "user2",
    fullName: "Michael Osei",
    username: "mikosei",
    profilePicture: {
      url: "/api/placeholder/100/100",
    },
    bio: "Wholesale buyer for local supermarket chain",
    role: UserRole.Buyer,
    rating: 4.9,
    country: "Ghana",
    region: "Ashanti",
    purchaseHistory: {
      totalPurchases: 124,
      categories: ["Poultry", "Dairy", "Vegetables"],
      averageOrderValue: 3500,
      currency: "GHS",
    },
    verified: true,
    lastActive: "Yesterday",
  },
  {
    _id: "b3",
    userId: "user3",
    fullName: "Sarah Addo",
    username: "sarahaddo",
    profilePicture: {
      url: "/api/placeholder/100/100",
    },
    bio: "Food processor looking for quality raw materials",
    role: UserRole.Buyer,
    rating: 4.7,
    country: "Ghana",
    region: "Central",
    purchaseHistory: {
      totalPurchases: 52,
      categories: ["Cassava", "Maize", "Yam"],
      averageOrderValue: 2800,
      currency: "GHS",
    },
    verified: true,
    lastActive: "2 days ago",
  },
  {
    _id: "b4",
    userId: "user4",
    fullName: "Daniel Kwame",
    username: "dkwame",
    bio: "Exporter of agricultural products",
    role: UserRole.Buyer,
    rating: 4.6,
    country: "Ghana",
    region: "Western",
    purchaseHistory: {
      totalPurchases: 93,
      categories: ["Cocoa", "Cashew", "Shea"],
      averageOrderValue: 5200,
      currency: "GHS",
    },
    verified: true,
    lastActive: "Today",
  },
  {
    _id: "b5",
    userId: "user5",
    fullName: "Amina Bello",
    username: "aminab",
    profilePicture: {
      url: "/api/placeholder/100/100",
    },
    bio: "Hotel purchasing manager seeking reliable suppliers",
    role: UserRole.Buyer,
    rating: 4.5,
    country: "Ghana",
    region: "Greater Accra",
    purchaseHistory: {
      totalPurchases: 47,
      categories: ["Vegetables", "Fruits", "Poultry"],
      averageOrderValue: 1800,
      currency: "GHS",
    },
    verified: true,
    lastActive: "Yesterday",
  },
  {
    _id: "b6",
    userId: "user6",
    fullName: "James Mensah",
    username: "jmensah",
    bio: "Buyer for processed food company",
    role: UserRole.Buyer,
    rating: 4.4,
    country: "Ghana",
    region: "Eastern",
    purchaseHistory: {
      totalPurchases: 36,
      categories: ["Tomatoes", "Peppers", "Onions"],
      averageOrderValue: 1500,
      currency: "GHS",
    },
    verified: false,
    lastActive: "3 days ago",
  },
];

// Regions for filtering
const regions = [
  "All Regions",
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
];

// Categories for filtering
const categories = [
  "All Categories",
  "Vegetables",
  "Fruits",
  "Grains",
  "Poultry",
  "Dairy",
  "Cassava",
  "Maize",
  "Yam",
  "Cocoa",
  "Cashew",
  "Shea",
  "Tomatoes",
  "Peppers",
  "Onions",
];

export default function BuyersPage() {
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter buyers based on selected filters and search query
  const filteredBuyers = mockBuyers.filter((buyer) => {
    const matchesRegion =
      selectedRegion === "All Regions" || buyer.region === selectedRegion;
    const matchesCategory =
      selectedCategory === "All Categories" ||
      buyer.purchaseHistory.categories.some((cat) => cat === selectedCategory);
    const matchesSearch =
      buyer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (buyer.bio &&
        buyer.bio.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRegion && matchesCategory && matchesSearch;
  });

  return (
    <main className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
            Find Top Buyers Near You
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Connect with verified buyers looking for your products
          </p>
        </div>

        {/* Search and filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search input */}
            <div className="col-span-1 md:col-span-3 lg:col-span-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search buyers by name or interests..."
                  className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute right-3 top-3 text-gray-400 dark:text-gray-500">
                  {/* Search icon would go here */}
                  🔍
                </span>
              </div>
            </div>

            {/* Region filter */}
            <div>
              <select
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Category filter */}
            <div>
              <select
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredBuyers.length} buyer
              {filteredBuyers.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:text-gray-200">
                Sort by: Rating ↓
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
                Advanced Filters
              </button>
            </div>
          </div>
        </div>

        {/* Buyers grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuyers.map((buyer) => (
            <div
              key={buyer._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {buyer.profilePicture ? (
                    <img
                      src={buyer.profilePicture.url}
                      alt={buyer.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-700 flex items-center justify-center text-green-600 dark:text-green-200 font-bold">
                      {buyer.fullName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 dark:text-gray-200">
                        {buyer.fullName}
                      </h3>
                      {buyer.verified && (
                        <span
                          className="text-blue-500 dark:text-blue-300 text-lg"
                          title="Verified Buyer"
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      @{buyer.username}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {buyer.bio || "No bio available"}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {buyer.rating}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {buyer.region}, {buyer.country}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-wrap gap-1">
                    {buyer.purchaseHistory.categories
                      .slice(0, 3)
                      .map((category, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-50 dark:bg-green-700 text-green-700 dark:text-green-200 text-xs rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-sm">
                  <div className="text-gray-600 dark:text-gray-400">
                    {buyer.purchaseHistory.totalPurchases} purchases
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-200">
                    ~{buyer.purchaseHistory.currency}{" "}
                    {buyer.purchaseHistory.averageOrderValue.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Last active: {buyer.lastActive}
                </span>
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredBuyers.length === 0 && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center">
            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-4">
              🔍
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
              No buyers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm disabled:opacity-50 dark:text-gray-200">
              Previous
            </button>
            <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:text-gray-200">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:text-gray-200">
              3
            </button>
            <span className="text-gray-500 dark:text-gray-400">...</span>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:text-gray-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
