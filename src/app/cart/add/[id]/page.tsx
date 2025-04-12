"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Gift,
  Clock,
  Heart,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import AddToCartPage from "../../AddToCartPage";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UserCartPage = ({ params }: { params: { id: string } }) => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";
  const [activePromo, setActivePromo] = useState(0);
  const productType = type === "farm" ? "farm" : "store";

  // Array of promotional messages
  const promos = [
    { icon: <Clock size={16} />, text: "Limited time offer today!" },
    { icon: <Gift size={16} />, text: "Free shipping on orders over $50" },
    { icon: <ShieldCheck size={16} />, text: "Satisfaction guaranteed" },
    {
      icon: <Heart size={16} />,
      text: `Supporting local ${productType} communities`,
    },
  ];

  // Rotate through promo messages
  useEffect(() => {
    const promoInterval = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promos.length);
    }, 3000);
    return () => clearInterval(promoInterval);
  }, [promos.length]);

  return (
    <div className="relative">
      {/* Promotional header banner */}
      <div className="p-4 my-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="font-medium mr-2">Flash Deal:</span>
                <div className="flex items-center space-x-1">
                  <span>{promos[activePromo].icon}</span>
                  <span className="text-sm">{promos[activePromo].text}</span>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              variant="secondary"
              className="text-xs px-3 py-1 h-auto"
            >
              See All Deals <ArrowRight size={12} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* The original cart page component */}
      <div className="relative">
        <AddToCartPage id={params.id} type={type} />
      </div>

      {/* Product benefits section */}
      <div className="max-w-4xl mx-auto px-4 mt-8 mb-12">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Heart size={18} className="text-rose-500 mr-2" />
          Why You&apos;ll Love This
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 flex items-start space-x-3">
            <div className="mt-1 bg-amber-100 p-1.5 rounded-full">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Quality Guarantee</h4>
              <p className="text-sm">
                {type === "farm"
                  ? "Farm-fresh products harvested within 24 hours of delivery."
                  : "All products quality-checked with a 30-day satisfaction guarantee."}
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4 flex items-start space-x-3">
            <div className="mt-1 bg-emerald-100 p-1.5 rounded-full">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Community Impact</h4>
              <p className="text-sm">
                {type === "farm"
                  ? "Support local agriculture and reduce food miles."
                  : "Strengthen your community's economy and reduce environmental impact."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCartPage;
