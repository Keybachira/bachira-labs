import { Link, type PageKey } from "../../router"
import { DashIcon, type DashIconName } from "./icons"

interface Props {
    icon: DashIconName
    title: string
    action?: { label: string; href?: string; to?: PageKey }
}

export function PanelHead({ icon, title, action }: Props) {
    return (
        <div className="panel__head">
            <h2 className="panel__title">
                <DashIcon name={icon} size={14} />
                {title}
            </h2>

            {action?.to && (
                <Link className="panel__link" to={action.to}>
                    {action.label}
                    <DashIcon name="arrow-right" size={11} />
                </Link>
            )}

            {action?.href && (
                <a className="panel__link" href={action.href} target="_blank" rel="noreferrer">
                    {action.label}
                    <DashIcon name="arrow-right" size={11} />
                </a>
            )}
        </div>
    )
}
