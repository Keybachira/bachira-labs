/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Utilizador/organização do GitHub mostrado no dashboard. */
    readonly VITE_GITHUB_USERNAME?: string
    /** Token fine-grained opcional (só leitura). Exposto no bundle. */
    readonly VITE_GITHUB_TOKEN?: string
    /** ID do projeto no Analytics Hub. */
    readonly VITE_ANALYTICS_PROJECT_ID?: string
    /** Chave browser do Analytics Hub (ah_live_). Só no browser, nunca server-side. */
    readonly VITE_ANALYTICS_API_KEY?: string
    /** Endpoint de coleta do Analytics Hub. */
    readonly VITE_ANALYTICS_ENDPOINT?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
