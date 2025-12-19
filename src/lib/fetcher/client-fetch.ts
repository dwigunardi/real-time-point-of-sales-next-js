export async function clientFetchJSON<T>(path: string, search?: Record<string, string>) {
    const qs = search ? `?${new URLSearchParams(search).toString()}` : ''
    const fullUrl = `${path}${qs}`

    try {
        const res = await fetch(fullUrl, { credentials: 'include' })
        // Get raw response text first untuk debugging
        const rawText = await res.text()
        console.log(`Raw response: ${rawText.substring(0, 200)}...`) // Log first 200 chars

        // Parse JSON dari raw text
        let body: any
        try {
            body = rawText ? JSON.parse(rawText) : null
        } catch (parseError) {

            const error = new Error(`Invalid JSON response from server`) as Error & { rawResponse?: string; parseError?: unknown }
            error.name = 'JSONParseError'
            error.rawResponse = rawText  
            error.parseError = parseError
            throw error
        }

        if (!res.ok) {
            // Extract error message dengan fallback yang aman
            let errorMessage = `HTTP ${res.status}: ${res.statusText}`

            if (body) {
                if (typeof body === 'string') {
                    errorMessage = body
                } else if (typeof body === 'object') {
                    if (body.error) {
                        errorMessage = String(body.error)
                    } else if (body.message) {
                        errorMessage = String(body.message)
                    }
                }
            }

            const error = new Error(errorMessage) as Error & { status?: number; cause?: unknown }
            error.name = 'HTTPError in clientFetchJSON'
            error.status = res.status
            error.cause = {
                statusText: res.statusText,
                responseBody: body,
                error_url: fullUrl,
            }
            error.stack = error.stack
            throw error
        }

        return body as T
    } catch (error) {
        // Log error untuk debugging
        console.error('clientFetchJSON error:', error)

        if (error instanceof Error) {
            throw error
        }

        // Fallback error
        const networkError: Error & { name: string; originalError?: unknown } = new Error(`Network error: ${String(error)}`)
        networkError.name = 'NetworkError'
        networkError.originalError = error
        throw networkError
    }
}