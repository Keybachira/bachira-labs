import { useCallback, useEffect, useState } from "react"
import { fetchGitHubProject, isAbortError, type GitHubProject } from "../services/github"

export interface UseProjectResult {
    data: GitHubProject | null
    loading: boolean
    error: string | null
    /** `true` quando os dados vêm da cache porque a API falhou. */
    stale: boolean
    refresh: () => void
}

/**
 * Dados de um projeto individual (repositório, release e commits).
 *
 * ```tsx
 * const { data, loading, error } = useProject("depsandbox")
 * ```
 */
export function useProject(repo: string | undefined): UseProjectResult {
    const [data, setData] = useState<GitHubProject | null>(null)
    const [loading, setLoading] = useState(Boolean(repo))
    const [error, setError] = useState<string | null>(null)
    const [reloadToken, setReloadToken] = useState(0)

    useEffect(() => {
        if (!repo) {
            setLoading(false)
            return
        }

        const controller = new AbortController()
        let active = true
        setData(null)
        setLoading(true)
        setError(null)

        fetchGitHubProject(repo, {}, { force: reloadToken > 0, signal: controller.signal })
            .then((project) => {
                if (!active) return
                setData(project)
                setLoading(false)
            })
            .catch((cause: unknown) => {
                if (!active || isAbortError(cause)) return
                setError(
                    cause instanceof Error && cause.message
                        ? cause.message
                        : `Não foi possível carregar ${repo}.`
                )
                setLoading(false)
            })

        return () => {
            active = false
            controller.abort()
        }
    }, [repo, reloadToken])

    const refresh = useCallback(() => setReloadToken((value) => value + 1), [])

    return { data, loading, error, stale: data?.stale ?? false, refresh }
}
