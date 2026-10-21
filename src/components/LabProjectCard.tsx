import type { ProjectRecord } from "../types"
import { getValidFiles } from "../utils/files"
import { isHttpLink } from "../utils/links"
import { AppThumbnail } from "./AppThumbnail"

interface Props {
    project: ProjectRecord
    onOpen: (id: string) => void
}

export function LabProjectCard({ project, onOpen }: Props) {
    const tags = project.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 3)
    const fileCount = getValidFiles(project).length

    return (
        <button
            type="button"
            className="lab-card"
            data-lab-card="true"
            aria-label={`Projeto ${project.title}`}
            onClick={() => onOpen(project.id)}
        >
            <span className="lab-card__thumb">
                <AppThumbnail slug={project.projectSlug || project.kind} kind={project.kind} />
            </span>
            <span className="lab-card__body">
                <span className="lab-card__head">
                    <strong>{project.title}</strong>
                    <span className="chip">{project.kind.split(" ")[0] || "demo"}</span>
                </span>
                <span className="lab-card__desc">{project.description}</span>
                <span className="lab-card__tags">
                    {tags.map((tag) => (
                        <span key={tag} className="chip">{tag}</span>
                    ))}
                </span>
                <span className="lab-card__meta">
                    <span>v{project.version || "0.1.0"}</span>
                    <span>{fileCount > 0 ? `${fileCount} ficheiro(s)` : "Sem ficheiros"}</span>
                </span>
                <span className="lab-card__foot">
                    <span className="pill">Ver projeto →</span>
                    <span>{isHttpLink(project.demoUrl) ? "Demo URL" : "Local demo"}</span>
                </span>
            </span>
        </button>
    )
}
