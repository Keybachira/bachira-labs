export interface FileItem {
    name: string
    url: string
    size: string
    os: string
    checksum: string
}

export type ProjectStatus = "online" | "beta" | "wip"

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
    /** Ano de início (opcional, mostrado no detalhe). */
    year?: string
    /** Estado do projeto; o cartão usa a demo/CLI para o rótulo. */
    status?: ProjectStatus
    /** Repositório público, quando existir. */
    repoUrl?: string
    /** Destaques mostrados no diálogo de detalhe. */
    features?: string[]
    /** Descrição longa opcional. */
    longDescription?: string
}

export interface SiteConfig {
    userName: string
    welcomeText: string
    brandName: string
    tagline: string
    location: string
    /** Email usado no formulário de contacto (mailto). */
    email: string
    /** Frase curta de disponibilidade mostrada no contacto. */
    availability: string
}
