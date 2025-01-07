"use client";

import { Poppins } from "next/font/google";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/authentication/login");
      toast.error("You must be logged in to access this page.");
      return;
    }

    try {
      const decodedToken = jwt.decode(token);
      if (decodedToken && decodedToken.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          router.push("/authentication/login");
          toast.error("Your session has expired. Please log in again.");
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      router.push("/authentication/login");
      toast.error("Invalid token. Please log in again.");
    }
  }, [router]);

  // Generate breadcrumbs based on pathname
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    return pathSegments.map((segment, index) => {
      const isLast = index === pathSegments.length - 1;
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const formattedSegment =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");

      return (
        <React.Fragment key={href}>
          <BreadcrumbItem className="hidden md:block">
            {!isLast ? (
              <BreadcrumbLink href={href}>{formattedSegment}</BreadcrumbLink>
            ) : (
              <span>{formattedSegment}</span>
            )}
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator />}
        </React.Fragment>
      );
    });
  };

  return (
    <SidebarProvider className="bg-[#F2F0FF]">
      <div className="flex h-full w-full">
        <AppSidebar />
        <div
          className={`flex flex-col w-full h-full bg-[#F2F0FF] overflow-y-auto ${poppins.className}`}
        >
          <Toaster position="top-right" reverseOrder={false} />
          <header className="flex h-16 shrink-0 items-center gap-2 w-full transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="w-10 h-10 hover:bg-[#daddff] m-3" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 bg-[#8f8f8f]"
              />
              <Breadcrumb>
                <BreadcrumbList>{generateBreadcrumbs()}</BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
