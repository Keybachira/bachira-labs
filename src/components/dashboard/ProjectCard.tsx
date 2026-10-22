import { useGitHubContext } from "../../context/GitHubContext"
import { Link } from "../../router"
import type { ProjectRecord } from "../../types"
import { formatCompact, formatRelativeTime } from "../../utils/format"
import { DashIcon } from "./icons"
import { iconForProject, projectStatus, projectTags } from "./visual"

interface Props {
    project: ProjectRecord
}

export function ProjectCard({ project }: Props) {
    const { data } = useGitHubContext()
    const repo = data?.repos.find((item) => item.name === project.repo)
    const status = projectStatus(project)

    return (
        <Link
            to="projetos"
            projectId={project.id}
            className="project"
            aria-label={`Ver projeto ${project.title}`}
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
                        Demo online
                    </span>
                )}
                {repo && (
                    <span className="project__stat" title={`${repo.stars} estrelas no GitHub`}>
                        <DashIcon name="star" size={10} />
                        {formatCompact(repo.stars)}
                    </span>
                )}
                {repo?.language && <span className="project__stat">{repo.language}</span>}
                <span className="project__source">
                    Ver projeto
                    <DashIcon name="arrow-right" size={12} />
                </span>
            </span>

            <span className="project__meta">
                {repo?.pushedAt
                    ? `Atualizado ${formatRelativeTime(repo.pushedAt)}`
                    : project.tagline}
            </span>
        </Link>
    )
}
