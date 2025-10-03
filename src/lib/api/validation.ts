import { NextRequest } from 'next/server'
import { CustomApiError } from './errors'

export interface PaginationParams {
    page: number
    limit: number
    offset: number
}

export interface SearchParams {
    q?: string
    [key: string]: string | undefined
}

export function validatePagination(request: NextRequest): PaginationParams {
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
    const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit') ?? '10')))

    if (isNaN(page) || isNaN(limit)) {
        throw new CustomApiError('Invalid pagination parameters', 400, 'INVALID_PAGINATION')
    }

    const offset = (page - 1) * limit

    return { page, limit, offset }
}

export function extractSearchParams(request: NextRequest): SearchParams {
    const { searchParams } = new URL(request.url)
    const params: SearchParams = {}

    searchParams.forEach((value, key) => {
        if (key !== 'page' && key !== 'limit') {
            params[key] = value || undefined
        }
    })

    return params
}

export function validateRequiredFields(
    body: any,
    requiredFields: string[]
): void {
    const missingFields = requiredFields.filter(field => !body[field])

    if (missingFields.length > 0) {
        throw new CustomApiError(
            `Missing required fields: ${missingFields.join(', ')}`,
            400,
            'MISSING_FIELDS',
            { missingFields }
        )
    }
}