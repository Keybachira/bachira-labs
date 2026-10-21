import { useMemo } from "react"
import { ActivityPanel } from "../components/dashboard/ActivityPanel"
import { CommitsPanel } from "../components/dashboard/CommitsPanel"
import { DashIcon } from "../components/dashboard/icons"
import { PanelHead } from "../components/dashboard/PanelHead"
import { summarizeLanguages } from "../components/dashboard/LanguagesPanel"
import { iconForRepo } from "../components/dashboard/visual"
import { EmptyState } from "../components/ui/EmptyState"
import { PageHead } from "../components/ui/PageHead"
import { Skeleton, SkeletonRows } from "../components/ui/Skeleton"
import { useGitHubContext } from "../context/GitHubContext"
import type { GitHubLanguageStat } from "../services/github"
import { formatCompact, formatRelativeTime } from "../utils/format"

function LanguageBars({ languages }: { languages: GitHubLanguageStat[] }) {
    const items = summarizeLanguages(languages, 8)

    if (items.length === 0) {
        return <EmptyState icon="chart" title="Sem linguagens" hint="Ainda não há dados suficientes." />
    }

    return (
        <ul className="language-bars">
            {items.map((item) => (
                <li key={item.name}>
                    <div className="language-bars__head">
                        <span className="lang-row__dot" style={{ background: item.color }} aria-hidden="true" />
                        <span className="language-bars__name">{item.name}</span>
                        <span className="language-bars__pct">{item.percent.toFixed(1)}%</span>
                    </div>
                    <div className="language-bars__track">
                        <span style={{ width: `${item.percent}%`, background: item.color }} />
                    </div>
                </li>
            ))}
        </ul>
    )
}

export function GitHubPage() {
    const { data, loading, error, refresh, stale } = useGitHubContext()
    const profile = data?.profile
    const stats = data?.stats
    const repos = data?.repos ?? []

    const languageColors = useMemo(() => {
        const map = new Map<string, string>()
        data?.languages.forEach((item) => map.set(item.name, item.color))
        return map
    }, [data?.languages])

    const statCards = [
        { label: "Repositórios", value: stats?.repositories },
        { label: "Projetos próprios", value: stats?.publicProjects },
        ...(stats && stats.privateProjects > 0
            ? [{ label: "Projetos privados", value: stats.privateProjects }]
            : []),
        { label: "Commits", value: stats?.commits },
        { label: "Pull requests", value: stats?.pullRequests },
        { label: "Estrelas", value: stats?.stars },
        { label: "Linguagens", value: stats?.languages },
    ]

    return (
        <div className="page">
            <PageHead
                eyebrow="dados abertos"
                title="GitHub"
                description="Retrato em tempo real do meu trabalho: repositórios, commits, linguagens e atividade do último ano."
                aside={
                    <button type="button" className="btn" onClick={refresh} disabled={loading}>
                        <DashIcon name="refresh" size={13} />
                        {loading ? "A atualizar…" : "Atualizar"}
                    </button>
                }
            />

            {error && data === null && (
                <EmptyState
                    icon="github"
                    title="Não foi possível carregar o GitHub"
                    hint={error}
                />
            )}

            <section className="panel profile">
                <div className="profile__head">
                    <span className="profile__avatar" aria-hidden="true">
                        {profile?.avatarUrl ? (
                            <img src={profile.avatarUrl} alt="" loading="lazy" />
                        ) : (
                            (profile?.name ?? "A").charAt(0)
                        )}
                    </span>

                    <div className="profile__id">
                        <h2 className="profile__name">
                            {(profile?.name ?? "Aquiles Bachira").replace(/_/g, " ")}
                        </h2>
                        {profile && (
                            <a
                                className="profile__login"
                                href={profile.htmlUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                @{profile.login}
                                <DashIcon name="external" size={11} />
                            </a>
                        )}
                        <p className="profile__bio">
                            {profile?.bio ??
                                "Desenvolvedor em Benguela. Construo produtos web, ferramentas de linha de comandos e interfaces que se percebem à primeira."}
                        </p>
                    </div>

                    {profile && (
                        <a className="btn" href={profile.htmlUrl} target="_blank" rel="noreferrer">
                            Ver perfil
                            <DashIcon name="external" size={12} />
                        </a>
                    )}
                </div>

                <dl className="profile__meta">
                    <div>
                        <dt>Localização</dt>
                        <dd>{profile?.location ?? "Angola/Benguela"}</dd>
                    </div>
                    <div>
                        <dt>Membro desde</dt>
                        <dd>{profile ? new Date(profile.createdAt).getFullYear() : "—"}</dd>
                    </div>
                    <div>
                        <dt>Seguidores</dt>
                        <dd>{profile ? formatCompact(profile.followers) : "—"}</dd>
                    </div>
                    <div>
                        <dt>A seguir</dt>
                        <dd>{profile ? formatCompact(profile.following) : "—"}</dd>
                    </div>
                </dl>
            </section>

            <div className="stats-grid stats-grid--wide">
                {statCards.map((card) => (
                    <div className="stat" key={card.label}>
                        <span className="stat__value">
                            {loading && card.value === undefined
                                ? "…"
                                : card.value === null || card.value === undefined
                                  ? "—"
                                  : formatCompact(card.value)}
                        </span>
                        <span className="stat__label">{card.label}</span>
                    </div>
                ))}
            </div>

            <ActivityPanel
                activity={data?.activity ?? []}
                loading={loading}
                title="Atividade no último ano"
            />

            <div className="grid-2">
                <section className="panel">
                    <PanelHead icon="chart" title="Linguagens por volume" />
                    {loading ? <SkeletonRows rows={6} /> : <LanguageBars languages={data?.languages ?? []} />}
                </section>

                <CommitsPanel commits={data?.commits ?? []} loading={loading} limit={8} />
            </div>

            <section className="panel">
                <PanelHead
                    icon="repo"
                    title="Repositórios"
                    action={profile ? { label: "Abrir GitHub", href: `${profile.htmlUrl}?tab=repositories` } : undefined}
                />

                {loading && <SkeletonRows rows={5} />}

                {!loading && repos.length === 0 && (
                    <EmptyState icon="repo" title="Sem repositórios" hint="Nada público para mostrar." />
                )}

                <div className="repo-list">
                    {repos.map((repo) => (
                        <a
                            key={repo.id}
                            className="repo-row"
                            href={repo.htmlUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="repo-row__icon" aria-hidden="true">
                                <DashIcon name={iconForRepo(repo.name)} size={13} />
                            </span>
                            <span className="repo-row__main">
                                <span className="repo-row__name">
                                    <span className="repo-row__name-text">{repo.name}</span>
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
                                <span className="repo-row__desc">
                                    {repo.description ?? "Sem descrição"}
                                </span>
                            </span>
                            <span className="repo-row__meta">
                                {repo.language && (
                                    <span className="repo-row__lang">
                                        <i
                                            style={{
                                                background:
                                                    languageColors.get(repo.language) ?? "var(--muted-2)",
                                            }}
                                            aria-hidden="true"
                                        />
                                        {repo.language}
                                    </span>
                                )}
                                <span className="repo-row__stars">
                                    <DashIcon name="star" size={10} />
                                    {repo.stars}
                                </span>
                                <span className="repo-row__time">
                                    {formatRelativeTime(repo.pushedAt ?? repo.updatedAt)}
                                </span>
                            </span>
                        </a>
                    ))}
                </div>
            </section>

            <div className="meta-strip">
                {loading && <Skeleton width={190} height={10} />}
                {!loading && data && (
                    <>
                        <span>
                            Actualizado {formatRelativeTime(data.updatedAt)}
                            {stale ? " (cache)" : ""}
                        </span>
                        {data.rateLimit && (
                            <span>
                                API: {data.rateLimit.remaining}/{data.rateLimit.limit} pedidos restantes
                            </span>
                        )}
                        {data.warnings.length > 0 && (
                            <span title={data.warnings.join(" · ")}>
                                {data.warnings.length} aviso{data.warnings.length > 1 ? "s" : ""}
                            </span>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
