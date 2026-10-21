import { DEFAULT_CONFIG } from "../../constants"
import { useGitHubContext } from "../../context/GitHubContext"
import type { ProjectRecord } from "../../types"
import { getValidFiles } from "../../utils/files"
import { isHttpLink } from "../../utils/links"
import { DashIcon } from "./icons"
import { iconForProject, kindLabel } from "./visual"

export function ProjectDetail({ project }: { project: ProjectRecord }) {
    const { data } = useGitHubContext()
    const repo = data?.repos.find(
        (item) => item.name === project.projectSlug || item.name === project.id
    )
    const repoUrl = project.repoUrl ?? repo?.htmlUrl
    const demoUrl = isHttpLink(project.demoUrl) ? project.demoUrl : undefined
    const files = getValidFiles(project)
    const stack = project.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)

    return (
        <div className="detail">
            <div className="detail__top">
                <span className="project__icon" aria-hidden="true">
                    <DashIcon name={iconForProject(project)} size={18} />
                </span>
                <div className="detail__badges">
                    <span className="tag">{kindLabel(project.kind)}</span>
                    {project.year && <span className="tag">{project.year}</span>}
                    <span className="tag">v{project.version}</span>
                    {project.status === "wip" && <span className="tag tag--warn">Em progresso</span>}
                    {project.status === "beta" && <span className="tag tag--accent">Beta</span>}
                </div>
            </div>

            <p className="detail__text">{project.longDescription ?? project.description}</p>

            {project.features && project.features.length > 0 && (
                <ul className="detail__features">
                    {project.features.map((feature) => (
                        <li key={feature}>
                            <DashIcon name="check" size={13} />
                            {feature}
                        </li>
                    ))}
                </ul>
            )}

            <div className="detail__section">
                <h3 className="detail__label">Stack</h3>
                <div className="detail__tags">
                    {stack.map((item) => (
                        <span className="tag" key={item}>
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="detail__section">
                <h3 className="detail__label">Requisitos</h3>
                <p className="detail__meta">{project.requirements || "Navegador moderno"}</p>
            </div>

            {files.length > 0 && (
                <div className="detail__section">
                    <h3 className="detail__label">Ficheiros</h3>
                    <ul className="detail__files">
                        {files.map((file) => (
                            <li key={file.url}>
                                <a href={file.url} target="_blank" rel="noreferrer">
                                    <DashIcon name="download" size={13} />
                                    <span>{file.name}</span>
                                    <span className="detail__file-meta">
                                        {file.os} · {file.size}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="detail__actions">
                {demoUrl && (
                    <a className="btn btn--primary" href={demoUrl} target="_blank" rel="noreferrer">
                        Abrir demo
                        <DashIcon name="external" size={13} />
                    </a>
                )}
                {repoUrl && (
                    <a className="btn" href={repoUrl} target="_blank" rel="noreferrer">
                        <DashIcon name="github" size={13} />
                        Código fonte
                    </a>
                )}
                {!demoUrl && !repoUrl && (
                    <>
                        <p className="detail__note">Demo e repositório ainda não são públicos.</p>
                        <a
                            className="btn"
                            href={`mailto:${DEFAULT_CONFIG.email}?subject=${encodeURIComponent(
                                `Sobre o projecto ${project.title}`
                            )}`}
                        >
                            <DashIcon name="mail" size={13} />
                            Falar sobre este projecto
                        </a>
                    </>
                )}
            </div>
        </div>
    )
}
