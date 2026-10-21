import { SECTION_TEXT, SHORTCUTS_TEXT, COMMANDS } from "../constants"
import type { ProjectRecord, SectionKey } from "../types"
import { getValidFiles } from "../utils/files"

interface Props {
    section: SectionKey
    projects: ProjectRecord[]
}

export function SectionPanel({ section, projects }: Props) {
    if (section === "inicio") return null
    const downloads = projects.flatMap((project) =>
        getValidFiles(project).map((file, index) => ({
            project,
            file,
            key: `${project.id}-${index}`,
        }))
    )
    return (
        <section className="panel section-panel" tabIndex={-1}>
            <h2>{section.toUpperCase()}</h2>
            <p className="muted small">{SECTION_TEXT[section]}</p>
            {section === "docs" && (
                <div className="muted small section-panel__docs">
                    <div>Comandos: {COMMANDS.join(", ")}.</div>
                    <div>{SHORTCUTS_TEXT}</div>
                </div>
            )}
            {section === "downloads" && (
                <div className="section-panel__downloads">
                    {downloads.length === 0 ? (
                        <div className="muted small">Ainda não existem ficheiros publicados.</div>
                    ) : (
                        downloads.map(({ file, project, key }) => (
                            <a key={key} href={file.url} download className="link small">
                                {project.title} · {file.name || "ficheiro"}
                            </a>
                        ))
                    )}
                </div>
            )}
        </section>
    )
}
