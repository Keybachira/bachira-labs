import { formatBytes, formatCompact } from "../../utils/format"
import { DashIcon, type DashIconName } from "./icons"
import { PanelHead } from "./PanelHead"

interface Props {
    projects: number
    codeBytes: number
    languages: number
    followers: number
}

export function QuickDetails({ projects, codeBytes, languages, followers }: Props) {
    const cells: { icon: DashIconName; value: string; label: string }[] = [
        { icon: "folder", value: formatCompact(projects), label: "Projetos ativos" },
        { icon: "code", value: formatBytes(codeBytes), label: "Código analisado" },
        { icon: "layers", value: formatCompact(languages), label: "Linguagens principais" },
        { icon: "target", value: formatCompact(followers), label: "Seguidores" },
    ]

    return (
        <section className="panel">
            <PanelHead icon="grid" title="Detalhes rápidos" />
            <div className="quick">
                {cells.map((cell) => (
                    <div className="quick__cell" key={cell.label}>
                        <div className="quick__top">
                            <span className="quick__icon" aria-hidden="true">
                                <DashIcon name={cell.icon} size={13} />
                            </span>
                            <span className="quick__value">{cell.value}</span>
                        </div>
                        <span className="quick__label">{cell.label}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}
