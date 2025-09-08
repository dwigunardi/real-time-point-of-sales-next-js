import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') ?? ''
    const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit') ?? '10')))
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
    const from = (page - 1) * limit
    const to = from + limit - 1

    const supabase = await createClient()
    let query = supabase.from('profiles').select('*', { count: 'exact' }).limit(limit).order('created_at')

    if (q) query = query.ilike('name', `%${q}%`)

    const { data, count, error } = await query.range(from, to)

    if (error) {
        return new Response(error.message, { status: 500 })
    }

    return NextResponse.json({ data, count, page, limit })
}