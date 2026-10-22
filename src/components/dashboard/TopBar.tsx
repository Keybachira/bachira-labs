import { Link, type PageKey } from "../../router"
import { DashIcon } from "./icons"

interface Props {
    brand: string
    active: PageKey
    status: "online" | "offline" | "loading"
    theme: "dark" | "light"
    menuOpen: boolean
    onOpenMenu: () => void
    onToggleTheme: () => void
}

const LINKS: { page: PageKey; label: string }[] = [
    { page: "inicio", label: "Início" },
    { page: "projetos", label: "Projetos" },
    { page: "github", label: "GitHub" },
    { page: "sobre", label: "Sobre" },
]

const STATUS_LABEL: Record<Props["status"], string> = {
    online: "Online",
    offline: "Offline",
    loading: "A ligar",
}

export function TopBar({ brand, active, status, theme, menuOpen, onOpenMenu, onToggleTheme }: Props) {
    return (
        <header className="topbar">
            <button
                type="button"
                className="icon-btn topbar__menu"
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menuOpen}
                onClick={onOpenMenu}
            >
                <DashIcon name={menuOpen ? "close" : "menu"} size={18} />
            </button>

            <Link className="brand" to="inicio" aria-label="Aquiles_Bachira Repository — início">

                <span className="brand__name">{brand}</span>
            </Link>

            <nav className="topbar__nav" aria-label="Secções">
                {LINKS.map((link) => (
                    <Link
                        key={link.page}
                        to={link.page}
                        className={`topbar__link${active === link.page ? " is-active" : ""}`}
                        aria-current={active === link.page ? "page" : undefined}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="topbar__meta">
                <span
                    className={`status status--${status}`}
                    aria-label={`Estado: ${STATUS_LABEL[status]}`}
                >
                    <span className="status__dot" aria-hidden="true" />
                    <span className="status__label">{STATUS_LABEL[status]}</span>
                </span>
                <span className="topbar__location">Angola / Benguela</span>
                <button
                    type="button"
                    className="icon-btn"
                    onClick={onToggleTheme}
                    aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
                    title={theme === "dark" ? "Tema claro" : "Tema escuro"}
                >
                    <DashIcon name={theme === "dark" ? "sun" : "moon"} size={15} />
                </button>
            </div>
        </header>
    )
}
