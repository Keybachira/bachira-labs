import { createContext, useContext, type ReactNode } from "react"
import { useGitHub, type UseGitHubResult } from "../hooks/useGitHub"

const GitHubContext = createContext<UseGitHubResult | null>(null)

/** Uma única chamada a `useGitHub` para toda a aplicação (a cache evita pedidos extra). */
export function GitHubProvider({ children }: { children: ReactNode }) {
    const value = useGitHub()
    return <GitHubContext.Provider value={value}>{children}</GitHubContext.Provider>
}

export function useGitHubContext(): UseGitHubResult {
    const context = useContext(GitHubContext)
    if (!context) throw new Error("useGitHubContext precisa de <GitHubProvider>")
    return context
}
