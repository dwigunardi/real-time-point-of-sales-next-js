// app/api/users/route.ts (tambahan)
import { validateRequiredFields } from '@/lib/api/validation'
import { withApiHandler } from '@/lib/api/handler'
import { createClient } from '@/lib/supabase/server'
import { paginatedResponse, errorResponse, successResponse } from '@/lib/api/response'
import { extractSupabaseError } from '@/lib/api/errors'
async function createUser({ request, user }: any) {
    const body = await request.json()

    // Validate required fields
    validateRequiredFields(body, ['name', 'email'])

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .insert([{
            name: body.name,
            email: body.email,
            created_by: user?.id || null
        }])
        .select()
        .single()

    if (error) {
        const safeError = extractSupabaseError(error)
        return errorResponse(safeError)
    }

    return successResponse(data, null, 201)
}

async function updateUser({ request, context, user }: any) {
    const { id } = context.params
    const body = await request.json()

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .update({
            name: body.name,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        const safeError = extractSupabaseError(error)
        return errorResponse(safeError)
    }

    return successResponse(data)
}

// // Update export dengan method tambahan
// export const GET = withApiHandler({ GET: getUsers }, {
//   validatePagination: true
// })

// export const POST = withApiHandler({ POST: createUser }, {
//   allowedMethods: ['POST'],
//   requireAuth: true
// })

// export const PUT = withApiHandler({ PUT: updateUser }, {
//   allowedMethods: ['PUT'],
//   requireAuth: true
// })