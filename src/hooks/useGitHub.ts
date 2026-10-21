import { useCallback, useEffect, useState } from "react"
import {
    fetchGitHubDashboard,
    resolveGitHubConfig,
    type GitHubConfig,
    type GitHubDashboard,
} from "../services/github"

export interface UseGitHubOptions extends Partial<GitHubConfig> {
    /** Desliga os pedidos (ex.: durante testes ou sem dados configurados). */
    enabled?: boolean
}

export interface UseGitHubResult {
    data: GitHubDashboard | null
    loading: boolean
    error: string | null
    /** `true` quando os dados vêm da cache porque a API falhou. */
    stale: boolean
    /** Volta a pedir os dados ao GitHub, ignorando a cache. */
    refresh: () => void
}

/**
 * Liga o dashboard ao GitHub com estados de carregamento/erro.
 *
 * ```tsx
 * const { data, loading, error } = useGitHub()
 * ```
 */
export function useGitHub(options: UseGitHubOptions = {}): UseGitHubResult {
    const { enabled = true, username, token, includeForks, cacheTtlMs } = options
    const [data, setData] = useState<GitHubDashboard | null>(null)
    const [loading, setLoading] = useState(enabled)
    const [error, setError] = useState<string | null>(null)
    const [reloadToken, setReloadToken] = useState(0)

    useEffect(() => {
        if (!enabled) {
            setLoading(false)
            return
        }

        const controller = new AbortController()
        let active = true
        setLoading(true)
        setError(null)

        fetchGitHubDashboard(
            { username, token, includeForks, cacheTtlMs },
            { force: reloadToken > 0, signal: controller.signal }
        )
            .then((dashboard) => {
                if (!active) return
                setData(dashboard)
                setLoading(false)
            })
            .catch((cause: unknown) => {
                if (!active) return
                if (cause instanceof Error && cause.name === "AbortError") return
                const config = resolveGitHubConfig({ username, token, includeForks })
                const message =
                    cause instanceof Error && cause.message
                        ? cause.message
                        : `Não foi possível ligar ao GitHub (${config.username}).`
                setError(message)
                setLoading(false)
            })

        return () => {
            active = false
            controller.abort()
        }
    }, [enabled, username, token, includeForks, cacheTtlMs, reloadToken])

    const refresh = useCallback(() => setReloadToken((value) => value + 1), [])

    return { data, loading, error, stale: data?.stale ?? false, refresh }
}
