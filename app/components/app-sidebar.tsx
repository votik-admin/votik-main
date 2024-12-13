"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  FilePlus2,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Plus,
  PlusCircle,
  PlusSquare,
  Settings2,
  SquareTerminal,
  Table,
} from "lucide-react";

import { NavMain } from "@app/components/nav-main";
import { NavProjects } from "@app/components/nav-projects";
import { NavUser } from "@app/components/nav-user";
import { TeamSwitcher } from "@app/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@app/components/ui/sidebar";

const data = {
  teams: [
    {
      name: "Dashboard",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/organizer/dashboard",
      icon: Table,
    },
    {
      title: "Manage Events",
      url: "/organizer/dashboard/events",
      icon: BookOpen,
    },
    {
      title: "Create event",
      url: "/organizer/add-event",
      icon: PlusSquare,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/organizer/account",
        },
        {
          title: "Credentials",
          url: "/organizer/account/password",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
