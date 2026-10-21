import type { GitHubLanguageStat } from "../../services/github"
import { EmptyState } from "../ui/EmptyState"
import { SkeletonRows } from "../ui/Skeleton"
import { PanelHead } from "./PanelHead"

const RADIUS = 52
const STROKE = 15
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface Props {
    languages: GitHubLanguageStat[]
    loading?: boolean
}

/** Mantém as fatias legíveis: agrupa a cauda em "Outros". */
export function summarizeLanguages(languages: GitHubLanguageStat[], max: number): GitHubLanguageStat[] {
    if (languages.length <= max) return languages
    const head = languages.slice(0, max - 1)
    const tail = languages.slice(max - 1)
    const bytes = tail.reduce((sum, item) => sum + item.bytes, 0)
    const percent = Math.round(tail.reduce((sum, item) => sum + item.percent, 0) * 10) / 10
    return [...head, { name: "Outros", bytes, percent, color: "#4a5864" }]
}

function Donut({ items }: { items: GitHubLanguageStat[] }) {
    let offset = 0

    return (
        <svg viewBox="0 0 132 132" className="donut__svg" role="img" aria-label="Distribuição de linguagens">
            <circle cx="66" cy="66" r={RADIUS} fill="none" stroke="var(--surface-3)" strokeWidth={STROKE} />
            {items.map((item) => {
                const length = (item.percent / 100) * CIRCUMFERENCE
                const visible = Math.max(length - 2.5, 0)
                const segment = (
                    <circle
                        key={item.name}
                        cx="66"
                        cy="66"
                        r={RADIUS}
                        fill="none"
                        stroke={item.color}
                        strokeWidth={STROKE}
                        strokeDasharray={`${visible} ${CIRCUMFERENCE - visible}`}
                        strokeDashoffset={-offset}
                        transform="rotate(-90 66 66)"
                    />
                )
                offset += length
                return segment
            })}
        </svg>
    )
}

export function LanguagesPanel({ languages, loading = false }: Props) {
    const items = summarizeLanguages(languages, 7)

    return (
        <section className="panel">
            <PanelHead icon="chart" title="Linguagens" action={{ label: "Ver detalhes", to: "github" }} />

            {loading && <SkeletonRows rows={5} />}

            {!loading && items.length === 0 && (
                <EmptyState icon="chart" title="Sem linguagens" hint="Ainda não há dados suficientes." />
            )}

            <div className="languages">
                {!loading && items.length > 0 && (
                    <div className="donut">
                        <Donut items={items} />
                        <div className="donut__center" aria-hidden="true">
                            <span className="donut__label">Total</span>
                            <span className="donut__total">100%</span>
                        </div>
                    </div>
                )}

                <ul className="lang-list">
                    {items.map((item) => (
                        <li className="lang-row" key={item.name}>
                            <span className="lang-row__dot" style={{ background: item.color }} aria-hidden="true" />
                            <span className="lang-row__name">{item.name}</span>
                            <span className="lang-row__pct">{item.percent.toFixed(1)}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
