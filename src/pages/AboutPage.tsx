import { DashIcon } from "../components/dashboard/icons"
import { PanelHead } from "../components/dashboard/PanelHead"
import { PageHead } from "../components/ui/PageHead"
import { DEFAULT_CONFIG } from "../constants"
import { useGitHubContext } from "../context/GitHubContext"
import { Link } from "../router"
import { formatCompact } from "../utils/format"

const FOCUS = [
    {
        icon: "code" as const,
        title: "Produtos web",
        text: "Interfaces React/TypeScript com foco em desempenho, acessibilidade e clareza.",
    },
    {
        icon: "terminal" as const,
        title: "CLI e automação",
        text: "Ferramentas pequenas que resolvem problemas reais — sandboxes, scripts e pipelines.",
    },
    {
        icon: "layers" as const,
        title: "UI/UX",
        text: "Sistemas de design simples, com hierarquia clara e respeito pelo tempo de quem usa.",
    },
]

const STACK = [
    { label: "Frontend", items: ["React", "TypeScript", "Vite", "Tailwind", "CSS"] },
    { label: "Backend e dados", items: ["Node.js", "Supabase", "Firebase", "APIs REST"] },
    { label: "Ferramentas", items: ["Rust", "Git", "Linux", "Figma"] },
]

const PRINCIPLES = [
    "Começar simples e só adicionar complexidade quando compensa.",
    "Medir antes de optimizar — percepção também conta.",
    "Acessibilidade e teclado não são extras.",
    "Código legível é mais valioso do que código esperto.",
]

export function AboutPage() {
    const { data } = useGitHubContext()
    const profile = data?.profile
    const name = (profile?.name ?? "Aquiles Bachira").replace(/_/g, " ")
    const location = profile?.location ?? DEFAULT_CONFIG.location

    return (
        <div className="page">
            <PageHead
                eyebrow="quem escreve"
                title="Sobre"
                description="Desenvolvedor, estudante e criador. Construo software pequeno, útil e bem acabado."
                aside={<span className="count-pill">{location}</span>}
            />

            <div className="about-grid">
                <section className="panel about-bio">
                    <PanelHead icon="user" title={`Olá, sou ${name.split(" ")[0]}`} />
                    <p>
                        Sou desenvolvedor em {location}. Trabalho entre o browser e a linha de
                        comandos: interfaces que se percebem à primeira e ferramentas que poupam
                        tempo a quem as usa.
                    </p>
                    <p>
                        Este site é também um exercício — os números do GitHub que vês aqui são
                        reais, pedidos directamente à API, sem base de dados no meio. Se algo
                        falhar, mostro o que está em cache em vez de inventar dados.
                    </p>
                    <blockquote className="about-quote">
                        “Código é a forma mais honesta de expressar ideias.”
                        <cite>– {name}</cite>
                    </blockquote>
                </section>

                <section className="panel">
                    <PanelHead icon="chart" title="Em resumo" />
                    <dl className="facts">
                        <div>
                            <dt>Repositórios</dt>
                            <dd>{data ? formatCompact(data.stats.repositories) : "—"}</dd>
                        </div>
                        <div>
                            <dt>Commits</dt>
                            <dd>{data?.stats.commits != null ? formatCompact(data.stats.commits) : "—"}</dd>
                        </div>
                        <div>
                            <dt>Linguagens</dt>
                            <dd>{data ? formatCompact(data.stats.languages) : "—"}</dd>
                        </div>
                        <div>
                            <dt>Seguidores</dt>
                            <dd>{profile ? formatCompact(profile.followers) : "—"}</dd>
                        </div>
                    </dl>
                    <Link className="btn btn--block" to="github">
                        Ver estatísticas completas
                        <DashIcon name="arrow-right" size={12} />
                    </Link>
                </section>
            </div>

            <section className="grid-3">
                {FOCUS.map((item) => (
                    <article className="panel focus" key={item.title}>
                        <span className="focus__icon" aria-hidden="true">
                            <DashIcon name={item.icon} size={16} />
                        </span>
                        <h3 className="focus__title">{item.title}</h3>
                        <p className="focus__text">{item.text}</p>
                    </article>
                ))}
            </section>

            <div className="grid-2">
                <section className="panel">
                    <PanelHead icon="code" title="Stack" />
                    <div className="stack">
                        {STACK.map((group) => (
                            <div className="stack__group" key={group.label}>
                                <h3 className="detail__label">{group.label}</h3>
                                <div className="detail__tags">
                                    {group.items.map((item) => (
                                        <span className="tag" key={item}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="panel">
                    <PanelHead icon="target" title="Como trabalho" />
                    <ul className="principles">
                        {PRINCIPLES.map((item) => (
                            <li key={item}>
                                <DashIcon name="check" size={13} />
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <section className="panel cta">
                <div>
                    <h2 className="cta__title">Tens uma ideia ou um problema para resolver?</h2>
                    <p className="cta__text">{DEFAULT_CONFIG.availability}</p>
                </div>
                <Link className="btn btn--primary" to="contacto">
                    Falar comigo
                    <DashIcon name="arrow-right" size={13} />
                </Link>
            </section>
        </div>
    )
}
