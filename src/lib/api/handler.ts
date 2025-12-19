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
export interface ApiHandlerContext {
  request: NextRequest
  context?: unknown // tipekan sesuai kebutuhan (misal: { params: { ... } } jika pakai route segments)
  user?: unknown // bisa ganti jadi tipe user Supabase tertentu
  pagination?: { page: number, limit: number } | null
  searchParams?: Record<string, string | string[]>
}

export type ApiHandlerFn = (ctx: ApiHandlerContext) => Promise<NextResponse | void>


export function withApiHandler(
  handlers: Record<string, ApiHandlerFn>,
  options: ApiHandlerOptions = {}
) {
  const {
    allowedMethods = ['GET'],
    requireAuth = false,
    validatePagination: needsPagination = false
  } = options

  return async (request: NextRequest, context?: unknown) => {
    try {
      if (!allowedMethods.includes(request.method!)) {
        return errorResponse(`Method ${request.method} not allowed`, 405)
      }

      // Auth validation
      let user: unknown = null
      if (requireAuth) {
        const supabase = await createClient()
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        if (authError || !authUser) {
          return errorResponse('Unauthorized', 401)
        }
        user = authUser
      }

      // Pagination validation
      let pagination: { page: number, limit: number } | null = null
      if (needsPagination) {
        pagination = validatePagination(request)
      }

      const searchParams = extractSearchParams(request)

      const handler = handlers[request.method!]
      if (!handler) {
        return errorResponse('Handler not found', 500)
      }

      return await handler({
        request,
        context,
        user,
        pagination,
        searchParams
      })

    } catch (error: unknown) {
      console.error(`API Error [${request.method} ${request.url}]:`, error)
      if (error instanceof CustomApiError) {
        return errorResponse({
          error: error.message,
          code: error.code,
          details: error.details,
          status: error.status
        })
      }
      return errorResponse(
        error instanceof Error ? error.message : 'Internal server error',
        500
      )
    }
  }
}