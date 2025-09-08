'use client'

import { useDeferredValue, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useReplaceParams } from '@/hooks/use-replace-param'
import DataTable from '@/components/common/data-table'
import { HEADER_TABLE_USER } from '@/constants/user-constant'
import { buildUsersKey } from '@/lib/react-query/keys'
import { clientFetchJSON } from '@/lib/fetcher/client-fetch'
import DropDownAction from '@/components/common/drop-down-action'
import { Pencil, Trash2 } from 'lucide-react'

function parsePositiveInt(v: string | null, fallback: number) {
    const n = Number(v)
    return Number.isFinite(n) && n > 0 ? n : fallback
}

type UsersResponse = { data: { id: string; name: string; role: string }[]; count: number; page: number; limit: number }

export default function UserManagement() {
    const sp = useSearchParams()
    const replaceParams = useReplaceParams()

    const qRaw = sp.get('q') ?? ''
    const page = parsePositiveInt(sp.get('page'), 1)
    const limit = parsePositiveInt(sp.get('limit'), 10)

    const q = useDeferredValue(qRaw)

    const queryKey = useMemo(() => buildUsersKey({ q, page, limit }), [q, page, limit])

    const { data, isLoading, isError, error } = useQuery({
        queryKey: queryKey,
        queryFn: () =>
            clientFetchJSON<UsersResponse>('/api/users', {
                ...(q ? { q } : {}),
                page: String(page),
                limit: String(limit),
            }),
        staleTime: 30_000,
        retry: 1,
    })


    const onSearchChange = (value: string) => {
        // Set q, reset ke page 1; kosongkan q untuk menghapus param dari URL
        replaceParams({ q: value || null, page: 1 })
    }

    const gotoPage = (p: number) => replaceParams({ page: Math.max(1, p) })
    const setLimit = (l: number) => replaceParams({ limit: l, page: 1 })

    if (isError) {
        toast.error('Error fetching users', { description: (error as Error)?.message })
    }

    const usersFilteredData = useMemo(() => {
        return (data?.data || []).map((user, index) => {
            return [
                index + 1,
                user.id,
                user.name,
                user.role,
                <DropDownAction key={index} menu={[
                    {
                        label: (
                            <span className='flex items-center gap-2'>
                                <Pencil className='size-4 focus:text-white' />
                                Edit
                            </span>
                        ),
                        action: () => console.log('edit'),
                        type: 'link',
                        variant: 'default'
                    },
                    {
                        label: (
                            <span className='flex items-center gap-2'>
                                <Trash2 className='text-red-400 size-4' />
                                Delete
                            </span>
                        ),
                        action: () => console.log('delete'),
                        type: 'link',
                        variant: 'destructive'
                    }
                ]} />
            ]
        })
    }, [data?.data])

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
                <h1 className="text-2xl font-bold">User Management</h1>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search By Name"
                        defaultValue={qRaw}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Create</Button>
                        </DialogTrigger>
                    </Dialog>
                </div>
            </div>

            <div className="w-full flex flex-col gap-2">
                {/* {isLoading && (
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-full h-8 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                )} */}
                <DataTable header={HEADER_TABLE_USER} isLoading={isLoading} dataSource={usersFilteredData} />

                {/* <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" onClick={() => gotoPage(page - 1)} disabled={page <= 1}>
                        Prev
                    </Button>
                    <span>Page {page} {isFetching ? '· Loading…' : null}</span>
                    <Button variant="outline" onClick={() => gotoPage(page + 1)} disabled={users.length < limit}>
                        Next
                    </Button>

                    <select name="limit" id="limit" title='Limit' className="ml-4 border rounded px-2 py-1" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>{n} / page</option>
                        ))}
                    </select>
                </div> */}
            </div>
        </div>
    )
}