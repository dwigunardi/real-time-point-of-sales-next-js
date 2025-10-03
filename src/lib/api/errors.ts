import type { PostgrestError } from '@supabase/supabase-js'

export interface ApiError {
    error: string
    code?: string
    details?: any
    status: number
}

export class CustomApiError extends Error {
    status: number
    code?: string
    details?: any

    constructor(message: string, status: number = 500, code?: string, details?: any) {
        super(message)
        this.name = 'CustomApiError'
        this.status = status
        this.code = code
        this.details = details
    }
}

// Safe error extraction untuk PostgrestError
export function extractSupabaseError(error: PostgrestError): ApiError {
    return {
        error: error.message || 'Database operation failed',
        code: error.code || 'SUPABASE_ERROR',
        details: error.details || null,
        status: getStatusFromSupabaseError(error)
    }
}

function getStatusFromSupabaseError(error: PostgrestError): number {
    // Mapping common PostgrestError codes to HTTP status
    if (error.code === 'PGRST116') return 416 // Range Not Satisfiable
    if (error.code === '42P01') return 404    // Table not found
    if (error.code === '42501') return 403    // Insufficient privilege
    if (error.code === '23505') return 409    // Unique violation
    if (error.code === '23503') return 400    // Foreign key violation
    if (error.code === '22P02') return 400    // Invalid input syntax
    return 500 // Default server error
}