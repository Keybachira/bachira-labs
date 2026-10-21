import type { GitHubRepo } from "../../services/github"
import type { ProjectRecord } from "../../types"
import { isHttpLink } from "../../utils/links"
import type { DashIconName } from "./icons"

const KIND_LABELS: Record<string, string> = {
    "map web": "Mapa",
    cli: "CLI",
    desktop: "Desktop",
    web: "Web",
    "web dashboard": "Dashboard",
    game: "Jogo",
    todos: "Todos",
}

export function kindLabel(kind: string): string {
    return KIND_LABELS[kind] ?? kind.charAt(0).toUpperCase() + kind.slice(1)
}

export function iconForProject(project: ProjectRecord): DashIconName {
    const kind = project.kind.toLowerCase()
    if (kind.includes("map")) return "pin"
    if (kind.includes("cli")) return "terminal"
    if (kind.includes("desktop")) return "grid"
    if (kind.includes("game")) return "gamepad"
    if (kind.includes("dashboard")) return "chart"
    if (kind.includes("web")) return "utensils"
    return "folder"
}

export function iconForRepo(name: string): DashIconName {
    const value = name.toLowerCase()
    if (/(geo|map|pin)/.test(value)) return "pin"
    if (/(sandbox|cli|shell|term|element)/.test(value)) return "terminal"
    if (/(grid|vault|dashboard|panel|lab)/.test(value)) return "grid"
    if (/(menu|mesa|restaurant|food|fatur)/.test(value)) return "utensils"
    if (/(finance|financ|stats)/.test(value)) return "chart"
    return "repo"
}

export type ProjectStatus = "demo" | "online" | null

export function projectStatus(project: ProjectRecord): ProjectStatus {
    if (isHttpLink(project.demoUrl)) return "demo"
    if (project.kind.toLowerCase().includes("cli")) return "online"
    return null
}

export function projectTags(project: ProjectRecord, max = 3): string[] {
    return project.technologies
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, max)
}

/** Link do código-fonte: repositório real quando existe, senão o perfil. */
export function projectSourceUrl(
    project: ProjectRecord,
    repos: GitHubRepo[] | undefined,
    username: string
): string {
    const match = repos?.find(
        (repo) => repo.name === project.projectSlug || repo.name === project.id
    )
    return match?.htmlUrl ?? `https://github.com/${username}?tab=repositories`
}

export function profileUrl(username: string, path = ""): string {
    return `https://github.com/${username}${path}`
}
