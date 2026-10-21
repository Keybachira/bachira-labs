/**
 * Constrói a grelha do mapa de atividade (estilo GitHub), com semanas a
 * começar à segunda-feira como no mockup.
 */

const DAY_MS = 86_400_000
const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

export type HeatmapLevel = 0 | 1 | 2 | 3 | 4

export interface HeatmapDay {
    date: string
    count: number
    level: HeatmapLevel
    future: boolean
}

export interface HeatmapMonth {
    label: string
    week: number
}

export interface HeatmapWeek {
    days: HeatmapDay[]
}

export interface Heatmap {
    weeks: HeatmapWeek[]
    months: HeatmapMonth[]
    total: number
    max: number
}

export const HEATMAP_WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

function pad(value: number): string {
    return value < 10 ? `0${value}` : String(value)
}

function isoDate(date: Date): string {
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

export function toLevel(count: number): HeatmapLevel {
    if (count <= 0) return 0
    if (count <= 2) return 1
    if (count <= 4) return 2
    if (count <= 7) return 3
    return 4
}

export function buildHeatmap(
    activity: { date: string; count: number }[],
    options: { weeks?: number; today?: Date } = {}
): Heatmap {
    const weeks = options.weeks ?? 53
    const today = options.today ?? new Date()
    const counts = new Map(activity.map((item) => [item.date, item.count]))

    const end = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 12))
    const mondayOffset = (end.getUTCDay() + 6) % 7
    const lastMonday = new Date(end.getTime() - mondayOffset * DAY_MS)
    const firstMonday = new Date(lastMonday.getTime() - (weeks - 1) * 7 * DAY_MS)

    const result: HeatmapWeek[] = []
    const months: HeatmapMonth[] = []
    let total = 0
    let max = 0
    let lastMonth = -1
    let lastLabelWeek = -10

    for (let week = 0; week < weeks; week += 1) {
        const days: HeatmapDay[] = []

        for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
            const current = new Date(firstMonday.getTime() + (week * 7 + dayIndex) * DAY_MS)
            const date = isoDate(current)
            const future = current.getTime() > end.getTime()
            const count = future ? 0 : counts.get(date) ?? 0

            if (!future) {
                total += count
                if (count > max) max = count
            }

            days.push({ date, count, level: toLevel(count), future })
        }

        const monday = new Date(firstMonday.getTime() + week * 7 * DAY_MS)
        const month = monday.getUTCMonth()
        if (month !== lastMonth) {
            if (week - lastLabelWeek >= 3) {
                months.push({ label: MONTH_LABELS[month], week })
                lastLabelWeek = week
            }
            lastMonth = month
        }

        result.push({ days })
    }

    return { weeks: result, months, total, max }
}
