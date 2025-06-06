"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import type * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  Table,
  Layers,
  
} from "lucide-react"

import { NavDocuments } from "./nav-document"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { title } from "process";
import { url } from "inspector";




const data = {
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "StockAnaylsis",
      url: "analysis",
      icon: FileTextIcon,
    },
    {
      title: "portfolio",
      url: "portfolio",
      icon: BarChartIcon,
    },
    {
      title: "Tracker",
      url: "/timeline",
      icon: Layers,
    },
    {
      title: "Chatbot",
      url: "/chatbot",
      icon: UsersIcon,
    },
    {
      title:"TradeTable",
      url:"/tradetable",
      icon: Table,
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "/gethelp",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "/search",
      icon: SearchIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user,setUser]= useState({
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  })
  useEffect(()=>{
  const fetchuser = async ()=>{
    try {
      const response = await axios.get('http://localhost:5000/api/auth/user',{withCredentials: true});
      if(response.status === 200) {
        const userData =response.data.user;
        setUser({
          name: userData.username || "shadcn",
          email: userData.email || "m@example.com",
          avatar:"https://github.com/shadcn.png",
        })
      }
    }catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  fetchuser();
}, []);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Stock Story Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
