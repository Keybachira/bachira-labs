export function isHttpLink(value: string | undefined): boolean {
    if (!value) return false
    try {
        const parsed = new URL(value.trim())
        return parsed.protocol === "http:" || parsed.protocol === "https:"
    } catch {
        return false
    }
}
