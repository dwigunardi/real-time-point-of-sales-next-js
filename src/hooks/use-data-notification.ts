import { useEffect } from 'react'
import { toast } from 'sonner'

type Props = {
    isSuccess: boolean
    response: any
    q: string
    replaceParams: (params: { [key: string]: string | number | null }) => void
}
const useDataNotifications = ({ isSuccess, response, q, replaceParams }: Props) => {
    useEffect(() => {
        if (!isSuccess || !response) return

        if (response.pageExceeded) {
            toast.info('Page Not Found', {
                description: `Redirecting to page 1 of ${response.totalPages} pages`,
            })
            replaceParams({ page: 1 })
            return
        }

        if (response.noResults && q) {
            toast.info('No Results', {
                description: `No users found matching "${q}"`,
            })
        }

        if (response.isEmpty && !q) {
            toast.info('No Data', {
                description: 'No users have been created yet',
            })
        }
    }, [isSuccess, response, q, replaceParams])
}