'use client'

import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query'
import { ReactNode } from 'react'

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                refetchOnMount: false,
                retry: false,
                staleTime: 60_000
            },
        },
    })
}

let browserClient: QueryClient | undefined
function getQueryClient() {
    if (isServer) return makeQueryClient()
    if (!browserClient) browserClient = makeQueryClient()
    return browserClient
}


export function ReactQueryProvider({ children }: { children: ReactNode }) {
    const client = getQueryClient()

    // if (process.env.NODE_ENV === 'development') {
    //     client.setDefaultOptions({
    //         queries: {
    //             refetchOnWindowFocus: true,
    //             refetchOnReconnect: true,
    //             refetchOnMount: true,
    //             retry: true,
    //         },
    //     })
    // }

    return (
        <QueryClientProvider client={client}>
            {children}
            {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
    )
}