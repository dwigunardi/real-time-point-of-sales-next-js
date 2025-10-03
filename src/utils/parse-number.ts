function parsePositiveInt(v: string | null, fallback: number) {
    const n = Number(v)
    return Number.isFinite(n) && n > 0 ? n : fallback
}

export { parsePositiveInt }