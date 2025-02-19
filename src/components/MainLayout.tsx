"use client";

import { CategoryNavigation } from "@/components/CategoryNavigation";
import MainHeader from "@/components/headerUi/MainHeader";
import { usePathname } from "next/navigation";
import ProfileList from "../lib/ProfileLists";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const authPages = ["/authclient/Login", "/authclient/Register"];
  const isAuthPage = authPages.includes(pathname);
  const isProfilePage = pathname.startsWith("/profile");
  const isParamsPage = pathname.startsWith("/public_profiles");
  const showCategoryNav = !isAuthPage && !isProfilePage && !isParamsPage;

  return (
    <div className="w-full h-screen flex flex-col p-3">
      {!isAuthPage && (
        <div className="w-full p-1 border rounded-md mb-2">
          <MainHeader />
        </div>
      )}
      <div className="w-full flex flex-1 gap-2 flex-col md:flex-row">
        {showCategoryNav && (
          <div className="w-full md:w-80 flex flex-col gap-2">
            <CategoryNavigation />
          </div>
        )}
        <main
          className={`flex-1 ${
            isAuthPage ? "flex items-center justify-center" : "w-full"
          }`}
        >
          {children}
        </main>
        {!isAuthPage && !isProfilePage && (
          <div className="w-full md:w-80 flex flex-col gap-2">
            <ProfileList />
          </div>
        )}
      </div>
    </div>
  );
}
