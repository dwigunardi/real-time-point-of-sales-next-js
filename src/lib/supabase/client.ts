import { environment } from '@/configs/environment'
import { createBrowserClient } from '@supabase/ssr'

// Create a single supabase client for interacting with your database
export function createClient() {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = environment
    return createBrowserClient(
        SUPABASE_URL!,
        SUPABASE_ANON_KEY!
    )
}