"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavMain({ items }) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem key={index}>
              <Link href={item.url}>
                <SidebarMenuButton
                  className={`${
                    isActive
                      ? "bg-blue-500 text-white hover:bg-blue-500 hover:text-white"
                      : ""
                  }`}
                  tooltip={item.title}
                >
                  {item.icon && <item.icon />}

                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
              <SidebarMenuSub></SidebarMenuSub>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
