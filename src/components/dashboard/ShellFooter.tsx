import { Link } from "../../router"
import { BrandMark } from "./BrandMark"

interface Props {
    brand: string
}

/** Portfólio publicado, ligado a partir do rodapé. */
const PORTFOLIO_URL = "https://aquiles-bachira.vercel.app";

export function ShellFooter({ brand }: Props) {
    return (
        <footer className="shell-footer">
            <div className="shell-footer__left">
                <BrandMark size="sm" />
                <span className="shell-footer__brand">{brand}</span>
                <span className="shell-footer__sep" aria-hidden="true">
                    |
                </span>
                <span className="shell-footer__tagline">Código • Conhecimento • Liberdade</span>
            </div>

            <div className="shell-footer__right">
                <a
                    className="shell-footer__link"
                    href={PORTFOLIO_URL}
                    target="_blank"
                    rel="noreferrer"
                >
                    Portfólio
                </a>
                <Link className="shell-footer__link" to="contacto">
                    Falar comigo
                </Link>
                <span className="shell-footer__prompt">
                    <span className="chev" aria-hidden="true">
                        &gt;
                    </span>
                    aquiles_bachira@repository:~$
                </span>
            </div>
        </footer>
    )
}
