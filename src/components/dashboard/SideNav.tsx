import { Link, type PageKey } from "../../router"
import { BrandMark } from "./BrandMark"
import { DashIcon, type DashIconName } from "./icons"

interface Props {
    brand: string
    active: PageKey
    author: string
}

const ITEMS: { page: PageKey; label: string; icon: DashIconName }[] = [
    { page: "inicio", label: "Início", icon: "home" },
    { page: "projetos", label: "Projetos", icon: "folder" },
    { page: "github", label: "GitHub", icon: "github" },
    { page: "sobre", label: "Sobre", icon: "info" },
    { page: "contacto", label: "Contacto", icon: "mail" },
]

export function SideNav({ brand, active, author }: Props) {
    return (
        <aside className="sidebar">
            <nav className="sidebar__nav" aria-label="Navegação principal">
                {ITEMS.map((item) => (
                    <Link
                        key={item.page}
                        to={item.page}
                        className={`sidebar__item${active === item.page ? " is-active" : ""}`}
                        aria-current={active === item.page ? "page" : undefined}
                    >
                        <DashIcon name={item.icon} size={15} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <blockquote className="sidebar__quote">
                <p>“Código é a forma mais honesta de expressar ideias.”</p>
                <cite>– {author}</cite>
            </blockquote>

            <div className="sidebar__brand">
                <BrandMark size="sm" />
                <span>{brand}</span>
                <span className="sidebar__version">v1.1.0</span>
            </div>
        </aside>
    )
}
