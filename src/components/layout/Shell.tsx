import { useCallback, useEffect, useState, type ReactNode } from "react"
import { useGitHubContext } from "../../context/GitHubContext"
import { findProject } from "../../data/projects"
import { PAGE_META, type Route } from "../../router"
import { MobileNav } from "../dashboard/MobileNav"
import { ShellFooter } from "../dashboard/ShellFooter"
import { SideNav } from "../dashboard/SideNav"
import { TopBar } from "../dashboard/TopBar"
import { DashIcon } from "../dashboard/icons"

type Theme = "dark" | "light"

const BRAND = "Aquiles_Bachira Repository"
const THEME_KEY = "bachira:theme"

function readTheme(): Theme {
    try {
        const stored = localStorage.getItem(THEME_KEY)
        if (stored === "light" || stored === "dark") return stored
    } catch {
        /* modo privado */
    }
    return "dark"
}

interface Props {
    route: Route
    children: ReactNode
}

export function Shell({ route, children }: Props) {
    const { data, loading, error, stale, refresh } = useGitHubContext()
    const [menuOpen, setMenuOpen] = useState(false)
    const [theme, setTheme] = useState<Theme>(readTheme)
    const [noticeHidden, setNoticeHidden] = useState(false)

    const status = error ? "offline" : data ? "online" : loading ? "loading" : "offline"
    const user = data?.profile.login ?? "Keybachira"
    const author = data?.profile.name?.replace(/_/g, " ") ?? "Aquiles Bachira"

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        try {
            localStorage.setItem(THEME_KEY, theme)
        } catch {
            /* ignora */
        }
        const meta = document.querySelector('meta[name="theme-color"]')
        meta?.setAttribute("content", theme === "dark" ? "#05090d" : "#f6f7f3")
    }, [theme])

    useEffect(() => {
        setNoticeHidden(false)
    }, [error])

    useEffect(() => {
        setMenuOpen(false)
        document.querySelector(".workspace")?.scrollTo({ top: 0 })
        const project = route.page === "projetos" ? findProject(route.projectId) : undefined
        document.title = project
            ? `${project.title} · ${BRAND}`
            : PAGE_META[route.page].title
    }, [route.page, route.projectId])

    const toggleTheme = useCallback(() => {
        setTheme((current) => (current === "dark" ? "light" : "dark"))
    }, [])

    return (
        <div className="shell">
            <a
                className="skip-link"
                href="#main"
                onClick={(event) => {
                    event.preventDefault()
                    document.querySelector<HTMLElement>(".workspace")?.focus()
                }}
            >
                Saltar para o conteúdo
            </a>

            <TopBar
                brand={BRAND}
                active={route.page}
                status={status}
                theme={theme}
                menuOpen={menuOpen}
                onOpenMenu={() => setMenuOpen((open) => !open)}
                onToggleTheme={toggleTheme}
            />

            <SideNav brand={BRAND} active={route.page} author={author} />

            <main className="workspace" id="main" tabIndex={-1}>
                {error && !noticeHidden && (
                    <div className="notice" role="status">
                        <span>
                            {stale
                                ? "A mostrar dados em cache — não foi possível atualizar."
                                : error}
                        </span>
                        <button
                            type="button"
                            className="notice__retry"
                            onClick={() => {
                                setNoticeHidden(false)
                                refresh()
                            }}
                        >
                            Tentar de novo
                        </button>
                        <button
                            type="button"
                            className="notice__close"
                            onClick={() => setNoticeHidden(true)}
                            aria-label="Fechar aviso"
                        >
                            <DashIcon name="close" size={12} />
                        </button>
                    </div>
                )}

                <span className="sr-only" aria-live="polite">
                    {PAGE_META[route.page].label}
                </span>

                {children}
            </main>

            <ShellFooter brand={BRAND} />

            <MobileNav
                open={menuOpen}
                active={route.page}
                user={user}
                onClose={() => setMenuOpen(false)}
            />
        </div>
    )
}
