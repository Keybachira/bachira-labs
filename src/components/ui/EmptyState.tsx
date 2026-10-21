import { DashIcon, type DashIconName } from "../dashboard/icons"

interface Props {
    icon?: DashIconName
    title: string
    hint?: string
}

export function EmptyState({ icon = "folder", title, hint }: Props) {
    return (
        <div className="empty">
            <span className="empty__icon" aria-hidden="true">
                <DashIcon name={icon} size={18} />
            </span>
            <p className="empty__title">{title}</p>
            {hint && <p className="empty__hint">{hint}</p>}
        </div>
    )
}
