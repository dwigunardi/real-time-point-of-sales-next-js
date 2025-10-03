import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
    CustomApiError,
    extractSupabaseError
} from './errors'
import {
    errorResponse,
    paginatedResponse,
    successResponse
} from './response'
import {
    validatePagination,
    extractSearchParams
} from './validation'

export interface ApiHandlerOptions {
    allowedMethods?: string[]
    requireAuth?: boolean
    validatePagination?: boolean
}

export function withApiHandler(
    handlers: Record<string, Function>,
    options: ApiHandlerOptions = {}
) {
    const {
        allowedMethods = ['GET'],
        requireAuth = false,
        validatePagination: needsPagination = false
    } = options

    return async (request: NextRequest, context?: any) => {
        try {
            // Method validation
            if (!allowedMethods.includes(request.method!)) {
                return errorResponse(`Method ${request.method} not allowed`, 405)
            }

            // Auth validation
            let user = null
            if (requireAuth) {
                const supabase = await createClient()
                const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

                if (authError || !authUser) {
                    return errorResponse('Unauthorized', 401)
                }
                user = authUser
            }

            // Pagination validation
            let pagination = null
            if (needsPagination) {
                pagination = validatePagination(request)
            }

            // Search params extraction
            const searchParams = extractSearchParams(request)

            // Call appropriate handler
            const handler = handlers[request.method!]
            if (!handler) {
                return errorResponse('Handler not found', 500)
            }

            const result = await handler({
                request,
                context,
                user,
                pagination,
                searchParams
            })

            return result

        } catch (error) {
            console.error(`API Error [${request.method} ${request.url}]:`, error)

            if (error instanceof CustomApiError) {
                return errorResponse({
                    error: error.message,
                    code: error.code,
                    details: error.details,
                    status: error.status
                })
            }

            // Fallback error
            return errorResponse(
                error instanceof Error ? error.message : 'Internal server error',
                500
            )
        }
    }
}