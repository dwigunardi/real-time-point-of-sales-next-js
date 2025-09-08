// app/(dashboard)/admin/user/page.tsx
import { HydrationBoundary } from '@tanstack/react-query'
import { prefetchDehydratedState } from '@/lib/react-query/prefetch'
import { buildUsersKey, UsersParams } from '@/lib/react-query/keys'
import { serverFetchJSON } from '@/lib/fetcher/server-fetch'
import UserManagement from './_components/user'

type UsersResponse = { data: any[]; count: number; page: number; limit: number }

export const metadata = {
    title: 'Kumpul Cafe | User Management',
    description: 'User Management Page',
}

export default async function UserManagementPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string; limit?: string }>
}) {
    const { q = '', page: pageStr = '1', limit: limitStr = '10' } = await searchParams

    const p: UsersParams = {
        q,
        page: Number(pageStr) || 1,
        limit: Number(limitStr) || 10,
    }

    const dehydratedState = await prefetchDehydratedState([
        {
            queryKey: buildUsersKey(p),
            queryFn: () =>
                serverFetchJSON<UsersResponse>('/api/users', {
                    ...(p.q ? { q: p.q } : {}),
                    page: String(p.page),
                    limit: String(p.limit),
                }),
        },
    ])

    return (
        <HydrationBoundary state={dehydratedState}>
            <UserManagement />
        </HydrationBoundary>
    )
}