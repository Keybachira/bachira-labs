import type { FileItem, ProjectRecord } from "../types"
import { isHttpLink } from "./links"

/** Normaliza ficheiros vindos de CMS/JSON (aceita chaves em PT e EN). */
export function normalizeFiles(input: unknown): FileItem[] {
    if (!Array.isArray(input)) return []
    return input
        .map((item) => {
            const raw = (item ?? {}) as Record<string, unknown>
            const read = (...keys: string[]) => {
                for (const key of keys) {
                    const value = raw[key]
                    if (value !== undefined && value !== null) {
                        return String(value).trim()
                    }
                }
                return ""
            }
            return {
                name: read("name", "nome"),
                url: read("url", "uRL"),
                size: read("size", "tamanho"),
                os: read("os", "sistema"),
                checksum: read("checksum"),
            }
        })
        .filter((f) => f.name || f.url || f.size || f.os)
}

/** Critério único para "ficheiro publicado": tem URL http(s). */
export function getValidFiles(project: ProjectRecord): FileItem[] {
    return project.files.filter((file) => isHttpLink(file.url))
}
