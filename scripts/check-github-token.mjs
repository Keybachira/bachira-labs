/**
 * Valida o token fine-grained do GitHub usado pelo dashboard.
 *
 *   node scripts/check-github-token.mjs
 *
 * Lê VITE_GITHUB_USERNAME e VITE_GITHUB_TOKEN do `.env` da raiz e testa os
 * endpoints de que o site depende. NUNCA imprime o token: só mostra-o truncado
 * e nunca o envia a nenhum serviço para além da api.github.com.
 */

import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")

/** Lê o `.env` sem dependências externas. */
function readEnvFile(path) {
    const out = {}
    let text
    try {
        text = readFileSync(path, "utf8")
    } catch {
        return out
    }
    for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith("#")) continue
        const eq = trimmed.indexOf("=")
        if (eq === -1) continue
        const key = trimmed.slice(0, eq).trim()
        let value = trimmed.slice(eq + 1).trim()
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1)
        }
        out[key] = value
    }
    return out
}

const env = { ...readEnvFile(resolve(root, ".env")), ...process.env }
const token = env.VITE_GITHUB_TOKEN?.trim()
const username = env.VITE_GITHUB_USERNAME?.trim() || "Keybachira"

if (!token) {
    console.error("✖ VITE_GITHUB_TOKEN não encontrado no .env (ou vazio).")
    console.error("  Vê .env.example para as permissões exactas a seleccionar no GitHub.")
    process.exit(1)
}

const masked = `${token.slice(0, 11)}…${token.slice(-4)}`
console.log(`Token:    ${masked} (${token.length} chars)`)
console.log(`Username: ${username}\n`)

const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
}

const results = []

async function check(name, fn) {
    try {
        const detail = await fn()
        results.push({ name, ok: true, detail })
        console.log(`✔ ${name}${detail ? ` — ${detail}` : ""}`)
    } catch (error) {
        results.push({ name, ok: false, detail: error.message })
        console.log(`✖ ${name} — ${error.message}`)
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message)
}

/* 1. Perfil — valida o token no geral. */
await check("GET /users/{user} (perfil)", async () => {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers,
    })
    assert(res.ok, `HTTP ${res.status} ${res.statusText}`)
    const body = await res.json()
    return `login=${body.login}, followers=${body.followers}, public_repos=${body.public_repos}`
})

/* 2. Commits — valida Repository permissions: Contents. */
await check("GET /repos/{owner}/{repo}/commits (Contents)", async () => {
    const res = await fetch(
        `https://api.github.com/repos/${encodeURIComponent(username)}/bachira-labs/commits?per_page=3`,
        { headers }
    )
    assert(res.ok, `HTTP ${res.status} ${res.statusText}`)
    const body = await res.json()
    assert(Array.isArray(body), "resposta inesperada")
    return `${body.length} commits`
})

/* 3. Linguagens — valida Repository permissions: Contents. */
await check("GET /repos/{owner}/{repo}/languages (Contents)", async () => {
    const res = await fetch(
        `https://api.github.com/repos/${encodeURIComponent(username)}/bachira-labs/languages`,
        { headers }
    )
    assert(res.ok, `HTTP ${res.status} ${res.statusText}`)
    const body = await res.json()
    const keys = Object.keys(body)
    return keys.length ? `linguagens: ${keys.join(", ")}` : "sem linguagens"
})

/* 4. search/commits — fallback do heatmap sem token e as contagens do dashboard. */
await check("GET /search/commits (fallback do heatmap)", async () => {
    const res = await fetch(
        `https://api.github.com/search/commits?q=author:${encodeURIComponent(username)}&per_page=1`,
        { headers }
    )
    assert(res.ok, `HTTP ${res.status} ${res.statusText}`)
    const body = await res.json()
    return `total_count=${body.total_count}`
})

/* 4b. Repositórios privados — valida Repository access: All repositories
 * (ou os repositórios privados escolhidos). Este é o ponto que costuma falhar:
 * o endpoint público /users/{user}/repos nunca devolve repos privados. */
await check("GET /user/repos?visibility=all (repos privados)", async () => {
    const res = await fetch(
        "https://api.github.com/user/repos?visibility=all&per_page=100&sort=pushed",
        { headers }
    )
    assert(res.ok, `HTTP ${res.status} ${res.statusText}`)
    const body = await res.json()
    assert(Array.isArray(body), "resposta inesperada")
    const privates = body.filter((r) => r.private)
    const publics = body.length - privates.length
    if (privates.length === 0) {
        console.log(
            "  ⚠ nenhum repositório privado visível — o token não tem acesso a " +
                "repositórios privados. Para os ver: Repository access = " +
                "'All repositories' (read-only) ou lista explícita."
        )
    }
    return `${body.length} repositórios (${publics} públicos, ${privates.length} privados)`
})

/* 5. GraphQL contributionsCollection — valida Account permissions: Profile. */
await check("POST /graphql (contributionsCollection — heatmap)", async () => {
    const to = new Date()
    const from = new Date(Date.UTC(to.getUTCFullYear() - 1, to.getUTCMonth(), to.getUTCDate()))
    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `query($login: String!, $from: DateTime!, $to: DateTime!) {
              user(login: $login) {
                contributionsCollection(from: $from, to: $to) {
                  totalCommitContributions
                  totalPullRequestContributions
                  contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
                }
              }
            }`,
            variables: { login: username, from: from.toISOString(), to: to.toISOString() },
        }),
    })
    assert(res.ok, `HTTP ${res.status} ${res.statusText}`)
    const body = await res.json()
    assert(!body.errors, `GraphQL: ${JSON.stringify(body.errors)}`)
    const collection = body?.data?.user?.contributionsCollection
    assert(collection, "contributionsCollection devolveu null — falta a permissão Profile?")
    const days = collection.contributionCalendar.weeks.flatMap((w) => w.contributionDays)
    const active = days.filter((d) => d.contributionCount > 0).length
    return `total=${collection.contributionCalendar.totalContributions}, commits=${collection.totalCommitContributions}, prs=${collection.totalPullRequestContributions}, ${active}/${days.length} dias com actividade`
})

/* 6. Rate limit — o objectivo do token. */
await check("GET /rate_limit (quota)", async () => {
    const res = await fetch("https://api.github.com/rate_limit", { headers })
    assert(res.ok, `HTTP ${res.status} ${res.statusText}`)
    const body = await res.json()
    const core = body.resources.core
    const search = body.resources.search
    const graphql = body.resources.graphql
    return `core ${core.remaining}/${core.limit} · search ${search.remaining}/${search.limit} · graphql ${graphql.remaining}/${graphql.limit}`
})

/* 7. Privilégio mínimo — a permissão Email addresses NÃO deve estar activa. */
await check("GET /user/emails (deve estar SEM acesso)", async () => {
    const res = await fetch("https://api.github.com/user/emails", { headers })
    if (res.status === 403 || res.status === 404) {
        return "sem acesso (correcto: 'Email addresses' está em No access)"
    }
    assert(res.ok, `HTTP ${res.status} ${res.statusText}`)
    throw new Error(
        "ACESSO INESPERADO: o token consegue listar emails. Revoga o token e recria-o com 'Email addresses: No access'."
    )
})

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} verificações passaram.`)

if (failed.length) {
    console.log("\nVerificações que falharam:")
    for (const f of failed) console.log(`  ✖ ${f.name}: ${f.detail}`)
    process.exit(1)
}
console.log("Token validado. Agora reinicia `npm run dev` para o heatmap aparecer.")
