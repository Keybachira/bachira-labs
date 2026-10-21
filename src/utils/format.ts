/** Formatação de números e datas usada no dashboard. */

/** 147 → "147", 12_400 → "12.4k", 1_200_000 → "1.2M". */
export function formatCompact(value: number): string {
    if (!Number.isFinite(value)) return "—"
    if (value < 1000) return String(Math.round(value))
    const units = ["k", "M", "B"]
    let scaled = value
    let unit = -1
    while (scaled >= 1000 && unit < units.length - 1) {
        scaled /= 1000
        unit += 1
    }
    const rounded = scaled >= 100 ? Math.round(scaled) : Math.round(scaled * 10) / 10
    return `${rounded}${units[unit]}`
}

/** 1_500_000 → "1.4 MB". */
export function formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB"
    const mb = bytes / 1_048_576
    return `${mb >= 100 ? Math.round(mb) : Math.round(mb * 10) / 10} MB`
}

/** "2026-10-21T08:00:00Z" → "há 3 horas". */
export function formatRelativeTime(iso: string, now = Date.now()): string {
    const time = Date.parse(iso)
    if (Number.isNaN(time)) return ""
    const diff = Math.max(0, now - time)
    const minute = 60_000
    const hour = 60 * minute
    const day = 24 * hour

    if (diff < minute) return "agora mesmo"
    if (diff < hour) {
        const n = Math.floor(diff / minute)
        return `há ${n} minuto${n > 1 ? "s" : ""}`
    }
    if (diff < day) {
        const n = Math.floor(diff / hour)
        return `há ${n} hora${n > 1 ? "s" : ""}`
    }
    if (diff < 30 * day) {
        const n = Math.floor(diff / day)
        return `há ${n} dia${n > 1 ? "s" : ""}`
    }
    if (diff < 365 * day) {
        const n = Math.floor(diff / (30 * day))
        return `há ${n} ${n > 1 ? "meses" : "mês"}`
    }
    const n = Math.floor(diff / (365 * day))
    return `há ${n} ano${n > 1 ? "s" : ""}`
}

/** Primeira letra maiúscula, usado nos avatares de recurso. */
export function initialOf(value: string): string {
    return value.trim().charAt(0).toUpperCase() || "?"
}
