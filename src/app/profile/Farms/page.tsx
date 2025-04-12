import React from "react";
import { TractorIcon } from "lucide-react";

export default function FarmListPage() {
  return (
    <main className="min-h-full w-full flex items-center justify-center bg-gradient-to-r from-amber-50 to-lime-50 dark:from-gray-900 dark:to-gray-900 p-6">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center text-center space-y-6 mb-8">
          <TractorIcon className="w-16 h-16 text-green-700 dark:text-green-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            No Farm Selected
          </h1>
          <p className="text-amber-700 dark:text-amber-500">
            Select a farm to view details
          </p>
        </div>
      </div>
    </main>
  );
}
