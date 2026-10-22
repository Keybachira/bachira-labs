import type { ProjectRecord } from "../../types"
import { isHttpLink } from "../../utils/links"
import type { DashIconName } from "./icons"

const KIND_LABELS: Record<string, string> = {
    app: "App",
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
    if (kind.includes("cli")) return "terminal"
    if (kind.includes("app")) return "phone"
    if (kind.includes("desktop")) return "grid"
    if (kind.includes("dashboard")) return "chart"
    if (kind.includes("game")) return "gamepad"
    if (kind.includes("web")) return "layers"
    return "folder"
}

export function iconForRepo(name: string): DashIconName {
    const value = name.toLowerCase()
    if (/(geo|map|pin)/.test(value)) return "pin"
    if (/(sandbox|cli|shell|term|element)/.test(value)) return "terminal"
    if (/(grid|vault|dashboard|panel|lab)/.test(value)) return "grid"
    if (/(menu|mesa|restaurant|food|kianda|fatur|cardapio)/.test(value)) return "utensils"
    if (/(finance|financ|stats)/.test(value)) return "chart"
    if (/(chat|vyra|studio)/.test(value)) return "phone"
    return "repo"
}

export type ProjectStatus = "demo" | null

/** Só há selo quando existe link de produção verificado. */
export function projectStatus(project: ProjectRecord): ProjectStatus {
    return project.demoUrl && isHttpLink(project.demoUrl) ? "demo" : null
}

export function projectTags(project: ProjectRecord, max = 3): string[] {
    return project.technologies.map((tag) => tag.trim()).filter(Boolean).slice(0, max)
}
