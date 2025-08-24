'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export default function DashboardBreadcrumb() {
    const pathName = usePathname()
    const segments = pathName.split('/').slice(1)
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => (
                    <Fragment key={`segment-${segment}`}>
                        <BreadcrumbItem className="capitalize font-mono">
                            {index < segments.length - 1 ?
                                (
                                    <BreadcrumbLink
                                        asChild
                                    >
                                        <Link href={`/${segments.slice(0, index + 1).join('/')}`}>
                                            {segment}
                                        </Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>
                                        {segment}
                                    </BreadcrumbPage>
                                )}
                        </BreadcrumbItem>
                        {index < segments.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}