import { useMemo, useState } from "react"
import { DashIcon } from "../components/dashboard/icons"
import { ProjectCard } from "../components/dashboard/ProjectCard"
import { kindLabel } from "../components/dashboard/visual"
import { EmptyState } from "../components/ui/EmptyState"
import { PageHead } from "../components/ui/PageHead"
import { PROJECTS } from "../data/projects"

export function ProjectsPage() {
    const [query, setQuery] = useState("")
    const [kind, setKind] = useState("todos")

    const kinds = useMemo(() => Array.from(new Set(PROJECTS.map((project) => project.kind))), [])

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase()
        return PROJECTS.filter((project) => {
            const matchesKind = kind === "todos" || project.kind === kind
            if (!matchesKind) return false
            if (!term) return true
            return [
                project.title,
                project.description,
                project.tagline,
                project.repo,
                project.technologies.join(" "),
                project.kind,
            ]
                .join(" ")
                .toLowerCase()
                .includes(term)
        })
    }, [query, kind])

    return (
        <div className="page">
            <PageHead
                eyebrow="biblioteca"
                title="Projetos"
                description="Só projetos reais, ligados ao repositório de onde vêm as estrelas, os commits e os downloads. Abre um cartão para ver a página completa."
                aside={<span className="count-pill">{PROJECTS.length} projetos</span>}
            />

            <div className="toolbar">
                <label className="search">
                    <DashIcon name="search" size={14} />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Pesquisar por nome, tecnologia..."
                        aria-label="Pesquisar projetos"
                    />
                    {query && (
                        <button
                            type="button"
                            className="search__clear"
                            onClick={() => setQuery("")}
                            aria-label="Limpar pesquisa"
                        >
                            <DashIcon name="close" size={12} />
                        </button>
                    )}
                </label>

                <div className="chips" role="group" aria-label="Filtrar por tipo">
                    {["todos", ...kinds].map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={`chip${kind === item ? " is-active" : ""}`}
                            aria-pressed={kind === item}
                            onClick={() => setKind(item)}
                        >
                            {kindLabel(item)}
                        </button>
                    ))}
                </div>
            </div>

            <p className="results" aria-live="polite">
                {filtered.length} de {PROJECTS.length} projetos
            </p>

            {filtered.length > 0 ? (
                <div className="projects projects--page">
                    {filtered.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="search"
                    title="Nenhum projeto encontrado"
                    hint="Tenta outra palavra ou remove o filtro."
                />
            )}
        </div>
    )
}
