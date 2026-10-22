interface Props {
    /** `sm` nas barras laterais e rodapé, `md` no menu mobile, `lg` no hero. */
    size?: "sm" | "md" | "lg"
}

/** O favicon do portfólio publicado — a mesma imagem ligada em `index.html`. */
const FAVICON_URL = "https://aquiles-bachira.vercel.app/favicon.svg"

/** Marca do site: o favicon, em vez do monograma desenhado em texto. */
export function BrandMark({ size = "md" }: Props) {
    const modifier = size === "md" ? "" : ` brand__mark--${size}`
    return (
        <span className={`brand__mark${modifier}`} aria-hidden="true">
            <img src={FAVICON_URL} alt="" />
        </span>
    )
}
