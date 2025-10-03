import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ApiResponse {
    pageExceeded?: boolean
    noResults?: boolean
    isEmpty?: boolean
    isOutOfRange?: boolean
    totalPages?: number
    page?: number
    count?: number
}

interface UseApiFlagsOptions {
    showEmptyToast?: boolean
    showNoResultsToast?: boolean
    autoRedirectOnPageExceeded?: boolean
    onPageExceeded?: () => void
    onClearSearch?: () => void
}

export function useApiFlags(
    response: ApiResponse | undefined,
    error: Error | null,
    searchQuery: string,
    page: number,
    options: UseApiFlagsOptions = {}
) {
    const {
        showEmptyToast = true,
        showNoResultsToast = true,
        autoRedirectOnPageExceeded = false,
        onPageExceeded,
        onClearSearch
    } = options

    const [isShowingToast, setIsShowingToast] = useState(false)
    const [lastToastType, setLastToastType] = useState<string | null>(null)

    useEffect(() => {
        let timeout: NodeJS.Timeout = setTimeout(() => { }, 0)

        if (error) {
            timeout = setTimeout(() => {
                setTimeout(() => {
                    toast.error('System Error', {
                        description: error.message || 'An unexpected error occurred'
                    })
                })
            })
            return
        }

        if (!response) return

        if (response.pageExceeded) {
            timeout = setTimeout(() => {
                toast.error('Page Not Found', {
                    description: `Page ${page} not available. Total pages: ${response.totalPages}`,
                    action: {
                        label: 'Go to Page 1',
                        onClick: () => {
                            onPageExceeded?.()
                        }
                    }
                })
            })
            return
        }

        if (autoRedirectOnPageExceeded && response.pageExceeded) {
            timeout = setTimeout(() => {
                onPageExceeded?.()
            }, 3000)
            return
        }

        if (response.noResults && searchQuery && showNoResultsToast) {
            timeout = setTimeout(() => {
                toast.error('No Results Found', {
                    description: `No results found for "${searchQuery}"`,
                    action: {
                        label: 'Clear Search',
                        onClick: () => {
                            onClearSearch?.()
                        }
                    }
                })
            })
            return
        }

        if (response.isEmpty && !searchQuery && showEmptyToast) {
            timeout = setTimeout(() => {
                toast.error('No Data Available', {
                    description: 'No data has been created yet.',
                })
            })
            return
        }

        return () => {
            clearTimeout(timeout)
        }

    }, [
        response?.pageExceeded,
        response?.noResults,
        response?.isEmpty,
        response?.totalPages,
        response?.page,
        error?.message,
        searchQuery,
        page,
        showEmptyToast,
        showNoResultsToast
    ])

    return {
        isShowingToast,
        lastToastType,
        hasError: !!error,
        hasResponse: !!response,
        // Utility functions jika diperlukan
        clearToast: () => {
            setIsShowingToast(false)
            setLastToastType(null)
            toast.dismiss()
        },
        showEmptyToast: () => {
            setIsShowingToast(true)
            setLastToastType('empty')
            toast.error('No Data Available', {
                description: 'No data has been created yet.',
            })
        },
        showNoResultsToast: () => {
            setIsShowingToast(true)
            setLastToastType('noResults')
            toast.error('No Results Found', {
                description: `No results found for "${searchQuery}"`,
                action: {
                    label: 'Clear Search',
                    onClick: () => {
                        onClearSearch?.()
                    }
                }
            })
        },
        showPageExceededToast: () => {
            setIsShowingToast(true)
            setLastToastType('pageExceeded')
            toast.error('Page Not Found', {
                description: `Page ${page} not available. Total pages: ${response?.totalPages}`,
                action: {
                    label: 'Go to Page 1',
                    onClick: () => {
                        onPageExceeded?.()
                    }
                }
            })
        },
        showSystemErrorToast: () => {
            setIsShowingToast(true)
            setLastToastType('systemError')
            toast.error('System Error', {
                description: error?.message || 'An unexpected error occurred'
            })
        },
        showRetryToast: () => {
            setIsShowingToast(true)
            setLastToastType('retry')
            toast.error('System Error', {
                description: 'An unexpected error occurred. Please try again.',
                action: {
                    label: 'Retry',
                    onClick: () => {
                        window.location.reload()
                    }
                }
            })
        }
    }
}