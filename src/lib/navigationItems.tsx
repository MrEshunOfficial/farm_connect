import React from "react";
import {
  LayoutDashboard,
  MessageCircle,
  StoreIcon,
  ShoppingCart,
  Tractor,
  Store,
  UserIcon,
  DollarSignIcon,
} from "lucide-react";

export interface NavigationItem {
  href?: string;
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
  showIf?: boolean;
  subItems?: NavigationItem[];
}

export const getNavigationItems = (activeProfile?: any): NavigationItem[] => {
  return [
    {
      href: "/profile/dashboard",
      icon: <LayoutDashboard size={20} className="text-gray-500" />,
      label: "Dashboard",
      ariaLabel: "Navigate to Dashboard",
    },
    {
      href: "/profile/Chats",
      icon: <MessageCircle size={20} className="text-blue-500" />,
      label: "Conversations",
      ariaLabel: "View Conversations",
    },
    {
      href: "/profile/buyers",
      icon: <StoreIcon size={20} className="text-yellow-400" />,
      label: `${
        activeProfile?.role === "Buyer"
          ? "Other Registered Buyers"
          : "Find Nearby Buyers"
      }`,
      ariaLabel: "Locate nearby buyers...",
    },
    {
      href: "/profile/wish_list",
      icon: <ShoppingCart size={20} className="text-red-300" />,
      label: "Wish List",
      ariaLabel: "View Wish List",
    },
    {
      href: activeProfile?.role === "Farmer" ? `/profile/Farms/` : undefined,
      icon: <Tractor size={20} className="text-green-500" />,
      label: "Virtual Farms",
      ariaLabel: "View Farms",
      showIf: activeProfile?.role === "Farmer",
    },
    {
      href: activeProfile?.role === "Farmer" ? `/profile/f1/` : undefined,
      icon: <DollarSignIcon size={20} className="text-green-500" />,
      label: "Sell Farms Produce",
      ariaLabel: "View Farms",
      showIf: activeProfile?.role === "Farmer",
    },
    {
      href: activeProfile?.role === "Seller" ? `/profile/store/` : undefined,
      icon: <Store size={20} className="text-teal-500" />,
      label: "View Store",
      ariaLabel: "Visit Store",
      showIf: activeProfile?.role === "Seller",
    },
    {
      href: activeProfile?.role === "Seller" ? `/profile/s1/` : undefined,
      icon: <DollarSignIcon size={20} className="text-teal-500" />,
      label: "Sell Store Item",
      ariaLabel: "Visit Store",
      showIf: activeProfile?.role === "Seller",
    },
    activeProfile?.role === "Both"
      ? {
          icon: <UserIcon size={20} className="text-purple-500" />,
          label: "Manage Business",
          ariaLabel: "Manage Business Profiles",
          subItems: [
            {
              href: "/profile/store",
              icon: <Store size={20} className="text-purple-400" />,
              label: "Open Store",
              ariaLabel: "Visit Store",
            },
            {
              href: "/profile/Farms",
              icon: <Tractor size={20} className="text-purple-400" />,
              label: "Open Farm",
              ariaLabel: "Visit Farm",
            },
          ],
        }
      : null,
    activeProfile?.role === "Both"
      ? {
          icon: <DollarSignIcon size={20} className="text-green-500" />,
          label: "Sell Product",
          ariaLabel: "Manage Business Profiles",
          subItems: [
            {
              href: "/profile/s1",
              icon: <Store size={20} className="text-green-400" />,
              label: "Sell Store Item",
              ariaLabel: "Visit Store",
            },
            {
              href: "/profile/f1",
              icon: <Tractor size={20} className="text-green-400" />,
              label: "Sell Farms Produce",
              ariaLabel: "Visit Farm",
            },
          ],
        }
      : null,
  ].filter(Boolean) as NavigationItem[];
};
