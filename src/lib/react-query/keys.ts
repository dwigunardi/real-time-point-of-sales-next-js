export type UsersParams = { q: string; page: number; limit: number }

export interface User {
    id: string
    name: string
    role: string
    created_at: string
}

export interface UsersResponse {
    data: User[]
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

export const buildUsersKey = (p: UsersParams) => ['users', p]
