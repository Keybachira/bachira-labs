import { useMemo } from "react"
import type { GitHubActivityDay } from "../../services/github"
import { buildHeatmap, HEATMAP_WEEKDAY_LABELS } from "../../utils/heatmap"
import { Skeleton } from "../ui/Skeleton"
import { PanelHead } from "./PanelHead"

const CELL_SIZE = 12
const CELL_GAP = 3
const COLUMN = CELL_SIZE + CELL_GAP

interface Props {
    activity: GitHubActivityDay[]
    loading?: boolean
    title?: string
}

export function ActivityPanel({ activity, loading = false, title = "Atividade no GitHub" }: Props) {
    const heatmap = useMemo(() => buildHeatmap(activity), [activity])

    return (
        <section className="panel">
            <PanelHead icon="github" title={title} />

            {loading ? (
                <Skeleton width="100%" height={110} />
            ) : (
                <div className="heatmap">
                    <div className="heatmap__days" aria-hidden="true">
                        {HEATMAP_WEEKDAY_LABELS.map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </div>

                    <div className="heatmap__track">
                        <div className="heatmap__months" aria-hidden="true">
                            {heatmap.months.map((month) => (
                                <span
                                    key={`${month.label}-${month.week}`}
                                    style={{ left: month.week * COLUMN }}
                                >
                                    {month.label}
                                </span>
                            ))}
                        </div>

                        <div
                            className="heatmap__grid"
                            role="img"
                            aria-label={`${heatmap.total} contribuições no último ano`}
                        >
                            {heatmap.weeks.map((week) => (
                                <div className="heatmap__week" key={week.days[0]?.date}>
                                    {week.days.map((day) => (
                                        <span
                                            key={day.date}
                                            className="heatmap__cell"
                                            data-level={day.future ? "future" : day.level}
                                            title={`${day.count} contribuições em ${day.date}`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
