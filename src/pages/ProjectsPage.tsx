import { useMemo, useState } from "react"
import { DashIcon } from "../components/dashboard/icons"
import { ProjectCard } from "../components/dashboard/ProjectCard"
import { ProjectDetail } from "../components/dashboard/ProjectDetail"
import { kindLabel } from "../components/dashboard/visual"
import { Dialog } from "../components/ui/Dialog"
import { EmptyState } from "../components/ui/EmptyState"
import { PageHead } from "../components/ui/PageHead"
import { PROJECTS } from "../data/projects"
import { navigate } from "../router"

export function ProjectsPage({ projectId }: { projectId?: string }) {
    const [query, setQuery] = useState("")
    const [kind, setKind] = useState("todos")

    const kinds = useMemo(() => Array.from(new Set(PROJECTS.map((project) => project.kind))), [])
    const selected = projectId ? PROJECTS.find((project) => project.id === projectId) : undefined

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase()
        return PROJECTS.filter((project) => {
            const matchesKind = kind === "todos" || project.kind === kind
            if (!matchesKind) return false
            if (!term) return true
            return [project.title, project.description, project.technologies, project.kind]
                .join(" ")
                .toLowerCase()
                .includes(term)
        })
    }, [query, kind])

    const close = () => navigate("projetos", undefined, true)

    return (
        <div className="page">
            <PageHead
                eyebrow="biblioteca"
                title="Projetos"
                description="Tudo o que estou a construir, do utilitário de mapas ao jogo em Canvas. Abre um cartão para ver detalhes, stack e links."
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
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onOpen={(item) => navigate("projetos", item.id)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="search"
                    title="Nenhum projeto encontrado"
                    hint="Tenta outra palavra ou remove o filtro."
                />
            )}

            <Dialog open={Boolean(projectId)} title={selected?.title ?? "Projeto"} onClose={close}>
                {selected ? (
                    <ProjectDetail project={selected} />
                ) : (
                    <EmptyState
                        icon="folder"
                        title="Projeto não encontrado"
                        hint="O link pode estar desactualizado."
                    />
                )}
            </Dialog>
        </div>
    )
}
