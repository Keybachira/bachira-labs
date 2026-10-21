import type { RefObject } from "react"
import type { ProjectRecord } from "../types"
import { Icon } from "./Icon"
import { LabProjectCard } from "./LabProjectCard"

interface Props {
    projects: ProjectRecord[]
    gridRef: RefObject<HTMLDivElement>
    onOpen: (id: string) => void
    onSeeAll: () => void
}

export function ProjectsSection({ projects, gridRef, onOpen, onSeeAll }: Props) {
    return (
        <section aria-labelledby="projects-title">
            <div className="section-head">
                <div>
                    <h2 id="projects-title">
                        <Icon type="folder" color="var(--accent)" /> Projetos em destaque
                    </h2>
                    <div className="muted small">Explora os projetos, experimenta e constrói.</div>
                </div>
                <button type="button" className="btn btn--muted" onClick={onSeeAll}>
                    Ver todos
                </button>
            </div>
            <div ref={gridRef} className="cards">
                {projects.length ? (
                    projects.map((project) => (
                        <LabProjectCard key={project.id} project={project} onOpen={onOpen} />
                    ))
                ) : (
                    <div className="empty">Ainda não há projetos. Adiciona-os em src/data/projects.ts.</div>
                )}
            </div>
        </section>
    )
}
