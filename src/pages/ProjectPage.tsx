import { useMemo, useState } from "react"
import { DashIcon } from "../components/dashboard/icons"
import { PanelHead } from "../components/dashboard/PanelHead"
import { kindLabel } from "../components/dashboard/visual"
import { Dialog } from "../components/ui/Dialog"
import { EmptyState } from "../components/ui/EmptyState"
import { Skeleton, SkeletonRows } from "../components/ui/Skeleton"
import { DEFAULT_CONFIG } from "../constants"
import { PROJECTS, findProject } from "../data/projects"
import { useProject } from "../hooks/useProject"
import { Link } from "../router"
import { githubConfig, type GitHubProject, type GitHubRelease } from "../services/github"
import {
    formatCompact,
    formatDate,
    formatFileSize,
    formatRelativeTime,
    initialOf,
} from "../utils/format"
import { isHttpLink } from "../utils/links"

/* ------------------------------------------------------------------ *
 * Média
 * ------------------------------------------------------------------ */

/** Aceita URLs http(s) e caminhos locais servidos a partir de `public/`. */
function isImageSource(value: string): boolean {
    return value.startsWith("/") || isHttpLink(value)
}

/** Converte YouTube/Vimeo em URL de embed; devolve `null` se não reconhecer. */
function toVideoEmbed(url: string): string | null {
    try {
        const parsed = new URL(url)
        const host = parsed.hostname.replace(/^www\./, "")
        if (host === "youtu.be") {
            const id = parsed.pathname.slice(1)
            return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
        }
        if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
            const id = parsed.searchParams.get("v") ?? parsed.pathname.split("/").filter(Boolean).pop()
            return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
        }
        if (host === "vimeo.com" || host === "player.vimeo.com") {
            const id = parsed.pathname.split("/").filter(Boolean).pop()
            return id ? `https://player.vimeo.com/video/${id}` : null
        }
    } catch {
        return null
    }
    return null
}

function isVideoFile(url: string): boolean {
    return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)
}

function CopyCommand({ command }: { command: string }) {
    const [copied, setCopied] = useState(false)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(command)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1600)
        } catch {
            setCopied(false)
        }
    }

    return (
        <div className="project-code">
            <pre>
                <code>{command}</code>
            </pre>
            <button type="button" className="project-code__copy" onClick={copy} aria-label="Copiar comando">
                <DashIcon name={copied ? "check" : "copy"} size={12} />
                <span aria-live="polite">{copied ? "Copiado" : "Copiar"}</span>
            </button>
        </div>
    )
}

/* ------------------------------------------------------------------ *
 * Prova social
 * ------------------------------------------------------------------ */

function Proof({
    project,
    release,
    loading,
}: {
    project: GitHubProject | null
    release: GitHubRelease | null
    loading: boolean
}) {
    const repo = project?.repo

    const cell = (
        value: string | null | undefined,
        label: string,
        icon: "star" | "repo" | "user" | "info" | "check" | "layers"
    ) => (
        <div className="proof__cell" key={label}>
            <span className="proof__icon" aria-hidden="true">
                <DashIcon name={icon} size={12} />
            </span>
            <span className="proof__value">{loading ? "…" : (value ?? "—")}</span>
            <span className="proof__label">{label}</span>
        </div>
    )

    const pushed = repo?.pushedAt ?? repo?.updatedAt

    return (
        <section className="proof" aria-label="Prova social do projeto">
            <div className="proof__grid">
                {cell(repo ? formatCompact(repo.stars) : null, "Estrelas", "star")}
                {cell(repo ? formatCompact(repo.forks) : null, "Forks", "repo")}
                {cell(repo ? formatCompact(repo.subscribers) : null, "Observadores", "user")}
                {cell(repo ? formatCompact(repo.openIssues) : null, "Issues abertas", "info")}
                {cell(repo?.license ?? null, "Licença", "check")}
                {cell(release?.tag ?? null, "Última release", "layers")}
            </div>

            <div className="proof__foot">
                {loading ? (
                    <Skeleton width={210} height={10} />
                ) : (
                    <span>
                        {pushed ? `Último push ${formatRelativeTime(pushed)}` : "Sem atividade pública"}
                        {repo ? ` · ${repo.defaultBranch} · ${formatFileSize(repo.sizeKb * 1024)}` : ""}
                    </span>
                )}
                {repo && (
                    <a className="proof__link" href={`${repo.htmlUrl}/stargazers`} target="_blank" rel="noreferrer">
                        Ver no GitHub
                        <DashIcon name="external" size={11} />
                    </a>
                )}
            </div>
        </section>
    )
}

/* ------------------------------------------------------------------ *
 * Página
 * ------------------------------------------------------------------ */

export function ProjectPage({ projectId }: { projectId?: string }) {
    const project = findProject(projectId)
    const { data, loading, error, stale, refresh } = useProject(project?.repo)
    const [imageIndex, setImageIndex] = useState(0)
    const [coverFailed, setCoverFailed] = useState(false)
    const [lightbox, setLightbox] = useState(false)

    const owner = data?.repo.fullName.split("/")[0] ?? githubConfig.username
    const repo = data?.repo
    const release = data?.release ?? null
    const repoUrl = repo?.htmlUrl ?? `https://github.com/${owner}/${project?.repo ?? ""}`

    const images = useMemo(
        () => (project?.media.images ?? []).filter(isImageSource),
        [project]
    )

    const cover = images[0] ?? `https://opengraph.githubassets.com/1/${owner}/${project?.repo ?? ""}`
    const gallery = images.length > 0 ? images : coverFailed ? [] : [cover]
    const selected = gallery[Math.min(imageIndex, gallery.length - 1)]

    const videoUrl = project?.media.videoUrl
    const videoEmbed = videoUrl ? toVideoEmbed(videoUrl) : null
    const videoFile = videoUrl && !videoEmbed && isVideoFile(videoUrl) ? videoUrl : null

    const primaryAsset = release?.assets[0]
    const downloadUrl =
        primaryAsset?.downloadUrl ??
        data?.zipUrl ??
        `https://github.com/${owner}/${project?.repo ?? ""}/archive/refs/heads/main.zip`
    const downloadLabel = primaryAsset ? "Descarregar" : "Descarregar .zip"

    const stack = useMemo(() => {
        const items = [
            ...(project?.technologies ?? []),
            ...(repo?.language ? [repo.language] : []),
            ...Object.keys(repo?.languages ?? {}).sort(
                (a, b) => (repo?.languages[b] ?? 0) - (repo?.languages[a] ?? 0)
            ),
        ]
        return Array.from(new Set(items)).slice(0, 9)
    }, [project, repo])

    if (!project) {
        return (
            <div className="page">
                <EmptyState
                    icon="folder"
                    title="Projeto não encontrado"
                    hint="Este link pode estar desatualizado ou o projeto saiu do catálogo."
                />
                <Link className="btn" to="projetos">
                    <DashIcon name="arrow-left" size={12} />
                    Ver todos os projetos
                </Link>
            </div>
        )
    }

    const index = PROJECTS.findIndex((item) => item.id === project.id)
    const previous = index > 0 ? PROJECTS[index - 1] : undefined
    const next = index >= 0 && index < PROJECTS.length - 1 ? PROJECTS[index + 1] : undefined
    const year = project.year ?? (repo ? new Date(repo.createdAt).getFullYear().toString() : undefined)
    const demoUrl = project.demoUrl && isHttpLink(project.demoUrl) ? project.demoUrl : undefined

    return (
        <div className="page project-page">
            <nav className="project-crumb" aria-label="Caminho">
                <Link to="projetos">Projetos</Link>
                <span aria-hidden="true">/</span>
                <span className="project-crumb__current" aria-current="page">
                    {project.title}
                </span>
            </nav>

            <header className="project-hero">
                <div className="project-hero__copy">
                    <p className="project-hero__eyebrow">
                        <span className="chev" aria-hidden="true">
                            &gt;
                        </span>{" "}
                        {kindLabel(project.kind)}
                        {year ? ` · ${year}` : ""}
                        {stale ? " · cache" : ""}
                    </p>

                    <h1 className="project-hero__title">{project.title}</h1>
                    <p className="project-hero__tagline">{project.tagline}</p>

                    <ul className="project-hero__badges">
                        {repo?.language && <li className="tag">{repo.language}</li>}
                        {release && <li className="tag tag--accent">{release.tag}</li>}
                        {repo?.license && <li className="tag">{repo.license}</li>}
                        {repo?.isArchived && <li className="tag tag--warn">Arquivado</li>}
                        {!repo && <li className="tag">GitHub</li>}
                    </ul>

                    <div className="project-hero__actions">
                        {demoUrl && (
                            <a
                                className="btn btn--primary"
                                href={demoUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Abrir em produção
                                <DashIcon name="external" size={13} />
                            </a>
                        )}
                        <a className="btn" href={downloadUrl} target="_blank" rel="noreferrer">
                            <DashIcon name="download" size={13} />
                            {downloadLabel}
                        </a>
                        <a className="btn" href={repoUrl} target="_blank" rel="noreferrer">
                            <DashIcon name="github" size={13} />
                            Código
                        </a>
                    </div>

                    <p className="project-hero__repo">
                        <DashIcon name="repo" size={12} />
                        {owner}/{project.repo}
                    </p>
                </div>

                <figure className="project-media">
                    <div className="project-media__stage">
                        {videoEmbed ? (
                            <iframe
                                src={videoEmbed}
                                title={`Vídeo de ${project.title}`}
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : videoFile ? (
                            <video src={videoFile} controls playsInline poster={cover} />
                        ) : selected && images.length > 0 ? (
                            <button
                                type="button"
                                className="project-media__zoom"
                                onClick={() => setLightbox(true)}
                                aria-label="Ampliar imagem"
                            >
                                <img
                                    src={selected}
                                    alt={project.media.alt ?? project.title}
                                    loading="lazy"
                                />
                            </button>
                        ) : selected ? (
                            <img
                                className="project-media__cover"
                                src={selected}
                                alt={project.media.alt ?? project.title}
                                loading="lazy"
                                onError={() => setCoverFailed(true)}
                            />
                        ) : (
                            <div className="project-media__fallback" aria-hidden="true">
                                <span className="project-media__mark">
                                    {project.title.charAt(0)}
                                    <i>/</i>
                                </span>
                                <span className="project-media__fallback-name">{project.title}</span>
                                <span className="project-media__fallback-meta">
                                    {kindLabel(project.kind)}
                                    {repo?.language ? ` · ${repo.language}` : ""}
                                </span>
                            </div>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="project-media__thumbs" role="group" aria-label="Imagens do projeto">
                            {images.map((image, position) => (
                                <button
                                    key={image}
                                    type="button"
                                    className={`project-media__thumb${position === imageIndex ? " is-active" : ""}`}
                                    onClick={() => setImageIndex(position)}
                                    aria-label={`Imagem ${position + 1}`}
                                    aria-pressed={position === imageIndex}
                                >
                                    <img src={image} alt="" loading="lazy" />
                                </button>
                            ))}
                        </div>
                    )}

                    <figcaption className="project-media__note">
                        {images.length > 0
                            ? project.media.alt ?? `Capturas de ${project.title}`
                            : "Pré-visualização automática do GitHub"}
                        {release?.publishedAt ? ` · release ${formatDate(release.publishedAt)}` : ""}
                    </figcaption>
                </figure>
            </header>

            <Proof project={data} release={release} loading={loading} />

            {error && (
                <div className="notice" role="status">
                    <span>Não foi possível carregar os dados do GitHub: {error}</span>
                    <button type="button" className="notice__retry" onClick={refresh}>
                        Tentar de novo
                    </button>
                </div>
            )}

            <div className="project-body">
                <div className="project-main">
                    <section className="panel project-section">
                        <PanelHead icon="info" title="Sobre o projeto" />
                        <p className="project-text">{project.longDescription}</p>

                        <ul className="project-features">
                            {project.features.map((feature) => (
                                <li key={feature}>
                                    <DashIcon name="check" size={13} />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="panel project-section">
                        <PanelHead icon="layers" title="Stack" />
                        <ul className="project-stack">
                            {stack.map((item) => (
                                <li className="tag" key={item}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        {project.requirements && (
                            <p className="project-muted">{project.requirements}</p>
                        )}
                    </section>

                    {project.install && (
                        <section className="panel project-section">
                            <PanelHead icon="terminal" title="Correr localmente" />
                            <CopyCommand command={project.install} />
                        </section>
                    )}
                </div>

                <aside className="project-rail">
                    <section className="panel project-section">
                        <PanelHead icon="grid" title="Ficha" />
                        <dl className="project-facts">
                            <div>
                                <dt>Repositório</dt>
                                <dd>
                                    <a href={repoUrl} target="_blank" rel="noreferrer">
                                        {owner}/{project.repo}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt>Branch</dt>
                                <dd>{repo?.defaultBranch ?? "—"}</dd>
                            </div>
                            <div>
                                <dt>Criado</dt>
                                <dd>{repo ? formatDate(repo.createdAt) : loading ? "…" : "—"}</dd>
                            </div>
                            <div>
                                <dt>Atualizado</dt>
                                <dd>
                                    {repo?.pushedAt ? formatRelativeTime(repo.pushedAt) : loading ? "…" : "—"}
                                </dd>
                            </div>
                            <div>
                                <dt>Linguagem</dt>
                                <dd>{repo?.language ?? "—"}</dd>
                            </div>
                            <div>
                                <dt>Tamanho</dt>
                                <dd>{repo ? formatFileSize(repo.sizeKb * 1024) : "—"}</dd>
                            </div>
                            {release && (
                                <div>
                                    <dt>Release</dt>
                                    <dd>
                                        <a href={release.htmlUrl} target="_blank" rel="noreferrer">
                                            {release.tag}
                                        </a>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </section>

                    <section className="panel project-section">
                        <PanelHead icon="download" title="Downloads" />
                        {release && release.assets.length > 0 ? (
                            <ul className="project-assets">
                                {release.assets.map((asset) => (
                                    <li key={asset.name}>
                                        <a href={asset.downloadUrl} target="_blank" rel="noreferrer">
                                            <DashIcon name="download" size={13} />
                                            <span className="project-assets__name">{asset.name}</span>
                                            <span className="project-assets__size">
                                                {formatFileSize(asset.sizeBytes)}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <a href={data?.zipUrl ?? downloadUrl} target="_blank" rel="noreferrer">
                                        <DashIcon name="code" size={13} />
                                        <span className="project-assets__name">Código-fonte (.zip)</span>
                                    </a>
                                </li>
                            </ul>
                        ) : (
                            <>
                                <p className="project-muted">
                                    {loading
                                        ? "A procurar releases…"
                                        : "Sem releases publicadas — o código está disponível em ZIP."}
                                </p>
                                <a className="btn" href={downloadUrl} target="_blank" rel="noreferrer">
                                    <DashIcon name="download" size={13} />
                                    Descarregar .zip
                                </a>
                            </>
                        )}
                    </section>

                    <section className="panel project-section">
                        <PanelHead
                            icon="commit"
                            title="Commits recentes"
                            action={{ label: "Ver no GitHub", href: `${repoUrl}/commits` }}
                        />
                        {loading && <SkeletonRows rows={4} />}
                        {!loading && (data?.commits.length ?? 0) === 0 && (
                            <p className="project-muted">Sem commits públicos.</p>
                        )}
                        <div className="commits">
                            {data?.commits.map((commit) => (
                                <a
                                    key={commit.sha}
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
                                        </span>
                                        <span className="commit__meta">
                                            <span>{formatRelativeTime(commit.date)}</span>
                                            <span className="commit__repo">
                                                <i className="commit__dot" aria-hidden="true" />
                                                {commit.shortSha}
                                            </span>
                                        </span>
                                    </span>
                                </a>
                            ))}
                        </div>
                    </section>
                </aside>
            </div>

            <section className="project-cta">
                <div>
                    <h2 className="project-cta__title">Queres saber mais sobre este projeto?</h2>
                    <p className="project-cta__text">
                        Escreve-me sobre o contexto, a stack ou uma possível colaboração.
                    </p>
                </div>
                <div className="project-cta__actions">
                    <a
                        className="btn btn--primary"
                        href={`mailto:${DEFAULT_CONFIG.email}?subject=${encodeURIComponent(
                            `Sobre o projeto ${project.title}`
                        )}`}
                    >
                        <DashIcon name="mail" size={13} />
                        Falar sobre este projeto
                    </a>
                    <Link className="btn" to="projetos">
                        Ver todos os projetos
                    </Link>
                </div>
            </section>

            <nav className="project-pager" aria-label="Outros projetos">
                {previous ? (
                    <Link className="project-pager__link" to="projetos" projectId={previous.id}>
                        <span className="project-pager__label">
                            <DashIcon name="arrow-left" size={11} />
                            Anterior
                        </span>
                        <span className="project-pager__title">{previous.title}</span>
                    </Link>
                ) : (
                    <span />
                )}
                {next && (
                    <Link
                        className="project-pager__link project-pager__link--next"
                        to="projetos"
                        projectId={next.id}
                    >
                        <span className="project-pager__label">
                            Seguinte
                            <DashIcon name="arrow-right" size={11} />
                        </span>
                        <span className="project-pager__title">{next.title}</span>
                    </Link>
                )}
            </nav>

            <Dialog
                open={lightbox}
                title={project.media.alt ?? project.title}
                onClose={() => setLightbox(false)}
            >
                {selected && (
                    <img className="project-lightbox" src={selected} alt={project.media.alt ?? project.title} />
                )}
            </Dialog>
        </div>
    )
}
