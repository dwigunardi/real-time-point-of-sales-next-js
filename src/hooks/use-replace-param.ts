import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type ParamUpdates = {
    q?: string | null
    page?: number | null
    limit?: number | null
}

export function useReplaceParams() {
    const router = useRouter()
    const pathname = usePathname()
    const sp = useSearchParams()

    return (updates: ParamUpdates) => {
        // Snapshot search params saat ini
        const curr = new URLSearchParams(sp.toString())

        // Buat next dari curr lalu terapkan perubahan secara deklaratif
        const next = new URLSearchParams(curr)

        // Set nilai non-null
        Object.entries(updates)
            .filter(([, v]) => v !== null && v !== undefined)
            .forEach(([k, v]) => next.set(k, String(v as string | number)))

        // Hapus key yang diberi null
        Object.entries(updates)
            .filter(([, v]) => v === null)
            .forEach(([k]) => next.delete(k))

        // Hindari navigasi no-op
        const currQS = curr.toString()
        const nextQS = next.toString()
        if (nextQS !== currQS) {
            router.replace(`${pathname}?${nextQS}`)
        }
    }
}