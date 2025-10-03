import { clientFetchJSON } from './client-fetch'

export interface PaginatedResponse<T> {
    data: T[]
    count: number
    page: number
    limit: number
    totalPages: number
    hasData: boolean
    isOutOfRange: boolean
    isEmpty: boolean
    noResults: boolean
    pageExceeded: boolean
}

export interface PaginatedParams {
    q?: string
    page: number
    limit: number
}

export async function clientFetchPaginated<T>(
    path: string,
    params: PaginatedParams
): Promise<PaginatedResponse<T>> {
    const searchParams: Record<string, string> = {
        page: String(params.page),
        limit: String(params.limit),
    }

    if (params.q && params.q.trim()) {
        searchParams.q = params.q.trim()
    }

    try {

        const response = await clientFetchJSON<PaginatedResponse<T>>(path, searchParams)

        return response
    } catch (error) {
        console.error('clientFetchPaginated error:', error)

        // Re-throw dengan informasi tambahan
        if (error instanceof Error) {
            error.message = `Failed to fetch paginated data: ${error.message}`
        }
        throw error
    }
}