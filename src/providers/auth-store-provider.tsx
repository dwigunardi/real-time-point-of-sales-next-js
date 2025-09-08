'use client'

import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { Profile } from "@/types/auth"
import { ReactNode, useEffect } from "react"


export const AuthStoreProvider = ({ children, profile }: { children: ReactNode, profile: Profile }) => {
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
            useAuthStore.getState().setUser(user)
            useAuthStore.getState().setProfile(profile)
        })
    }, [profile])

    return (
        <>{children}</>
    )
}