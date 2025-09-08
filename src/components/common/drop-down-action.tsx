import { ReactNode } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";

export default function DropDownAction({ menu }: {
    menu: {
        label: string | ReactNode,
        variant?: 'default' | 'destructive',
        action?: () => void
        type: 'link' | 'button'
    }[]
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="data-[state=open]:bg-cyan-600 data-[state=open]:text-white cursor-pointer">
                <Button variant={'ghost'} className="text-muted-foreground size-8" size={"icon"}>
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={5} side="right" className="w-32">
                {menu.map((item, index) => (
                    <DropdownMenuItem
                        key={`dropdown-action-${index}`}
                        className="cursor-pointer focus:bg-cyan-600 focus:text-white"
                        variant={item.variant || 'default'}
                        asChild={item.type === 'link'}
                        onClick={item.action}
                    >
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}