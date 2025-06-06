"use client"

import {Import, MailIcon, PlusCircleIcon, type LucideIcon} from "lucide-react";
import { NavLink } from "react-router-dom";
import {Button} from "@/components/ui/button";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {ModeToggle} from '@/components/theme/ModeToggle'
export function NavMain({
    items,
}:{
    items:{
        title:string
        url:string
        icon?:LucideIcon
    }[]
}){
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <SidebarMenuButton tooltip={"Quick Actions"} className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 
                        hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground">
                        <PlusCircleIcon/>
                        <span>Quick</span>
                        </SidebarMenuButton>
                        <Button size="icon" className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0" variant="outline">
              {/* <MailIcon />
              <span className="sr-only">Inbox</span> */}
              <ModeToggle/>
              <span className="sr-only">Theme</span>
            </Button>
                    </SidebarMenuItem>
                </SidebarMenu>
                {items.map((item) =>(
                    <SidebarMenuItem key={item.title}>
                        <NavLink to={item.url} className="flex items-center gap-2">
                        <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon/>}
                            <span>{item.title}</span>
                        </SidebarMenuButton>
                        </NavLink>
                    </SidebarMenuItem>
                ))}
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

