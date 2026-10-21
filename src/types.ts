export interface FileItem {
    name: string
    url: string
    size: string
    os: string
    checksum: string
}

export interface ProjectRecord {
    id: string
    title: string
    description: string
    kind: string
    technologies: string
    version: string
    installCommand: string
    requirements: string
    demoUrl: string
    projectSlug: string
    files: FileItem[]
}

export interface TerminalEntry {
    id: string
    type: "command" | "output" | "error"
    text: string
    promptSnapshot: string
}

export interface HistoryItem {
    command: string
    promptSnapshot: string
}

export type SectionKey =
    | "inicio"
    | "projetos"
    | "terminal"
    | "about"
    | "skills"
    | "docs"
    | "downloads"
    | "contact"

export interface SiteConfig {
    userName: string
    welcomeText: string
    brandName: string
    tagline: string
    location: string
}

export interface PaletteItem {
    type: "section" | "command" | "project"
    label: string
    action: () => void
}
