import type { GitHubStats } from "../../services/github"
import { formatCompact } from "../../utils/format"
import { DashIcon } from "./icons"

interface Props {
    stats: GitHubStats | null
    loading: boolean
}

export function StatsPanel({ stats, loading }: Props) {
    const cells = [
        { value: stats?.repositories, label: "Repositórios" },
        { value: stats?.publicProjects, label: "Projetos públicos" },
        ...(stats && stats.privateProjects > 0
            ? [{ value: stats.privateProjects, label: "Projetos privados" }]
            : []),
        { value: stats?.commits, label: "Commits" },
        { value: stats?.pullRequests, label: "Pull requests" },
    ]

    return (
        <section className="panel" id="github">
            <div className="panel__head">
                <h2 className="panel__title">
                    <DashIcon name="github" size={14} />
                    Estatísticas do GitHub
                </h2>
            </div>
            <div className="stats-grid">
                {cells.map((cell) => (
                    <div className="stat" key={cell.label}>
                        <span className="stat__value">
                            {cell.value === null || cell.value === undefined
                                ? loading
                                    ? "…"
                                    : "—"
                                : formatCompact(cell.value)}
                        </span>
                        <span className="stat__label">{cell.label}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}
