/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Utilizador/organização do GitHub mostrado no dashboard. */
    readonly VITE_GITHUB_USERNAME?: string
    /** Token fine-grained opcional (só leitura). Exposto no bundle. */
    readonly VITE_GITHUB_TOKEN?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
