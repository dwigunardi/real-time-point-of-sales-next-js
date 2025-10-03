'use client'

import { Coffee, EllipsisVertical, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SIDEBAR_MENU_LIST, SidebarMenuKey } from "@/constants/sidebar-constant";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signOut } from "@/actions/auth-action";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export default function AppSidebar() {
    const { isMobile } = useSidebar()
    const pathName = usePathname()
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const hasAnimatedRef = useRef(false)
    const [shouldAnimate, setShouldAnimate] = useState(false)

    const { profile, isHydrated } = useAuthStore((state) => state)

    const handleLogout = () => {
        startTransition(async () => {
            const result = await signOut()
            if (result.status === 'error') {
                toast.error(result.message)
                return
            }
            useAuthStore.getState().clear()
            toast.success(result.message)
            router.push('/login')
        })
    }

    useEffect(() => {
        if (isHydrated && !hasAnimatedRef.current) {
            setShouldAnimate(true)
            hasAnimatedRef.current = true
        }
    }, [isHydrated])

    const RenderLoadingSideMenu = ({ count }: { count: number }) => {
        return Array.from({ length: count }).map((_, index) => (
            <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild>
                    <div className="px-4 py-6 w-full rounded-md bg-gray-300 dark:bg-muted animate-pulse" />
                </SidebarMenuButton>
            </SidebarMenuItem>
        ))
    }

    const RenderSideMenuItem = () => (
        SIDEBAR_MENU_LIST[profile.role as SidebarMenuKey]?.map((item, index) => (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                        href={item.url}
                        className={cn(
                            `px-4 py-3 h-auto transition-colors`,
                            shouldAnimate && 'slide-in-text-top',
                            pathName === item.url
                                ? "bg-cyan-600 dark:bg-cyan-700 text-white hover:!bg-cyan-700 hover:text-white"
                                : "bg-transparent text-foreground hover:!bg-cyan-700 hover:text-white",
                        )}
                        style={shouldAnimate ? { ['--tw-animation-duration' as any]: `${index * 120}ms` } : undefined}
                        onAnimationEnd={index === (SIDEBAR_MENU_LIST[profile.role as SidebarMenuKey]?.length ?? 1) - 1
                            ? () => setShouldAnimate(false)
                            : undefined}
                    >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        ))
    )

    const RenderAvatar = () => {
        if (!profile.avatar_url || profile.avatar_url === '') return null

        return (
            <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src={profile.avatar_url} alt={profile.name} />
                <AvatarFallback className="rounded-lg">{profile.name?.charAt(0)}</AvatarFallback>
            </Avatar>
        )
    }

    return (
        <Sidebar side="left" variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size='lg' asChild >
                            <div className="flex items-center gap-2 self-center font-semibold">
                                <div className="bg-cyan-600 flex p-2 items-center justify-center rounded-md text-foreground">
                                    <Coffee className="size-4 text-white" />
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
                            {!isHydrated ? <RenderLoadingSideMenu count={5} /> : <RenderSideMenuItem />}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {!isHydrated ?
                        <RenderLoadingSideMenu count={1} />
                        :
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size="lg" className="data-[state=open]:bg-cyan-600 data-[state=open]:!text-white hover:bg-cyan-600 hover:text-white">
                                        <RenderAvatar />
                                        <div className="leading-tight">
                                            <h4 className="truncate font-medium">{profile.name}</h4>
                                            <p className="text-muted-foreground truncate text-xs capitalize">{profile.role}</p>
                                        </div>
                                        <EllipsisVertical className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="min-w-56 rounded-lg" side={isMobile ? 'bottom' : 'right'} align="end" sideOffset={4}>
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex gap-2 items-center px-1 py-1.5">
                                            <RenderAvatar />
                                            <div className="leading-tight">
                                                <h4 className="truncate font-medium">{profile.name}</h4>
                                                <p className="text-muted-foreground truncate text-xs capitalize">{profile.role}</p>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            disabled={isPending}
                                            onClick={() => handleLogout()}
                                            className="cursor-pointer hover:!bg-cyan-600 hover:!text-white transition-colors ease-in-out duration-300"
                                        >
                                            <LogOut className="size-4 hover:text-white" />
                                            {isPending ? "Logging out..." : "Logout"}
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    }
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}