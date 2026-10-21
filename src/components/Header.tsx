import type { SiteConfig } from "../types"

interface Props {
    config: SiteConfig
    onOpenPalette: () => void
}

export function Header({ config, onOpenPalette }: Props) {
    return (
        <header className="header">
            <div className="header__brand">
                <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                        d="M5 2h8c3 0 5 2 5 5 0 2.2-1.4 3.8-3.4 4.3C16.6 12 18 13.6 18 16c0 2.2-1.8 4-4 4H5z"
                        fill="var(--accent)"
                    />
                </svg>
                <span className="header__sep" />
                <strong>{config.brandName}</strong>
            </div>
            <span className="header__tagline">{config.tagline}</span>
            <div className="header__status">
                <span className="dot" />
                <span className="header__loc">local sandbox · {config.location}</span>
                <button type="button" className="btn" onClick={onOpenPalette}>
                    Procurar
                </button>
            </div>
        </header>
    )
}
