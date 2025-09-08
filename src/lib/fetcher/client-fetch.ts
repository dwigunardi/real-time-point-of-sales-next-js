// lib/fetcher/clientFetch.ts
export async function clientFetchJSON<T>(path: string, search?: Record<string, string>) {
    const qs = search ? `?${new URLSearchParams(search).toString()}` : ''
    const res = await fetch(`${path}${qs}`, { credentials: 'include' })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body?.error || `Client fetch failed: ${res.status}`)
    return body as T
}