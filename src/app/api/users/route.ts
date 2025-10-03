import { withApiHandler } from '@/lib/api/handler'
import { createClient } from '@/lib/supabase/server'
import { paginatedResponse, errorResponse } from '@/lib/api/response'
import { extractSupabaseError } from '@/lib/api/errors'

async function getUsers({ pagination, searchParams }: any) {
    try {
        const supabase = await createClient()
        const { page, limit, offset } = pagination
        const { q } = searchParams

        // Step 1: Get total count untuk avoid 416 error
        let countQuery = supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        if (q?.trim()) {
            countQuery = countQuery.ilike('name', `%${q}%`)
        }

        const { count, error: countError } = await countQuery

        if (countError) {
            console.error('Count query error:', countError)
            const safeError = extractSupabaseError(countError)
            return errorResponse(safeError)
        }

        const totalPages = Math.ceil((count || 0) / limit)

        // Step 2: Handle out of range gracefully
        if (page > totalPages && (count || 0) > 0) {
            return paginatedResponse([], count || 0, page, limit, !!q?.trim())
        }

        // Step 3: Get actual data jika page valid
        let dataQuery = supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (q?.trim()) {
            dataQuery = dataQuery.ilike('name', `%${q}%`)
        }

        const { data, error: dataError } = await dataQuery

        if (dataError) {
            console.error('Data query error:', dataError)
            const safeError = extractSupabaseError(dataError)
            return errorResponse(safeError)
        }

        return paginatedResponse(data || [], count || 0, page, limit, !!q?.trim())

    } catch (error) {
        throw error // Will be handled by withApiHandler
    }
}

// Export handlers
export const GET = withApiHandler({
    GET: getUsers
}, {
    allowedMethods: ['GET'],
    requireAuth: true, // Set true jika perlu auth
    validatePagination: true
})