import type { GitHubRepo } from "../../services/github"
import { EmptyState } from "../ui/EmptyState"
import { SkeletonRows } from "../ui/Skeleton"
import { DashIcon } from "./icons"
import { PanelHead } from "./PanelHead"
import { iconForRepo } from "./visual"

interface Props {
    repos: GitHubRepo[]
    loading?: boolean
}

export function RecentRepos({ repos, loading = false }: Props) {
    return (
        <section className="panel">
            <PanelHead
                icon="repo"
                title="Repositórios recentes"
                action={{ label: "Ver todos", to: "github" }}
            />

            {loading && <SkeletonRows rows={4} />}

            {!loading && repos.length === 0 && (
                <EmptyState icon="repo" title="Sem repositórios" hint="Nada para mostrar por agora." />
            )}

            <div className="repos">
                {repos.slice(0, 4).map((repo) => (
                    <a key={repo.id} className="repo" href={repo.htmlUrl} target="_blank" rel="noreferrer">
                        <span className="repo__icon" aria-hidden="true">
                            <DashIcon name={iconForRepo(repo.name)} size={13} />
                        </span>
                        <span className="repo__text">
                            <span className="repo__name">
                                <span className="repo__name-text">{repo.name}</span>
                                {repo.isPrivate && (
                                    <span
                                        className="tag tag--private"
                                        title="Repositório privado"
                                    >
                                        <DashIcon name="lock" size={9} />
                                        privado
                                    </span>
                                )}
                            </span>
                            <span className="repo__desc">
                                {repo.description ?? repo.language ?? "Sem descrição"}
                            </span>
                        </span>
                        <span className="repo__stars">
                            <DashIcon name="star" size={10} />
                            {repo.stars}
                        </span>
                    </a>
                ))}
            </div>
        </section>
    )
}
