import { environment } from "@/configs/environment";
import { CookieOptions, createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

type Cookie = {
    name: string
    value: string
    options?: CookieOptions
}

export async function updateSession(request: NextRequest) {
    let supabaseResponse = await NextResponse.next({
        request,
    })

    const { SUPABASE_URL, SUPABASE_ANON_KEY } = environment

    const supabase = createServerClient(
        SUPABASE_URL!,
        SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: Cookie[]) {
                    cookiesToSet.forEach(({ name, value }: Cookie) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }: Cookie) => supabaseResponse.cookies.set(name, value, options))
                }
            }
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && request.nextUrl.pathname !== "/login") {
        const url = request.nextUrl.clone()
        url.pathname = "/login"
        return NextResponse.redirect(url)
        //return NextResponse.redirect(new URL("/login", request.url))
    }

    if (user && request.nextUrl.pathname === "/login") {
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
        //return NextResponse.redirect(new URL("/", request.url))
    }

    return supabaseResponse
}
