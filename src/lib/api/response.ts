import { NextResponse } from 'next/server'
import type { ApiError } from './errors'

export interface ApiResponse<T = any> {
    data?: T
    error?: string
    code?: string
    details?: any
    meta?: {
        page?: number
        limit?: number
        total?: number
        totalPages?: number
    }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
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

export function successResponse<T>(
    data: T,
    meta?: any,
    status: number = 200
): NextResponse {
    return NextResponse.json({
        data,
        ...(meta && { meta })
    }, { status })
}

export function errorResponse(
    error: ApiError | string,
    status?: number
): NextResponse {
    if (typeof error === 'string') {
        return NextResponse.json({
            error,
            timestamp: new Date().toISOString()
        }, { status: status || 500 })
    }

    return NextResponse.json({
        error: error.error,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString()
    }, { status: error.status })
}

export function paginatedResponse<T>(
    data: T[],
    count: number,
    page: number,
    limit: number,
    hasSearch: boolean = false
): NextResponse<PaginatedResponse<T>> {
    const totalPages = Math.ceil(count / limit)
    const hasData = data.length > 0
    const isOutOfRange = page > totalPages && count > 0

    const response: PaginatedResponse<T> = {
        data,
        count,
        page,
        limit,
        totalPages,
        hasData,
        isOutOfRange,
        isEmpty: !hasData && !hasSearch,
        noResults: !hasData && hasSearch,
        pageExceeded: isOutOfRange
    }

    return NextResponse.json(response)
}