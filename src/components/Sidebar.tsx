import { NAV_ITEMS } from "../constants"
import type { SectionKey, SiteConfig } from "../types"
import { Icon } from "./Icon"

interface Props {
    config: SiteConfig
    active: SectionKey
    onSelect: (key: SectionKey) => void
}

export function Sidebar({ config, active, onSelect }: Props) {
    return (
        <nav className="sidebar" aria-label="Principal">
            {NAV_ITEMS.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    className={`nav-btn${active === item.key ? " is-active" : ""}`}
                    aria-current={active === item.key ? "page" : undefined}
                    onClick={() => onSelect(item.key)}
                >
                    <Icon type={item.icon} />
                    {item.label}
                </button>
            ))}
            <p className="sidebar__quote">
                “Grandes ideias nascem de mentes que nunca param de explorar.”
                <span>— Aquiles_Bachira</span>
            </p>
            <div className="sidebar__id">
                <div className="muted">Identidade</div>
                <div>{config.brandName}</div>
                <svg viewBox="0 0 180 90" width="100%" height="90" aria-hidden="true" style={{ opacity: 0.5 }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ellipse key={i} cx="90" cy="45" rx={16 + i * 10} ry={8 + i * 5} stroke="#18394E" fill="none" />
                    ))}
                    <line x1="90" y1="5" x2="90" y2="85" stroke="#18394E" />
                </svg>
            </div>
        </nav>
    )
}
