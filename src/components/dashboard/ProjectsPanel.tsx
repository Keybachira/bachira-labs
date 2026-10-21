import { Link } from "../../router"
import type { ProjectRecord } from "../../types"
import { DashIcon } from "./icons"
import { ProjectCard } from "./ProjectCard"

interface Props {
    projects: ProjectRecord[]
    onOpen: (project: ProjectRecord) => void
    title?: string
    showAllLink?: boolean
}

export function ProjectsPanel({ projects, onOpen, title = "Projetos em destaque", showAllLink = true }: Props) {
    return (
        <section className="section" id="projetos">
            <div className="section__head">
                <span className="section__icon" aria-hidden="true">
                    <DashIcon name="grid" size={14} />
                </span>
                <h2 className="section__title">{title}</h2>
                {showAllLink && (
                    <Link className="section__link" to="projetos">
                        Ver todos
                        <DashIcon name="arrow-right" size={11} />
                    </Link>
                )}
            </div>

            <div className="projects">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} onOpen={onOpen} />
                ))}
            </div>
        </section>
    )
}
