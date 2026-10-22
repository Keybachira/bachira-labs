import { useEffect, useRef } from "react"
import { Link, type PageKey } from "../../router"
import { BrandMark } from "./BrandMark"
import { DashIcon, type DashIconName } from "./icons"

interface Props {
    open: boolean
    active: PageKey
    user: string
    onClose: () => void
}

const ITEMS: { page: PageKey; label: string; icon: DashIconName }[] = [
    { page: "inicio", label: "Início", icon: "home" },
    { page: "projetos", label: "Projetos", icon: "folder" },
    { page: "github", label: "GitHub", icon: "github" },
    { page: "sobre", label: "Sobre", icon: "info" },
    { page: "contacto", label: "Contacto", icon: "mail" },
]

export function MobileNav({ open, active, user, onClose }: Props) {
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const previous = document.activeElement as HTMLElement | null
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose()
        }
        document.addEventListener("keydown", onKeyDown)
        panelRef.current?.querySelector<HTMLElement>("a, button")?.focus()
        const { overflow } = document.body.style
        document.body.style.overflow = "hidden"
        return () => {
            document.removeEventListener("keydown", onKeyDown)
            document.body.style.overflow = overflow
            previous?.focus()
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="mobile-nav__backdrop" onClick={onClose} />
            <div className="mobile-nav__panel" ref={panelRef}>
                <div className="mobile-nav__head">
                    <BrandMark />
                    <span className="mobile-nav__title">Aquiles_Bachira Repository</span>
                    <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar menu">
                        <DashIcon name="close" size={16} />
                    </button>
                </div>

                <nav className="mobile-nav__links" aria-label="Navegação móvel">
                    {ITEMS.map((item) => (
                        <Link
                            key={item.page}
                            to={item.page}
                            className={`mobile-nav__link${active === item.page ? " is-active" : ""}`}
                            onClick={onClose}
                            aria-current={active === item.page ? "page" : undefined}
                        >
                            <DashIcon name={item.icon} size={16} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <p className="mobile-nav__meta">
                    <span className="dot" aria-hidden="true" /> @{user} · Angola / Benguela
                </p>
            </div>
        </div>
    )
}
