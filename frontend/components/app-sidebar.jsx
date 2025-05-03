import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import NavMain from "./nav-main";
import NavProjects from "./nav-projects";
import { poppins } from "@/app/fonts/fonts";
import NavTasks from "./nav-tasks";
import { NavUser } from "./nav-user";
import Link from "next/link";
import { fetchProjectDetails } from "@/app/utilities/projectUtils";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const {
  Calendar,
  PieChart,
  Activity,
  FolderKanban,
  Map,
  Check,
  Frame,
  Command,
  CheckCircle2,
  CheckCircle,
} = require("lucide-react");

const data = {
  user: {
    name: "John Doe",
    email: "johndoe@gmail.com",
    avatar: "https://github.com/shadcn.png",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: Calendar,
    },
    {
      title: "Activity",
      url: "/dashboard/activity",
      icon: Activity,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: FolderKanban,
    },
  ],
  tasks: [
    {
      name: "Task 1",
      url: "#",
      icon: CheckCircle,
    },
    {
      name: "Task 2",
      url: "#",
      icon: CheckCircle,
    },
    {
      name: "Task 3",
      url: "#",
      icon: CheckCircle,
    },
  ],
};

export function AppSidebar({ handleLogout, ...props }) {
  const [projects, setProjects] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await fetchProjectDetails();
        console.log("Fetched project data:", data); // Debugging line
        if (data) {
          const projectDetails = data.map((project) => {
            const url = `/dashboard/projects/${project.id}`;
            console.log("Project:", project); // Debugging line
            return {
              name: project.title,
              url,
              icon: FolderKanban,
              isActive: pathname === url,
            };
          });
          setProjects(projectDetails);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, [pathname]);

  return (
    <Sidebar {...props} className={poppins.className} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src={"/logo_white.png"}
                    width={16}
                    height={16}
                    alt="logo_white"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-xl">
                    FlowForge
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain}></NavMain>
        <NavProjects projects={projects}></NavProjects>
        <NavTasks tasks={data.tasks}></NavTasks>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
