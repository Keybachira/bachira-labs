import type { ProjectRecord, SiteConfig } from "../types"
import { getValidFiles } from "../utils/files"
import { Icon } from "./Icon"

interface Props {
    config: SiteConfig
    projects: ProjectRecord[]
    onRun: (command: string) => void
    onOpenProject: (id: string) => void
    onOpenPalette: () => void
}

const QUICK = [
    { cmd: "/projects", desc: "Abrir lista de projetos", run: "projects" },
    { cmd: "/about", desc: "Ver visão geral", run: "about" },
    { cmd: "/skills", desc: "Ver competências", run: "skills" },
    { cmd: "/help", desc: "Comandos disponíveis", run: "help" },
]

export function RightPanel({ config, projects, onRun, onOpenProject, onOpenPalette }: Props) {
    const kinds = new Set(
        projects.map((p) => p.kind.trim().toLowerCase().split(" ")[0]).filter(Boolean)
    ).size
    const downloads = projects.reduce((n, p) => n + getValidFiles(p).length, 0)
    const stats = [
        { value: projects.length, label: "PROJETOS DEMO" },
        { value: downloads, label: "FICHEIROS" },
        { value: kinds, label: "TIPOS" },
    ]
    return (
        <aside className="right">
            <section className="panel">
                <h3 className="panel__title">STATUS DO SISTEMA · DEMO</h3>
                <div className="gauges">
                    {[12, 34, 48].map((v, i) => (
                        <svg key={v} viewBox="0 0 44 44" width="44" height="44" role="img" aria-label={`Indicador ${v}`}>
                            <circle cx="22" cy="22" r="17" stroke="#18394E" strokeWidth="4" fill="none" />
                            <circle
                                cx="22" cy="22" r="17"
                                stroke={i === 0 ? "var(--accent)" : "#7AB7D7"}
                                strokeWidth="4" fill="none"
                                strokeDasharray={`${v} 120`}
                                transform="rotate(-90 22 22)"
                            />
                            <text x="22" y="26" textAnchor="middle" fill="#9AC7DF" fontSize="8">{v}</text>
                        </svg>
                    ))}
                </div>
            </section>

            <section className="panel">
                <h3 className="panel__title">Projetos / Tecnologias</h3>
                <div className="stats">
                    {stats.map((s) => (
                        <div key={s.label}>
                            <div className="stats__value">{s.value}</div>
                            <div className="stats__label">{s.label}</div>
                        </div>
                    ))}
                </div>
                <div className="chips">
                    {["React", "TS", "Rust", "JS"].map((chip) => (
                        <span key={chip} className="chip">{chip}</span>
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="row-between">
                    <h3 className="panel__title">Comandos rápidos</h3>
                    <button type="button" className="btn" onClick={onOpenPalette}>Ctrl K</button>
                </div>
                <button type="button" className="search-fake" onClick={onOpenPalette}>
                    Pesquisar ação
                </button>
                <div className="quick">
                    {QUICK.map((item) => (
                        <button key={item.cmd} type="button" className="quick__btn" onClick={() => onRun(item.run)}>
                            <span className="accent">{item.cmd}</span> — {item.desc}
                        </button>
                    ))}
                </div>
            </section>

            <section className="panel">
                <h3 className="panel__title">NO CATÁLOGO</h3>
                <div className="catalog">
                    {projects.length ? (
                        projects.slice(0, 5).map((project) => (
                            <div key={project.id} className="catalog__item">
                                <button type="button" className="catalog__btn" onClick={() => onOpenProject(project.id)}>
                                    <Icon type="folder" color="#9AC7DF" /> {project.title}
                                </button>
                                <div className="muted tiny">{project.kind}</div>
                            </div>
                        ))
                    ) : (
                        <span className="muted small">Sem registos ainda.</span>
                    )}
                </div>
            </section>

            <section className="panel panel--accent">
                <p className="accent small">{config.welcomeText}</p>
            </section>
        </aside>
    )
}
