'use client'

import { useDeferredValue, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import DataTable from '@/components/common/data-table'
import { HEADER_TABLE_USER } from '@/constants/user-constant'
import { buildUsersKey, User } from '@/lib/react-query/keys'
import DropDownAction from '@/components/common/drop-down-action'
import { Pencil, Trash2 } from 'lucide-react'
import useDatatable from '@/hooks/use-data-table'
import API_URL from '@/constants/url-constant'
import { clientFetchPaginated } from '@/lib/fetcher/paginated-fetch'
import { useApiFlags } from '@/hooks/use-api-flags'

export default function UserManagement() {
    const {
        qRaw,
        page,
        limit,
        handleSearch,
        handleChangePage,
        handleChangeLimit,
        DEFAULT_SEARCH,
        DEFAULT_PAGE,
    } = useDatatable()

    const q = useDeferredValue(qRaw)
    const queryKey = useMemo(() => buildUsersKey({ q: qRaw, page, limit }), [q, page, limit])

    const { data: response, isLoading, error } = useQuery({
        queryKey: queryKey,
        queryFn: () =>
            clientFetchPaginated<User>(API_URL.getUsers, {
                ...(q ? { q } : {}),
                page: page,
                limit: limit,
            }),
        staleTime: 30_000,
        retry: 1,
    })

    const { hasError, showRetryToast } = useApiFlags(
        response,
        error as Error | null,
        q,
        page,
        {
            showEmptyToast: !q,
            showNoResultsToast: true,
            autoRedirectOnPageExceeded: false,
            onPageExceeded: () => handleChangePage(DEFAULT_PAGE),
            onClearSearch: () => handleSearch(DEFAULT_SEARCH),
        }
    )
    console.log(hasError, response)
    if (hasError) {
        buildUsersKey({ q: qRaw, page, limit })
        showRetryToast()
        return null
    }

    const totalPages = useMemo(() => {
        return response?.totalPages ? Math.ceil(response.totalPages / limit) : 0
    }, [response?.totalPages, limit])

    const usersFilteredData = useMemo(() => {
        return (response?.data || []).map((user, index) => [
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
        )
    }, [response?.data])

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
                <h1 className="text-2xl font-bold">User Management</h1>
                <div className="flex gap-2">
                    <Input
                        key={qRaw}
                        className='transition-colors duration-300 focus:ring-offset-blue-50 focus-visible:ring-2 focus-visible:ring-cyan-600 active:ring-cyan-600'
                        placeholder="Search By Name"
                        defaultValue={qRaw}
                        onChange={(e) => handleSearch(e.target.value)}
                        type="search"
                    />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Create</Button>
                        </DialogTrigger>
                    </Dialog>
                </div>
            </div>
            <div className="w-full flex flex-col gap-2">
                <DataTable
                    header={HEADER_TABLE_USER}
                    isLoading={isLoading}
                    dataSource={usersFilteredData}
                    totalPages={totalPages}
                    currentPage={page}
                    currentLimit={limit}
                    onPageChange={handleChangePage}
                    onLimitChange={handleChangeLimit}
                />
            </div>
        </div>
    )
}