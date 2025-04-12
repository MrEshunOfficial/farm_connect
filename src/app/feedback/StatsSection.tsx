"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { IReview } from "@/models/profileI-interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsSectionProps {
  reviews: IReview[];
  averageRating: number;
  pagination: any;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  reviews,
  averageRating,
  pagination,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(
              (r: IReview) => r.rating === rating
            ).length;
            const percentage = (count / reviews.length) * 100 || 0;

            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center w-16">
                  {rating}{" "}
                  <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-yellow-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="w-16 text-right text-sm text-muted-foreground">
                  {count} ({percentage.toFixed(0)}%)
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </h3>
                <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Reviews
                </h3>
                <p className="text-3xl font-bold">{pagination.totalDocs}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Most Common Category
                </h3>
                <p className="text-3xl font-bold">
                  {reviews.length
                    ? (Object.entries(
                        reviews.reduce<Record<string, number>>(
                          (acc, review: IReview) => {
                            acc[review.role] = (acc[review.role] || 0) + 1;
                            return acc;
                          },
                          {}
                        )
                      ).sort((a, b) => b[1] - a[1])[0][0] as string)
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsSection;
