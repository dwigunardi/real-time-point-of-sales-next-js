import { headers } from 'next/headers'

export async function serverFetchJSON<T>(path: string, search?: Record<string, string>) {
    const h = await headers()
    const qs = search ? `?${new URLSearchParams(search).toString()}` : ''
    const cookie = h.get('cookie') ?? '' // ambil Cookie saja

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}${path}${qs}`, {
        headers: { Cookie: cookie }, // atau { authorization: token }
        cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Server fetch failed: ${res.status}`)
    return res.json() as Promise<T>
}


export async function serverFetchBlob(path: string) {
    const h = await headers() // async di Next 15
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}${path}`, {
        headers: h,
        cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Server fetch failed: ${res.status}`)
    return res.blob()
}