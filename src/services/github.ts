/**
 * Conexão com o GitHub — cliente da API oficial (REST + GraphQL), sem dependências.
 *
 * Usado pelo dashboard "Aquiles_Bachira Repository": perfil, repositórios, últimos commits,
 * linguagens e mapa de contribuições.
 *
 * Configuração (ficheiro `.env` na raiz, ver `.env.example`):
 *   VITE_GITHUB_USERNAME = Keybachira   (obrigatório)
 *   VITE_GITHUB_TOKEN    = github_pat_...  (opcional, ver nota de segurança)
 *
 * Repositórios privados: o endpoint público `/users/{user}/repos` nunca devolve
 * repos privados. Com token, a listagem passa por `/user/repos?visibility=all`,
 * que devolve os repos a que o token tem acesso (públicos **e** privados).
 * Isso exige que o token tenha autorização explícita para os repos privados
 * (fine-grained: "All repositories" ou os repositórios escolhidos;
 *  clássico: scope `repo`).
 *
 * Nota de segurança: qualquer variável `VITE_*` fica visível no bundle do browser.
 * Usa um token fine-grained *read-only* com o mínimo de permissões:
 *   - Repository access: Public repositories + os repositórios privados que
 *     quiseres mostrar (read-only)
 *   - Repository permissions: Contents: Read-only (Metadata vem activo)
 *   - Account permissions: Profile: Read-only
 * Nada mais — em particular, sem `Email addresses`, `Events` ou `Followers`,
 * que o site não usa e que enlargariam o que um token extraído permite fazer.
 * Se precisares de um token com mais permissões, expõe-no através de um proxy
 * no servidor em vez de o colocares aqui.
 *
 * ATENÇÃO: listar repositórios privados no browser implica que os commits
 * privados ficam visíveis para quem abrir o site. Mantém o token sem
 * permissões de escrita e revoga-o se for exposto.
 *
 * Sem token a API pública permite ~60 pedidos/hora por IP; por isso os
 * resultados são guardados em `localStorage` durante `cacheTtlMs`.
 * O mapa de contribuições usa GraphQL e por isso exige token.
 */

const REST_BASE = "https://api.github.com"
const GRAPHQL_URL = `${REST_BASE}/graphql`
const CACHE_PREFIX = "bachira:github:v2"

/* ------------------------------------------------------------------ *
 * Configuração
 * ------------------------------------------------------------------ */

export interface GitHubConfig {
    /** Utilizador/organização cujo perfil é apresentado. */
    username: string
    /** Token opcional (fine-grained, read-only). */
    token?: string
    /** Inclui repositórios fork nas listagens. */
    includeForks: boolean
    /**
     * Inclui repositórios privados (requer token com acesso a eles).
     * Sem token o GitHub não expõe repos privados — a listagem fica só com os
     * públicos, mesmo que o token em falta fosse suficiente.
     */
    includePrivate: boolean
    /** Nº máximo de repositórios privados analisados para commits/linguagens. */
    privateRepoLimit: number
    /** Nº máximo de repositórios analisados para agregar linguagens. */
    languageRepoLimit: number
    /** Nº máximo de repositórios analisados para os últimos commits. */
    commitRepoLimit: number
    /** Commits lidos por repositório. */
    commitsPerRepo: number
    /** Nº de commits/linguagens devolvidos. */
    limit: number
    /** Tempo de vida da cache em ms. */
    cacheTtlMs: number
    /** Timeout de cada pedido em ms. */
    timeoutMs: number
}

function readEnv(key: string): string | undefined {
    const value = (import.meta.env as Record<string, string | undefined>)[key]
    const trimmed = value?.trim()
    return trimmed ? trimmed : undefined
}

export const githubConfig: GitHubConfig = {
    username: readEnv("VITE_GITHUB_USERNAME") ?? "Keybachira",
    token: readEnv("VITE_GITHUB_TOKEN"),
    includeForks: false,
    includePrivate: readEnv("VITE_GITHUB_INCLUDE_PRIVATE") !== "false",
    privateRepoLimit: 6,
    languageRepoLimit: 8,
    commitRepoLimit: 4,
    commitsPerRepo: 4,
    limit: 8,
    cacheTtlMs: 20 * 60 * 1000,
    timeoutMs: 12_000,
}

export function resolveGitHubConfig(overrides: Partial<GitHubConfig> = {}): GitHubConfig {
    const defined = Object.fromEntries(
        Object.entries(overrides).filter(([, value]) => value !== undefined)
    ) as Partial<GitHubConfig>
    return {
        ...githubConfig,
        ...defined,
        username: (defined.username ?? githubConfig.username).trim(),
    }
}

/* ------------------------------------------------------------------ *
 * Tipos públicos
 * ------------------------------------------------------------------ */

export interface GitHubProfile {
    login: string
    name: string | null
    bio: string | null
    avatarUrl: string
    htmlUrl: string
    location: string | null
    company: string | null
    blog: string | null
    repositories: number
    followers: number
    following: number
    createdAt: string
}

export interface GitHubRepo {
    id: number
    name: string
    fullName: string
    description: string | null
    htmlUrl: string
    homepage: string | null
    language: string | null
    stars: number
    forks: number
    topics: string[]
    sizeKb: number
    isFork: boolean
    isArchived: boolean
    /** `true` quando o repositório é privado (visível só via token). */
    isPrivate: boolean
    updatedAt: string
    pushedAt: string | null
    /** Pessoas a seguir o repositório (distinto de stars). */
    subscribers: number
    openIssues: number
    /** Identificador SPDX da licença, quando existe. */
    license: string | null
    defaultBranch: string
    createdAt: string
    /** `true` quando o repositório tem GitHub Pages publicado. */
    hasPages: boolean
    /** Bytes por linguagem (preenchido por fetchGitHubLanguages). */
    languages: Record<string, number>
}

export interface GitHubReleaseAsset {
    name: string
    sizeBytes: number
    downloadUrl: string
}

export interface GitHubRelease {
    tag: string
    name: string
    htmlUrl: string
    publishedAt: string
    assets: GitHubReleaseAsset[]
}

/** Dados de um projeto individual, usados na página `#/projetos/:id`. */
export interface GitHubProject {
    repo: GitHubRepo
    release: GitHubRelease | null
    commits: GitHubCommit[]
    /** ZIP do branch principal, sempre disponível como alternativa. */
    zipUrl: string
    /** `true` quando os dados vêm da cache por falha da API. */
    stale: boolean
    updatedAt: string
}

export interface GitHubCommit {
    sha: string
    shortSha: string
    message: string
    repo: string
    repoUrl: string
    /** `true` quando o commit vem de um repositório privado. */
    repoIsPrivate: boolean
    author: string
    authorUrl: string | null
    avatarUrl: string | null
    htmlUrl: string
    date: string
}

export interface GitHubLanguageStat {
    name: string
    bytes: number
    percent: number
    color: string
}

export interface GitHubContributionDay {
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
}

export interface GitHubContributionWeek {
    days: GitHubContributionDay[]
}

export interface GitHubContributions {
    total: number
    totalCommits: number
    totalPullRequests: number
    from: string
    to: string
    weeks: GitHubContributionWeek[]
}

export interface GitHubActivityDay {
    /** Data UTC no formato AAAA-MM-DD. */
    date: string
    count: number
}

export interface GitHubStats {
    /** Total de repositórios públicos do perfil. */
    repositories: number
    /** Repositórios próprios (sem forks) publicados. */
    publicProjects: number
    /** Repositórios próprios privados visíveis para o token. */
    privateProjects: number
    commits: number | null
    pullRequests: number | null
    stars: number
    forks: number
    followers: number
    languages: number
    /** Bytes de código contabilizados pela API de linguagens. */
    codeBytes: number
}

export interface GitHubRateLimit {
    limit: number
    remaining: number
    resetAt: string
    resource: string | null
}

export interface GitHubDashboard {
    profile: GitHubProfile
    repos: GitHubRepo[]
    /** Repositórios ordenados por último push (para os cartões de destaque). */
    recentRepos: GitHubRepo[]
    commits: GitHubCommit[]
    languages: GitHubLanguageStat[]
    contributions: GitHubContributions | null
    /** Contribuições por dia (último ano), reais mesmo sem token. */
    activity: GitHubActivityDay[]
    stats: GitHubStats
    rateLimit: GitHubRateLimit | null
    /** Avisos não fatais (ex.: linguagens indisponíveis). */
    warnings: string[]
    /** `true` quando os dados vêm da cache por falha da API. */
    stale: boolean
    updatedAt: string
}

/* ------------------------------------------------------------------ *
 * Erros e utilidades HTTP
 * ------------------------------------------------------------------ */

export class GitHubError extends Error {
    readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = "GitHubError"
        this.status = status
    }
}

/** Quotas por recurso: core, search e graphql têm limites diferentes. */
const rateLimits = new Map<string, GitHubRateLimit>()

/**
 * Quota principal (core) observada no último pedido. A search API tem um limite
 * muito mais baixo (10/min) e não deve ser mostrada como quota geral.
 */
export function getGitHubRateLimit(): GitHubRateLimit | null {
    return rateLimits.get("core") ?? rateLimits.get("graphql") ?? null
}

function captureRateLimit(headers: Headers): void {
    const remaining = headers.get("x-ratelimit-remaining")
    const limit = headers.get("x-ratelimit-limit")
    if (remaining === null || limit === null) return
    const resource = headers.get("x-ratelimit-resource") ?? "core"
    rateLimits.set(resource, {
        limit: Number(limit),
        remaining: Number(remaining),
        resetAt: new Date(Number(headers.get("x-ratelimit-reset") ?? "0") * 1000).toISOString(),
        resource,
    })
}

function buildHeaders(config: GitHubConfig, accept = "application/vnd.github+json"): HeadersInit {
    const headers: Record<string, string> = {
        Accept: accept,
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if (config.token) headers.Authorization = `Bearer ${config.token}`
    return headers
}

async function toGitHubError(response: Response): Promise<GitHubError> {
    let message = response.statusText || `HTTP ${response.status}`
    try {
        const body = (await response.json()) as { message?: string }
        if (body?.message) message = body.message
    } catch {
        /* resposta sem corpo JSON */
    }

    if (response.status === 403 || response.status === 429) {
        const remaining = response.headers.get("x-ratelimit-remaining")
        const reset = response.headers.get("x-ratelimit-reset")
        if (remaining === "0" && reset) {
            const at = new Date(Number(reset) * 1000).toLocaleTimeString("pt-PT", {
                hour: "2-digit",
                minute: "2-digit",
            })
            message = `Limite de pedidos do GitHub atingido. Tenta novamente às ${at}.`
        }
    }

    return new GitHubError(message, response.status)
}

interface RequestOptions {
    signal?: AbortSignal
    accept?: string
}

async function request<T>(path: string, config: GitHubConfig, options: RequestOptions = {}): Promise<T> {
    const controller = new AbortController()
    const timeoutMs = Number.isFinite(config.timeoutMs) && config.timeoutMs > 0 ? config.timeoutMs : 12_000
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const forwardAbort = () => controller.abort()
    options.signal?.addEventListener("abort", forwardAbort, { once: true })

    try {
        const response = await fetch(path.startsWith("http") ? path : `${REST_BASE}${path}`, {
            headers: buildHeaders(config, options.accept),
            signal: controller.signal,
        })
        captureRateLimit(response.headers)
        if (!response.ok) throw await toGitHubError(response)
        return (await response.json()) as T
    } finally {
        clearTimeout(timer)
        options.signal?.removeEventListener("abort", forwardAbort)
    }
}

function errorMessage(error: unknown): string {
    if (error instanceof Error && error.message) return error.message
    return "falha desconhecida"
}

/** Pedido cancelado pelo chamador (desmontagem do componente, por exemplo). */
export function isAbortError(error: unknown): boolean {
    return error instanceof Error && error.name === "AbortError"
}

/* ------------------------------------------------------------------ *
 * Cache (localStorage)
 * ------------------------------------------------------------------ */

interface CacheEntry {
    savedAt: number
    data: GitHubDashboard
}

function cacheKey(config: GitHubConfig): string {
    // A cache é por (utilizador, visibilidade, token): repositórios privados só
    // podem ficar na cache do token que os autorizou.
    const scope = config.includePrivate && config.token ? "private" : "public"
    const tokenId = config.token ? config.token.slice(-8) : "anon"
    return `${CACHE_PREFIX}:${config.username.toLowerCase()}:${config.includeForks ? "all" : "own"}:${scope}:${tokenId}`
}

function storage(): Storage | null {
    try {
        if (typeof localStorage === "undefined") return null
        return localStorage
    } catch {
        return null
    }
}

function readCache(key: string): CacheEntry | null {
    const store = storage()
    if (!store) return null
    try {
        const raw = store.getItem(key)
        if (!raw) return null
        const parsed = JSON.parse(raw) as CacheEntry
        if (!parsed?.data?.profile) return null
        return parsed
    } catch {
        return null
    }
}

function writeCache(key: string, data: GitHubDashboard): void {
    const store = storage()
    if (!store) return
    try {
        store.setItem(key, JSON.stringify({ savedAt: Date.now(), data } satisfies CacheEntry))
    } catch {
        /* quota cheia ou modo privado: segue sem cache */
    }
}

interface ProjectCacheEntry {
    savedAt: number
    data: GitHubProject
}

function projectCacheKey(config: GitHubConfig, repoName: string): string {
    return `${CACHE_PREFIX}:project:${config.username.toLowerCase()}:${repoName.toLowerCase()}`
}

function readProjectCache(key: string): ProjectCacheEntry | null {
    const store = storage()
    if (!store) return null
    try {
        const raw = store.getItem(key)
        if (!raw) return null
        const parsed = JSON.parse(raw) as ProjectCacheEntry
        if (!parsed?.data?.repo) return null
        return parsed
    } catch {
        return null
    }
}

function writeProjectCache(key: string, data: GitHubProject): void {
    const store = storage()
    if (!store) return
    try {
        store.setItem(key, JSON.stringify({ savedAt: Date.now(), data } satisfies ProjectCacheEntry))
    } catch {
        /* quota cheia ou modo privado: segue sem cache */
    }
}

/** Apaga os dados guardados (útil depois de mudar de utilizador ou token). */
export function clearGitHubCache(): void {
    const store = storage()
    if (!store) return
    try {
        const keys: string[] = []
        for (let i = 0; i < store.length; i += 1) {
            const key = store.key(i)
            if (key?.startsWith(CACHE_PREFIX)) keys.push(key)
        }
        keys.forEach((key) => store.removeItem(key))
    } catch {
        /* ignora */
    }
}

/* ------------------------------------------------------------------ *
 * Mapeadores da API
 * ------------------------------------------------------------------ */

interface RawUser {
    login: string
    name: string | null
    bio: string | null
    avatar_url: string
    html_url: string
    location: string | null
    company: string | null
    blog: string | null
    public_repos: number
    followers: number
    following: number
    created_at: string
}

interface RawRepo {
    id: number
    name: string
    full_name: string
    description: string | null
    html_url: string
    homepage: string | null
    language: string | null
    stargazers_count: number
    forks_count: number
    topics?: string[]
    size: number
    fork: boolean
    archived: boolean
    private: boolean
    updated_at: string
    pushed_at: string | null
    subscribers_count?: number
    open_issues_count?: number
    license?: { spdx_id?: string | null; name?: string | null } | null
    default_branch?: string
    created_at?: string
    has_pages?: boolean
}

interface RawCommit {
    sha: string
    html_url: string
    commit: {
        message: string
        author: { name?: string; date?: string } | null
    }
    author: { login: string; html_url: string; avatar_url: string } | null
}

interface RawRelease {
    tag_name: string
    name: string | null
    html_url: string
    published_at: string | null
    created_at: string
    assets?: { name: string; size: number; browser_download_url: string }[] | null
}

function toProfile(raw: RawUser): GitHubProfile {
    return {
        login: raw.login,
        name: raw.name,
        bio: raw.bio,
        avatarUrl: raw.avatar_url,
        htmlUrl: raw.html_url,
        location: raw.location,
        company: raw.company,
        blog: raw.blog,
        repositories: raw.public_repos,
        followers: raw.followers,
        following: raw.following,
        createdAt: raw.created_at,
    }
}

function toRepo(raw: RawRepo): GitHubRepo {
    return {
        id: raw.id,
        name: raw.name,
        fullName: raw.full_name,
        description: raw.description,
        htmlUrl: raw.html_url,
        homepage: raw.homepage,
        language: raw.language,
        stars: raw.stargazers_count,
        forks: raw.forks_count,
        topics: raw.topics ?? [],
        sizeKb: raw.size,
        isFork: raw.fork,
        isArchived: raw.archived,
        isPrivate: raw.private === true,
        updatedAt: raw.updated_at,
        pushedAt: raw.pushed_at,
        subscribers: raw.subscribers_count ?? 0,
        openIssues: raw.open_issues_count ?? 0,
        license:
            raw.license && raw.license.spdx_id && raw.license.spdx_id !== "NOASSERTION"
                ? raw.license.spdx_id
                : (raw.license?.name ?? null),
        defaultBranch: raw.default_branch ?? "main",
        createdAt: raw.created_at ?? raw.updated_at,
        hasPages: raw.has_pages === true,
        languages: {},
    }
}

function toCommit(raw: RawCommit, repo: GitHubRepo, fallbackAuthor = "—"): GitHubCommit {
    return {
        sha: raw.sha,
        shortSha: raw.sha.slice(0, 7),
        message: raw.commit.message.split("\n")[0].trim(),
        repo: repo.name,
        repoUrl: repo.htmlUrl,
        repoIsPrivate: repo.isPrivate,
        author: raw.author?.login ?? raw.commit.author?.name ?? fallbackAuthor,
        authorUrl: raw.author?.html_url ?? null,
        avatarUrl: raw.author?.avatar_url ?? null,
        htmlUrl: raw.html_url,
        date: raw.commit.author?.date ?? new Date(0).toISOString(),
    }
}

function toRelease(raw: RawRelease): GitHubRelease {
    return {
        tag: raw.tag_name,
        name: raw.name ?? raw.tag_name,
        htmlUrl: raw.html_url,
        publishedAt: raw.published_at ?? raw.created_at,
        assets: (raw.assets ?? []).map((asset) => ({
            name: asset.name,
            sizeBytes: asset.size,
            downloadUrl: asset.browser_download_url,
        })),
    }
}

/* ------------------------------------------------------------------ *
 * Pedidos individuais
 * ------------------------------------------------------------------ */

export async function fetchGitHubProfile(
    config: Partial<GitHubConfig> = {},
    signal?: AbortSignal
): Promise<GitHubProfile> {
    const cfg = resolveGitHubConfig(config)
    try {
        const raw = await request<RawUser>(`/users/${encodeURIComponent(cfg.username)}`, cfg, { signal })
        return toProfile(raw)
    } catch (error) {
        if (error instanceof GitHubError && error.status === 404) {
            throw new GitHubError(
                `Utilizador "${cfg.username}" não encontrado no GitHub. Confirma VITE_GITHUB_USERNAME.`,
                404
            )
        }
        throw error
    }
}

/**
 * Repositórios públicos do utilizador (endpoint público, sem token).
 * Mesmo com token, `/users/{u}/repos` nunca devolve repositórios privados.
 */
async function fetchPublicRepos(cfg: GitHubConfig, signal?: AbortSignal): Promise<RawRepo[]> {
    const perPage = 100
    const maxPages = 5
    const collected: RawRepo[] = []

    for (let page = 1; page <= maxPages; page += 1) {
        const batch = await request<RawRepo[]>(
            `/users/${encodeURIComponent(cfg.username)}/repos` +
                `?per_page=${perPage}&page=${page}&type=owner&sort=pushed&direction=desc`,
            cfg,
            { signal }
        )
        collected.push(...batch)
        if (batch.length < perPage) break
    }

    return collected
}

/**
 * Repositórios visíveis para o token autenticado, públicos e privados.
 * Usa `/user/repos` (o utilizador do token) porque é o único endpoint que
 * devolve repositórios privados. Se o token não tiver acesso a um repo
 * privado, esse repo simplesmente não aparece.
 */
async function fetchAccessibleRepos(cfg: GitHubConfig, signal?: AbortSignal): Promise<RawRepo[]> {
    const perPage = 100
    const maxPages = 5
    const collected: RawRepo[] = []

    for (let page = 1; page <= maxPages; page += 1) {
        const batch = await request<RawRepo[]>(
            `/user/repos?per_page=${perPage}&page=${page}` +
                `&affiliation=owner,organization&visibility=all&sort=pushed&direction=desc`,
            cfg,
            { signal }
        )
        collected.push(...batch)
        if (batch.length < perPage) break
    }

    return collected
}

export async function fetchGitHubRepos(
    config: Partial<GitHubConfig> = {},
    signal?: AbortSignal
): Promise<GitHubRepo[]> {
    const cfg = resolveGitHubConfig(config)
    const wantPrivate = cfg.includePrivate && Boolean(cfg.token)

    const publicRepos = await fetchPublicRepos(cfg, signal)

    let collected = publicRepos
    if (wantPrivate) {
        try {
            const accessible = await fetchAccessibleRepos(cfg, signal)
            const known = new Set(publicRepos.map((repo) => repo.id))
            // junta os repos privados (e os públicos que o endpoint do utilizador
            // devolve mas o endpoint público não, por ex. forks privadas)
            const extra = accessible.filter((repo) => !known.has(repo.id))
            collected = [...publicRepos, ...extra]
        } catch {
            // Sem acesso aos repositórios privados: segue só com os públicos.
            collected = publicRepos
        }
    }

    return collected
        .filter((repo) => cfg.includeForks || !repo.fork)
        .filter((repo) => wantPrivate || !repo.private)
        .map(toRepo)
        .sort((a, b) => Date.parse(b.pushedAt ?? b.updatedAt) - Date.parse(a.pushedAt ?? a.updatedAt))
}

export async function fetchGitHubCommits(
    config: Partial<GitHubConfig>,
    repos: GitHubRepo[],
    signal?: AbortSignal
): Promise<GitHubCommit[]> {
    const cfg = resolveGitHubConfig(config)
    const candidates = repos.filter((repo) => !repo.isArchived)

    // Os repositórios privados entram com uma fatia própria para não serem
    // nunca empurrados para fora pelo limite aplicado aos públicos.
    const publicSources = candidates
        .filter((repo) => !repo.isPrivate)
        .slice(0, Math.max(cfg.commitRepoLimit, 0))
    const privateSources = candidates
        .filter((repo) => repo.isPrivate)
        .slice(0, Math.max(cfg.privateRepoLimit, 0))
    const sources = [...publicSources, ...privateSources]

    const results = await Promise.allSettled(
        sources.map((repo) =>
            request<RawCommit[]>(
                `/repos/${repo.fullName}/commits` +
                    `?author=${encodeURIComponent(cfg.username)}&per_page=${cfg.commitsPerRepo}`,
                cfg,
                { signal }
            )
        )
    )

    const commits: GitHubCommit[] = []
    results.forEach((result, index) => {
        if (result.status !== "fulfilled") return
        const repo = sources[index]
        result.value.forEach((raw) => {
            commits.push(toCommit(raw, repo, cfg.username))
        })
    })

    return commits.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, cfg.limit)
}

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Rust: "#dea584",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    Svelte: "#ff3e00",
    Shell: "#89e051",
    Go: "#00ADD8",
    Java: "#b07219",
    Kotlin: "#A97BFF",
    "C#": "#178600",
    "C++": "#f34b7d",
    C: "#555555",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Dart: "#00B4AB",
    Swift: "#F05138",
    Lua: "#000080",
    Astro: "#ff5a03",
    SCSS: "#c6538c",
    MDX: "#fcb32c",
    Dockerfile: "#384d54",
    Outros: "#6e7681",
}

const FALLBACK_COLORS = ["#7c6cf5", "#f06292", "#4dd0a7", "#ffb74d", "#4fc3f7", "#ba68c8", "#aed581"]

export async function fetchGitHubLanguages(
    config: Partial<GitHubConfig>,
    repos: GitHubRepo[],
    signal?: AbortSignal
): Promise<{ stats: GitHubLanguageStat[]; byRepo: Record<string, Record<string, number>> }> {
    const cfg = resolveGitHubConfig(config)
    const candidates = repos.filter((repo) => !repo.isArchived && repo.sizeKb > 0)

    // Fatia própria para os repositórios privados (como nos commits).
    const publicTargets = candidates
        .filter((repo) => !repo.isPrivate)
        .slice(0, Math.max(cfg.languageRepoLimit, 0))
    const privateTargets = candidates
        .filter((repo) => repo.isPrivate)
        .slice(0, Math.max(cfg.privateRepoLimit, 0))
    const targets = [...publicTargets, ...privateTargets]

    const results = await Promise.allSettled(
        targets.map((repo) =>
            request<Record<string, number>>(`/repos/${repo.fullName}/languages`, cfg, { signal })
        )
    )

    const byRepo: Record<string, Record<string, number>> = {}
    const totals = new Map<string, number>()

    results.forEach((result, index) => {
        if (result.status !== "fulfilled") return
        const repo = targets[index]
        byRepo[repo.fullName] = result.value
        Object.entries(result.value).forEach(([language, bytes]) => {
            totals.set(language, (totals.get(language) ?? 0) + bytes)
        })
    })

    const sum = [...totals.values()].reduce((acc, bytes) => acc + bytes, 0)
    const stats: GitHubLanguageStat[] = [...totals.entries()]
        .map(([name, bytes], index) => ({
            name,
            bytes,
            percent: sum > 0 ? Math.round((bytes / sum) * 1000) / 10 : 0,
            color: LANGUAGE_COLORS[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length],
        }))
        .sort((a, b) => b.bytes - a.bytes)

    return { stats, byRepo }
}

/** Agrupa as linguagens menos expressivas numa única fatia "Outros". */
export function groupLanguages(stats: GitHubLanguageStat[], max = 6): GitHubLanguageStat[] {
    if (stats.length <= max) return stats
    const head = stats.slice(0, max)
    const tail = stats.slice(max)
    const bytes = tail.reduce((acc, item) => acc + item.bytes, 0)
    const percent = Math.round(tail.reduce((acc, item) => acc + item.percent, 0) * 10) / 10
    return [...head, { name: "Outros", bytes, percent, color: LANGUAGE_COLORS.Outros }]
}

interface RawSearch {
    total_count: number
}

async function fetchSearchCount(
    path: string,
    config: GitHubConfig,
    signal?: AbortSignal
): Promise<number | null> {
    try {
        const raw = await request<RawSearch>(path, config, { signal })
        return typeof raw.total_count === "number" ? raw.total_count : null
    } catch {
        return null
    }
}

const LEVELS: Record<string, 0 | 1 | 2 | 3 | 4> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
}

/**
 * Contribuições diárias obtidas pela search API (commits por autor).
 * Serve de alternativa ao GraphQL quando não há token: é real, mas conta
 * apenas commits (sem PRs/issues) e até 500 resultados.
 */
export async function fetchGitHubCommitActivity(
    config: Partial<GitHubConfig> = {},
    signal?: AbortSignal
): Promise<GitHubActivityDay[]> {
    const cfg = resolveGitHubConfig(config)
    const perPage = 100
    const maxPages = 5
    const counts = new Map<string, number>()

    for (let page = 1; page <= maxPages; page += 1) {
        const payload = await request<{ items?: { commit?: { author?: { date?: string } | null } }[] }>(
            `/search/commits?q=author:${encodeURIComponent(cfg.username)}` +
                `&sort=committer-date&order=desc&per_page=${perPage}&page=${page}`,
            cfg,
            { signal }
        )
        const items = payload.items ?? []
        items.forEach((item) => {
            const date = item.commit?.author?.date
            if (!date) return
            const day = date.slice(0, 10)
            counts.set(day, (counts.get(day) ?? 0) + 1)
        })
        if (items.length < perPage) break
    }

    return [...counts.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date, count }))
}

interface RawContributions {
    user: {
        contributionsCollection: {
            totalCommitContributions: number
            totalPullRequestContributions: number
            contributionCalendar: {
                totalContributions: number
                weeks: {
                    contributionDays: {
                        date: string
                        contributionCount: number
                        contributionLevel: string
                    }[]
                }[]
            }
        } | null
    } | null
}

const CONTRIBUTIONS_QUERY = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}`

/**
 * Mapa de contribuições do último ano. Requer token: o GitHub só expõe esta
 * informação através de GraphQL autenticado.
 */
export async function fetchGitHubContributions(
    config: Partial<GitHubConfig> = {},
    signal?: AbortSignal
): Promise<GitHubContributions | null> {
    const cfg = resolveGitHubConfig(config)
    if (!cfg.token) return null

    const to = new Date()
    const from = new Date(Date.UTC(to.getUTCFullYear() - 1, to.getUTCMonth(), to.getUTCDate()))

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), cfg.timeoutMs)
    const forwardAbort = () => controller.abort()
    signal?.addEventListener("abort", forwardAbort, { once: true })

    try {
        const response = await fetch(GRAPHQL_URL, {
            method: "POST",
            headers: { ...buildHeaders(cfg), "Content-Type": "application/json" },
            body: JSON.stringify({
                query: CONTRIBUTIONS_QUERY,
                variables: { login: cfg.username, from: from.toISOString(), to: to.toISOString() },
            }),
            signal: controller.signal,
        })
        captureRateLimit(response.headers)
        if (!response.ok) throw await toGitHubError(response)

        const payload = (await response.json()) as { data?: RawContributions; errors?: { message: string }[] }
        if (payload.errors?.length) throw new GitHubError(payload.errors[0].message, response.status)

        const collection = payload.data?.user?.contributionsCollection
        if (!collection) return null

        return {
            total: collection.contributionCalendar.totalContributions,
            totalCommits: collection.totalCommitContributions,
            totalPullRequests: collection.totalPullRequestContributions,
            from: from.toISOString(),
            to: to.toISOString(),
            weeks: collection.contributionCalendar.weeks.map((week) => ({
                days: week.contributionDays.map((day) => ({
                    date: day.date,
                    count: day.contributionCount,
                    level: LEVELS[day.contributionLevel] ?? 0,
                })),
            })),
        }
    } finally {
        clearTimeout(timer)
        signal?.removeEventListener("abort", forwardAbort)
    }
}

/* ------------------------------------------------------------------ *
 * Agregação para o dashboard
 * ------------------------------------------------------------------ */

async function buildDashboard(config: GitHubConfig, signal?: AbortSignal): Promise<GitHubDashboard> {
    if (!config.username) throw new GitHubError("Define VITE_GITHUB_USERNAME no ficheiro .env.", 0)

    const warnings: string[] = []
    const [profile, repos] = await Promise.all([
        fetchGitHubProfile(config, signal),
        fetchGitHubRepos(config, signal),
    ])

    const [languages, commits, commitCount, pullRequestCount, contributions] = await Promise.all([
        fetchGitHubLanguages(config, repos, signal).catch((error: unknown) => {
            warnings.push(`Linguagens indisponíveis (${errorMessage(error)}).`)
            return { stats: [] as GitHubLanguageStat[], byRepo: {} as Record<string, Record<string, number>> }
        }),
        fetchGitHubCommits(config, repos, signal).catch((error: unknown) => {
            warnings.push(`Commits indisponíveis (${errorMessage(error)}).`)
            return [] as GitHubCommit[]
        }),
        fetchSearchCount(`/search/commits?q=author:${encodeURIComponent(config.username)}&per_page=1`, config, signal),
        fetchSearchCount(
            `/search/issues?q=author:${encodeURIComponent(config.username)}+type:pr&per_page=1`,
            config,
            signal
        ),
        fetchGitHubContributions(config, signal).catch((error: unknown) => {
            warnings.push(`Mapa de contribuições indisponível (${errorMessage(error)}).`)
            return null
        }),
    ])

    if (!config.token) {
        warnings.push("Sem VITE_GITHUB_TOKEN: o mapa de contribuições precisa de GraphQL autenticado.")
    }
    if (commitCount === null) warnings.push("Contagem total de commits indisponível (search API).")

    const enrichedRepos = repos.map((repo) => ({
        ...repo,
        languages: languages.byRepo[repo.fullName] ?? {},
    }))

    if (config.includePrivate) {
        if (!config.token) {
            warnings.push(
                "Repositórios privados indisponíveis: define VITE_GITHUB_TOKEN com acesso a eles."
            )
        } else if (!enrichedRepos.some((repo) => repo.isPrivate)) {
            warnings.push(
                "Nenhum repositório privado visível: o token não tem acesso a repositórios privados (revê o repository access do token)."
            )
        }
    }

    if (languages.stats.length === 0 && repos.length > 0) {
        warnings.push("Não foi possível obter as linguagens dos repositórios.")
    }

    let activity: GitHubActivityDay[] = contributions
        ? contributions.weeks.flatMap((week) => week.days.map((day) => ({ date: day.date, count: day.count })))
        : []

    if (!contributions) {
        activity = await fetchGitHubCommitActivity(config, signal).catch((error: unknown) => {
            warnings.push(`Atividade indisponível (${errorMessage(error)}).`)
            return [] as GitHubActivityDay[]
        })
    }

    const stats: GitHubStats = {
        repositories: profile.repositories,
        publicProjects: enrichedRepos.filter((repo) => !repo.isFork && !repo.isPrivate).length,
        privateProjects: enrichedRepos.filter((repo) => !repo.isFork && repo.isPrivate).length,
        commits: commitCount,
        pullRequests: pullRequestCount,
        stars: enrichedRepos.reduce((acc, repo) => acc + repo.stars, 0),
        forks: enrichedRepos.reduce((acc, repo) => acc + repo.forks, 0),
        followers: profile.followers,
        languages: languages.stats.length,
        codeBytes: languages.stats.reduce((acc, item) => acc + item.bytes, 0),
    }

    return {
        profile,
        repos: enrichedRepos,
        recentRepos: enrichedRepos.slice(0, config.limit),
        commits,
        languages: languages.stats,
        contributions,
        activity,
        stats,
        rateLimit: getGitHubRateLimit(),
        warnings,
        stale: false,
        updatedAt: new Date().toISOString(),
    }
}

export interface FetchDashboardOptions {
    /** Ignora a cache e vai buscar dados novos. */
    force?: boolean
    /** Cancela os pedidos em curso. */
    signal?: AbortSignal
}

/**
 * Ponto de entrada do dashboard: devolve perfil, repositórios, commits,
 * linguagens e contribuições numa só chamada, com cache e degradação suave.
 */
export async function fetchGitHubDashboard(
    overrides: Partial<GitHubConfig> = {},
    options: FetchDashboardOptions = {}
): Promise<GitHubDashboard> {
    const config = resolveGitHubConfig(overrides)
    const key = cacheKey(config)
    const cached = readCache(key)

    if (!options.force && cached && Date.now() - cached.savedAt < config.cacheTtlMs) {
        return { ...cached.data, stale: false }
    }

    try {
        const fresh = await buildDashboard(config, options.signal)
        writeCache(key, fresh)
        return fresh
    } catch (caught) {
        if (isAbortError(caught)) throw caught

        const error =
            caught instanceof GitHubError
                ? caught
                : new GitHubError(`Sem ligação ao GitHub (${errorMessage(caught)}).`, 0)

        if (cached) {
            return {
                ...cached.data,
                stale: true,
                warnings: [...cached.data.warnings, `A mostrar cache: ${errorMessage(error)}`],
                updatedAt: cached.data.updatedAt,
            }
        }
        throw error
    }
}

/**
 * Dados de um projeto individual: repositório, última release e commits
 * recentes. Também tem cache (por repositório) e devolve cache marcada como
 * `stale` quando a API falha.
 */
export async function fetchGitHubProject(
    repoName: string,
    overrides: Partial<GitHubConfig> = {},
    options: FetchDashboardOptions = {}
): Promise<GitHubProject> {
    const config = resolveGitHubConfig(overrides)
    const key = projectCacheKey(config, repoName)
    const cached = readProjectCache(key)

    if (!options.force && cached && Date.now() - cached.savedAt < config.cacheTtlMs) {
        return { ...cached.data, stale: false }
    }

    const path = `/repos/${encodeURIComponent(config.username)}/${encodeURIComponent(repoName)}`

    try {
        const [rawRepo, rawCommits, rawRelease, rawLanguages] = await Promise.all([
            request<RawRepo>(path, config, { signal: options.signal }),
            request<RawCommit[]>(`${path}/commits?per_page=5`, config, { signal: options.signal }).catch(
                () => [] as RawCommit[]
            ),
            request<RawRelease>(`${path}/releases/latest`, config, { signal: options.signal }).catch(
                () => null
            ),
            request<Record<string, number>>(`${path}/languages`, config, {
                signal: options.signal,
            }).catch(() => ({}) as Record<string, number>),
        ])

        const repo = { ...toRepo(rawRepo), languages: rawLanguages }
        const data: GitHubProject = {
            repo,
            release: rawRelease ? toRelease(rawRelease) : null,
            commits: rawCommits.map((raw) => toCommit(raw, repo, config.username)),
            zipUrl: `https://github.com/${repo.fullName}/archive/refs/heads/${repo.defaultBranch}.zip`,
            stale: false,
            updatedAt: new Date().toISOString(),
        }

        writeProjectCache(key, data)
        return data
    } catch (caught) {
        if (isAbortError(caught)) throw caught

        const error =
            caught instanceof GitHubError
                ? caught
                : new GitHubError(`Sem ligação ao GitHub (${errorMessage(caught)}).`, 0)

        if (cached) return { ...cached.data, stale: true }
        throw error
    }
}
