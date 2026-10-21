import type { ReactNode } from "react"

interface Props {
    eyebrow: string
    title: string
    description: string
    aside?: ReactNode
}

export function PageHead({ eyebrow, title, description, aside }: Props) {
    return (
        <header className="page-head">
            <div className="page-head__text">
                <p className="page-head__eyebrow">
                    <span className="chev" aria-hidden="true">
                        &gt;
                    </span>{" "}
                    {eyebrow}
                </p>
                <h1 className="page-head__title">{title}</h1>
                <p className="page-head__desc">{description}</p>
            </div>
            {aside && <div className="page-head__aside">{aside}</div>}
        </header>
    )
}
