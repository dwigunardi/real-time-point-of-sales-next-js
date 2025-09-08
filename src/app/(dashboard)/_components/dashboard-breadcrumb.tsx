'use client'
import { useSelectedLayoutSegments } from 'next/navigation'
import { Fragment, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export default function DashboardBreadcrumb() {
    const segments = useSelectedLayoutSegments()
    const hasAnimated = useRef(false)
    const [runOnce, setRunOnce] = useState(false)

    useEffect(() => {
        if (!hasAnimated.current) {
            setRunOnce(true)
        }
    }, [])

    return (
        <Breadcrumb>
            <BreadcrumbList
                suppressHydrationWarning
            >
                {segments.map((segment, index) => (
                    <Fragment key={`segment-${index}`}>
                        <BreadcrumbItem
                            className="capitalize font-mono slide-in-text-left"
                            style={
                                runOnce
                                    ? {
                                        ['--tw-enter-delay' as any]: `${index * 120}ms`,
                                        ['--tw-enter-duration' as any]: '200ms',
                                    }
                                    : undefined
                            }
                            onAnimationEnd={() => {
                                if (index === segments.length - 1 && runOnce) {
                                    hasAnimated.current = true
                                    setRunOnce(false)
                                }
                            }}
                        >
                            {index < segments.length - 1 ? (
                                <BreadcrumbLink asChild>
                                    <Link href={`/${segments.slice(0, index + 1).join('/')}`}>{segment}</Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{segment}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < segments.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}