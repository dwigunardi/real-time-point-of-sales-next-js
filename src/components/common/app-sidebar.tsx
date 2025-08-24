'use client'

import { Coffee, EllipsisVertical, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SIDEBAR_MENU_LIST, SidebarMenuKey } from "@/constants/sidebar-constant";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AppSidebar() {
    const { isMobile } = useSidebar()
    const pathName = usePathname()
    const profile = {
        name: "Dwi Gunardi Meinaki",
        role: "admin",
        avatar_url: "",
    }

    return (
        <Sidebar side="left" variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size='lg' asChild >
                            <div className="flex items-center gap-2 self-center font-semibold">
                                <div className="bg-cyan-600 flex p-2 items-center justify-center rounded-md text-foreground">
                                    <Coffee className="size-4" />
                                </div>
                                Kumpul Cafe
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu>
                            {SIDEBAR_MENU_LIST[profile.role as SidebarMenuKey]?.map(
                                (item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild tooltip={item.title}>
                                            <Link
                                                href={item.url}
                                                className={cn(
                                                    "px-4 py-3 h-auto transition-colors",
                                                    pathName === item.url
                                                        ? "bg-cyan-600 dark:bg-cyan-700 text-white hover:!bg-cyan-700 hover:text-white"
                                                        : "bg-transparent text-foreground hover:!bg-cyan-700 hover:text-white",
                                                )}
                                            >
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-cyan-600 data-[state=open]:text-white hover:bg-cyan-600 hover:text-white">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="" />
                                        <AvatarFallback className="rounded-lg">A</AvatarFallback>
                                    </Avatar>
                                    <div className="leading-tight">
                                        <h4 className="truncate font-medium">Dwi Gunardi Meinaki</h4>
                                        <p className="text-muted-foreground truncate text-xs">Admin</p>
                                    </div>
                                    <EllipsisVertical className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-56 rounded-lg" side={isMobile ? 'bottom' : 'right'} align="end" sideOffset={4}>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex gap-2 items-center px-1 py-1.5">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src="https://github.com/shadcn.png" alt="" />
                                            <AvatarFallback className="rounded-lg">A</AvatarFallback>
                                        </Avatar>
                                        <div className="leading-tight">
                                            <h4 className="truncate font-medium">Dwi Gunardi Meinaki</h4>
                                            <p className="text-muted-foreground truncate text-xs">Admin</p>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <LogOut className="size-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}