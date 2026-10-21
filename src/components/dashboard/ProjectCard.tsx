import type { ProjectRecord } from "../../types"
import { DashIcon } from "./icons"
import { iconForProject, projectStatus, projectTags } from "./visual"

interface Props {
    project: ProjectRecord
    onOpen: (project: ProjectRecord) => void
}

export function ProjectCard({ project, onOpen }: Props) {
    const status = projectStatus(project)

    return (
        <button
            type="button"
            className="project"
            onClick={() => onOpen(project)}
            aria-label={`Ver detalhes de ${project.title}`}
        >
            <span className="project__top">
                <span className="project__icon" aria-hidden="true">
                    <DashIcon name={iconForProject(project)} size={17} />
                </span>
                <span className="project__text">
                    <span className="project__title">{project.title}</span>
                    <span className="project__desc">{project.description}</span>
                </span>
            </span>

            <span className="project__tags">
                {projectTags(project).map((tag) => (
                    <span className="tag" key={tag}>
                        {tag}
                    </span>
                ))}
            </span>

            <span className="project__foot">
                {status && (
                    <span className="project__status">
                        <span className="dot" aria-hidden="true" />
                        {status === "demo" ? "Demo online" : "Online"}
                    </span>
                )}
                <span className="project__source">
                    Ver detalhes
                    <DashIcon name="arrow-right" size={12} />
                </span>
                <span className="project__version">v{project.version}</span>
            </span>
        </button>
    )
}
