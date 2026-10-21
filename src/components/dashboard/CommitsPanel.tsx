import type { GitHubCommit } from "../../services/github"
import { formatRelativeTime, initialOf } from "../../utils/format"
import { EmptyState } from "../ui/EmptyState"
import { SkeletonRows } from "../ui/Skeleton"
import { PanelHead } from "./PanelHead"
import { DashIcon } from "./icons"

interface Props {
    commits: GitHubCommit[]
    loading?: boolean
    limit?: number
}

export function CommitsPanel({ commits, loading = false, limit = 5 }: Props) {
    return (
        <section className="panel">
            <PanelHead
                icon="commit"
                title="Últimos commits"
                action={{ label: "Ver tudo", to: "github" }}
            />

            {loading && <SkeletonRows rows={4} />}

            {!loading && commits.length === 0 && (
                <EmptyState icon="commit" title="Sem commits" hint="Os commits aparecem aqui quando o GitHub responder." />
            )}

            <div className="commits">
                {commits.slice(0, limit).map((commit) => (
                    <a
                        key={`${commit.repo}-${commit.sha}`}
                        className="commit"
                        href={commit.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span className="commit__avatar" aria-hidden="true">
                            {commit.avatarUrl ? (
                                <img src={commit.avatarUrl} alt="" loading="lazy" />
                            ) : (
                                initialOf(commit.author)
                            )}
                        </span>
                        <span className="commit__body">
                            <span className="commit__msg">
                                <span className="commit__msg-text">{commit.message}</span>
                                {commit.repoIsPrivate && (
                                    <span
                                        className="tag tag--private"
                                        title="Repositório privado"
                                    >
                                        <DashIcon name="lock" size={9} />
                                        privado
                                    </span>
                                )}
                            </span>
                            <span className="commit__meta">
                                <span>{formatRelativeTime(commit.date)}</span>
                                <span className="commit__repo">
                                    <i className="commit__dot" aria-hidden="true" />
                                    {commit.repo}
                                </span>
                            </span>
                        </span>
                    </a>
                ))}
            </div>
        </section>
    )
}
