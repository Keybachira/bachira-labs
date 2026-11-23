import { Analytics } from "@aquiles_bachira/analytics-hub"

let instance: Analytics | null = null

/** Chave de sessão gerada uma vez por carregamento da página. */
const sessionId = `sess_${crypto.randomUUID()}`

/** Identificador anónimo do visitante (persistido entre recarregamentos). */
function getOrCreateAnonymousId(): string {
    try {
        const key = "ah:anonymous_id"
        let id = localStorage.getItem(key)
        if (!id) {
            id = `anon_${crypto.randomUUID()}`
            localStorage.setItem(key, id)
        }
        return id
    } catch {
        return `anon_${crypto.randomUUID()}`
    }
}

const anonymousId = getOrCreateAnonymousId()

export function initAnalytics(): Analytics | null {
    if (instance) return instance

    const projectId = import.meta.env.VITE_ANALYTICS_PROJECT_ID
    const apiKey = import.meta.env.VITE_ANALYTICS_API_KEY
    const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT

    if (!projectId || !apiKey || !endpoint) {
        console.warn(
            "Analytics Hub: variáveis de ambiente não configuradas (VITE_ANALYTICS_*). " +
            "Verifique o ficheiro .env e reinicie o servidor de desenvolvimento."
        )
        return null
    }

    instance = new Analytics({ projectId, apiKey, endpoint })
    instance.init()
    return instance
}

export function getAnalytics(): Analytics | null {
    return instance
}

export function trackPageView(path: string): void {
    const a = getAnalytics()
    if (!a) return
    a.track("page_view", {
        path,
        sessionId,
        anonymousId,
    })
}

export function trackEvent(
    name: string,
    properties?: Record<string, unknown>
): void {
    const a = getAnalytics()
    if (!a) return
    a.track(name, { ...properties, sessionId, anonymousId })
}

export function flush(): void {
    const a = getAnalytics()
    if (!a) return
    a.flush()
}