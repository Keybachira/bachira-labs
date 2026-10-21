interface Props {
    name: string
    brand: string
}

export function Hero({ name, brand }: Props) {
    return (
        <section className="hero" id="sobre">
            <div className="hero__copy">
                <p className="hero__eyebrow">
                    <span className="chev" aria-hidden="true">
                        &gt;
                    </span>{" "}
                    Olá, eu sou
                </p>
                <h1 className="hero__title">{name}</h1>
                <p className="hero__roles">
                    Desenvolvedor <span aria-hidden="true">·</span> Estudante{" "}
                    <span aria-hidden="true">·</span> Criador
                </p>
                <p className="hero__text">
                    Aqui encontras os meus projectos, estatísticas do GitHub, linguagens que uso e
                    o meu progresso como desenvolvedor.
                </p>
                <span className="hero__rule" aria-hidden="true" />
            </div>

            <div className="console" aria-hidden="true">
                <span className="console__chev">&gt;</span>
                <div className="console__inner">
                    <span className="brand__mark brand__mark--lg">B<i>/</i></span>
                    <span className="console__brand">{brand}</span>
                </div>
            </div>
        </section>
    )
}
