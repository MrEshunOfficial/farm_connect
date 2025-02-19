// AuthCheck.tsx
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const AuthCheck: React.FC<{ userId?: string }> = ({ userId }) => {
  if (!userId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-96 p-6">
          <CardContent className="flex flex-col items-center space-y-4">
            <AlertCircle className="w-12 h-12 text-yellow-500 dark:text-yellow-300" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Authentication Required
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Please log in to your account to access and manage store listings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return null;
};
