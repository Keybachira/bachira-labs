import { useEffect, useState, type AnchorHTMLAttributes } from "react"

export type PageKey = "inicio" | "projetos" | "github" | "sobre" | "contacto"

export interface Route {
    page: PageKey
    projectId?: string
}

export const PAGE_META: Record<PageKey, { label: string; path: string; title: string }> = {
    inicio: { label: "Início", path: "/", title: "Aquiles_Bachira Repository" },
    projetos: { label: "Projetos", path: "/projetos", title: "Projetos · Aquiles_Bachira Repository" },
    github: { label: "GitHub", path: "/github", title: "GitHub · Aquiles_Bachira Repository" },
    sobre: { label: "Sobre", path: "/sobre", title: "Sobre · Aquiles_Bachira Repository" },
    contacto: { label: "Contacto", path: "/contacto", title: "Contacto · Aquiles_Bachira Repository" },
}

function parseHash(hash: string): Route {
    const segments = hash.replace(/^#/, "").split("/").filter(Boolean)
    switch (segments[0]) {
        case "projetos":
            return { page: "projetos", projectId: segments[1] }
        case "github":
            return { page: "github" }
        case "sobre":
            return { page: "sobre" }
        case "contacto":
            return { page: "contacto" }
        default:
            return { page: "inicio" }
    }
}

export function href(page: PageKey, projectId?: string): string {
    const base = PAGE_META[page].path
    if (!projectId) return `#${base}`
    return `#${base}/${encodeURIComponent(projectId)}`
}

/** Navega para uma rota; `replace` evita criar histórico (usado no fecho de diálogos). */
export function navigate(page: PageKey, projectId?: string, replace = false): void {
    const target = href(page, projectId)
    if (window.location.hash === target) return
    if (replace) {
        window.history.replaceState(null, "", target)
        window.dispatchEvent(new HashChangeEvent("hashchange"))
        return
    }
    window.location.hash = target
}

export function useRoute(): Route {
    const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))

    useEffect(() => {
        const update = () => setRoute(parseHash(window.location.hash))
        window.addEventListener("hashchange", update)
        if (!window.location.hash) window.history.replaceState(null, "", "#/")
        return () => window.removeEventListener("hashchange", update)
    }, [])

    return route
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    to: PageKey
    projectId?: string
}

/** Link interno que mantém o comportamento nativo de âncora (abrir em nova aba, etc.). */
export function Link({ to, projectId, ...rest }: LinkProps) {
    return <a href={href(to, projectId)} {...rest} />
}
