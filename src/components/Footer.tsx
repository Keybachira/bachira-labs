import type { SiteConfig } from "../types"

export function Footer({ config, prompt }: { config: SiteConfig; prompt: string }) {
    return (
        <footer className="footer">
            <span className="accent">{prompt}</span>
            <span>{config.brandName} · Angola · sandbox</span>
            <span className="muted">open source / build together</span>
        </footer>
    )
}
