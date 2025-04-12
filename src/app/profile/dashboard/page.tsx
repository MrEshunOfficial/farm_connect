"use client";
import React, { useState } from "react";

// Interface for dashboard statistics
interface DashboardStats {
  totalPosts: number;
  totalFarmPosts: number;
  totalStorePosts: number;
  totalReviews: number;
  averageRating: number;
  wishlistCount: number;
  cartItemsCount: number;
  recentTransactions: any[];
}

// Mock data for demonstration
const mockStats: DashboardStats = {
  totalPosts: 24,
  totalFarmPosts: 16,
  totalStorePosts: 8,
  totalReviews: 12,
  averageRating: 4.5,
  wishlistCount: 7,
  cartItemsCount: 3,
  recentTransactions: [
    {
      id: "1",
      product: "Tomatoes",
      amount: 120,
      date: "2025-03-14",
      status: "completed",
    },
    {
      id: "2",
      product: "Farming Equipment",
      amount: 450,
      date: "2025-03-10",
      status: "processing",
    },
    {
      id: "3",
      product: "Maize Seeds",
      amount: 80,
      date: "2025-03-07",
      status: "completed",
    },
  ],
};

// Component for stat cards
const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: string;
}> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center">
    <div className="bg-green-100 dark:bg-green-900 rounded-full p-3 mr-4">
      <span className="text-green-600 dark:text-green-400 text-xl">{icon}</span>
    </div>
    <div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  </div>
);

// Main Dashboard component
const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [activeTab, setActiveTab] = useState<
    "overview" | "farms" | "stores" | "wishlist"
  >("overview");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );

  // Function to fetch real data (to be implemented)
  const fetchDashboardData = (range: "week" | "month" | "year") => {
    setTimeRange(range);
    // Here you would make an API call to get the actual data
    console.log(`Fetching data for range: ${range}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchDashboardData("week")}
            className={`px-4 py-2 rounded ${
              timeRange === "week"
                ? "bg-green-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => fetchDashboardData("month")}
            className={`px-4 py-2 rounded ${
              timeRange === "month"
                ? "bg-green-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => fetchDashboardData("year")}
            className={`px-4 py-2 rounded ${
              timeRange === "year"
                ? "bg-green-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 ${
              activeTab === "overview"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-900 dark:text-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("farms")}
            className={`px-4 py-2 ${
              activeTab === "farms"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-900 dark:text-gray-300"
            }`}
          >
            Farm Activities
          </button>
          <button
            onClick={() => setActiveTab("stores")}
            className={`px-4 py-2 ${
              activeTab === "stores"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-900 dark:text-gray-300"
            }`}
          >
            Store Activities
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`px-4 py-2 ${
              activeTab === "wishlist"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-900 dark:text-gray-300"
            }`}
          >
            Wishlist & Cart
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Posts" value={stats.totalPosts} icon="📝" />
            <StatCard
              title="Farm Posts"
              value={stats.totalFarmPosts}
              icon="🌾"
            />
            <StatCard
              title="Store Posts"
              value={stats.totalStorePosts}
              icon="🏪"
            />
            <StatCard
              title="Average Rating"
              value={`${stats.averageRating}/5`}
              icon="⭐"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Activity Overview</h2>
              <div className="h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {/* Placeholder for activity chart */}
                <p className="text-gray-500 dark:text-gray-400">
                  Activity Chart Goes Here
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">
                Recent Transactions
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-700">
                      <th className="text-left py-2">Product</th>
                      <th className="text-left py-2">Amount</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-300 dark:border-gray-700"
                      >
                        <td className="py-2">{transaction.product}</td>
                        <td className="py-2">${transaction.amount}</td>
                        <td className="py-2">{transaction.date}</td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              transaction.status === "completed"
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400"
                                : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-400"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">Reviews Received</h2>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center mb-2">
                  <div className="text-2xl font-bold mr-2">
                    {stats.averageRating}
                  </div>
                  <div className="text-yellow-400">★★★★★</div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Based on {stats.totalReviews} reviews
                </div>
              </div>
              <div className="h-32 w-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {/* Placeholder for rating distribution chart */}
                <p className="text-gray-500 dark:text-gray-400">Rating Chart</p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "farms" && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Farm Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="border rounded-lg p-4 border-gray-300 dark:border-gray-700">
              <h3 className="font-medium mb-2">Farm Type</h3>
              <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {/* Placeholder for farm type distribution */}
                <p className="text-gray-500 dark:text-gray-400">
                  Farm Type Chart
                </p>
              </div>
            </div>
            <div className="border rounded-lg p-4 border-gray-300 dark:border-gray-700">
              <h3 className="font-medium mb-2">Top Crops</h3>
              <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {/* Placeholder for top crops chart */}
                <p className="text-gray-500 dark:text-gray-400">
                  Top Crops Chart
                </p>
              </div>
            </div>
            <div className="border rounded-lg p-4 border-gray-300 dark:border-gray-700">
              <h3 className="font-medium mb-2">Production Scale</h3>
              <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {/* Placeholder for production scale chart */}
                <p className="text-gray-500 dark:text-gray-400">
                  Production Scale Chart
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Recent Farm Posts</h3>
            {/* Placeholder for recent farm posts list */}
            <p className="text-gray-500 dark:text-gray-400">
              No recent farm posts to display
            </p>
          </div>
        </div>
      )}

      {activeTab === "stores" && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Store Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4 border-gray-300 dark:border-gray-700">
              <h3 className="font-medium mb-2">Store Sales</h3>
              <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {/* Placeholder for store sales chart */}
                <p className="text-gray-500 dark:text-gray-400">
                  Store Sales Chart
                </p>
              </div>
            </div>
            <div className="border rounded-lg p-4 border-gray-300 dark:border-gray-700">
              <h3 className="font-medium mb-2">Top Selling Products</h3>
              <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {/* Placeholder for top selling products chart */}
                <p className="text-gray-500 dark:text-gray-400">
                  Top Products Chart
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Recent Store Posts</h3>
            {/* Placeholder for recent store posts list */}
            <p className="text-gray-500 dark:text-gray-400">
              No recent store posts to display
            </p>
          </div>
        </div>
      )}

      {activeTab === "wishlist" && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Wishlist & Cart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4 border-gray-300 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Wishlist Items</h3>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400 px-2 py-1 rounded text-xs">
                  {stats.wishlistCount} items
                </span>
              </div>
              <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {/* Placeholder for wishlist items distribution */}
                <p className="text-gray-500 dark:text-gray-400">
                  Wishlist Distribution Chart
                </p>
              </div>
            </div>
            <div className="border rounded-lg p-4 border-gray-300 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Cart Items</h3>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400 px-2 py-1 rounded text-xs">
                  {stats.cartItemsCount} items
                </span>
              </div>
              <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {/* Placeholder for cart items */}
                <p className="text-gray-500 dark:text-gray-400">
                  Cart Items Chart
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Recently Added Items</h3>
            {/* Placeholder for recently added items list */}
            <p className="text-gray-500 dark:text-gray-400">
              No recently added items to display
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
