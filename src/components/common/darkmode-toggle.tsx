"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DarkModeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const dataTheme = [
        {
            name: "light",
            value: "light",
        }
        ,
        {
            name: "dark",
            value: "dark",
        },
        {
            name: "system",
            value: "system",
        }
    ]

    const renderSelectedTheme = (value: string) => {
        return theme == value ? "bg-cyan-600 focus:text-white text-slate-100 focus:bg-cyan-600" : "dark:focus:bg-slate-800 focus:bg-slate-200 dark:hover:!text-white hover:!text-black dark:focus:text-slate-100 dark:hover:bg-slate-800"
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {dataTheme.map((item) => (
                    <DropdownMenuItem
                        key={item.value}
                        onClick={() => setTheme(item.value)}
                        className={`cursor-pointer ${renderSelectedTheme(item.value)}`}
                    >
                        {item.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}