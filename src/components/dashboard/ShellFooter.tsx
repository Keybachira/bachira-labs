import { Link } from "../../router"

interface Props {
    brand: string
}

export function ShellFooter({ brand }: Props) {
    return (
        <footer className="shell-footer">
            <div className="shell-footer__left">
                <span className="brand__mark brand__mark--sm" aria-hidden="true">
                    B<i>/</i>
                </span>
                <span className="shell-footer__brand">{brand}</span>
                <span className="shell-footer__sep" aria-hidden="true">
                    |
                </span>
                <span className="shell-footer__tagline">Código • Conhecimento • Liberdade</span>
            </div>

            <div className="shell-footer__right">
                <Link className="shell-footer__link" to="contacto">
                    Falar comigo
                </Link>
                <span className="shell-footer__prompt">
                    <span className="chev" aria-hidden="true">
                        &gt;
                    </span>
                    aquiles@bachira-labs:~$
                </span>
            </div>
        </footer>
    )
}
