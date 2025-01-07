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
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: PieChart,
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
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
      isActive: true,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
      isActive: false,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
      isActive: false,
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
  return (
    <Sidebar {...props} className={poppins.className} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
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
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain}></NavMain>
        <NavProjects projects={data.projects}></NavProjects>
        <NavTasks tasks={data.tasks}></NavTasks>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
