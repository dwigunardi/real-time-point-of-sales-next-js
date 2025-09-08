import { dehydrate, QueryClient } from '@tanstack/react-query'

export type PrefetchItem = { queryKey: any[]; queryFn: () => Promise<unknown> }

export async function prefetchDehydratedState(items: PrefetchItem[]) {
    const qc = new QueryClient()
    await Promise.all(items.map((i) => qc.prefetchQuery(i)))
    return dehydrate(qc)
}