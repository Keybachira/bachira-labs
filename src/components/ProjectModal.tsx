import { useMemo, useState } from "react"
import type { ProjectRecord } from "../types"
import { getValidFiles } from "../utils/files"
import { isHttpLink } from "../utils/links"
import { TopLayerDialog } from "./TopLayerDialog"

interface Props {
    project: ProjectRecord
    onClose: () => void
}

const MOCK_ITEMS = ["Painel", "Configuração", "Usuários", "Relatórios"]
const FALLBACK_INSTALL = "npm i pacote-demo (exemplo não publicado)"

export function ProjectModal({ project, onClose }: Props) {
    const [filter, setFilter] = useState("")
    const [feedback, setFeedback] = useState("")
    const kind = project.kind.toLowerCase()
    const isWeb = kind.includes("web")
    const isCli = kind.includes("cli")
    const showRequirements = !isWeb && !isCli
    const files = getValidFiles(project)
    const items = useMemo(
        () => MOCK_ITEMS.filter((i) => i.toLowerCase().includes(filter.toLowerCase().trim())),
        [filter]
    )
    const install = project.installCommand || FALLBACK_INSTALL

    const copy = async () => {
        if (!navigator.clipboard) return setFeedback("Clipboard indisponível.")
        try {
            await navigator.clipboard.writeText(install)
            setFeedback("Comando copiado.")
        } catch {
            setFeedback("Falha ao copiar.")
        }
    }

    return (
        <TopLayerDialog onClose={onClose} labelledBy="project-title">
            <div className="modal modal--project">
                <div className="row-between">
                    <h2 id="project-title" className="accent">{project.title}</h2>
                    <button type="button" className="btn" onClick={onClose} autoFocus>Fechar</button>
                </div>
                <p className="muted small">{project.description}</p>

                <div className="modal__grid">
                    {isWeb && (
                        <section className="box">
                            <h3>Pré-visualização</h3>
                            {isHttpLink(project.demoUrl) ? (
                                <a className="link small" href={project.demoUrl} target="_blank" rel="noreferrer">
                                    Abrir demo real
                                </a>
                            ) : (
                                <>
                                    <div className="muted tiny">Pré-visualização demonstrativa</div>
                                    <div className="box box--inner">
                                        <input
                                            aria-label="Filtrar itens"
                                            placeholder="Filtrar..."
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                        />
                                        <ul className="muted tiny">
                                            {items.map((i) => <li key={i}>{i}</li>)}
                                            {items.length === 0 && <li>Sem correspondências.</li>}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </section>
                    )}
                    {isCli && (
                        <section className="box">
                            <h3>Instalação (ilustrativa)</h3>
                            <pre className="muted tiny">{install}</pre>
                            <button type="button" className="btn" onClick={copy}>Copiar snippet</button>
                            <div aria-live="polite" className="muted tiny">{feedback}</div>
                            <p className="muted tiny">Exemplo não executado e sem pacote publicado.</p>
                        </section>
                    )}
                    {showRequirements && (
                        <section className="box">
                            <h3>Requisitos e release</h3>
                            <p className="muted tiny">{project.requirements || "Sem requisitos detalhados."}</p>
                            <p className="muted tiny">Versão: {project.version || "0.1.0"}</p>
                            <p className="muted tiny">Tipo: {project.kind || "Projeto"}</p>
                        </section>
                    )}
                </div>

                <section className="box">
                    <h3>Ficheiros publicados</h3>
                    <div className="files">
                        {files.length ? (
                            files.map((file, i) => (
                                <div key={`${file.url}-${i}`} className="box box--inner tiny">
                                    <div>{file.name || "ficheiro"}</div>
                                    <div className="muted">
                                        {file.size || "—"} · {file.os || "Any"}
                                        {file.checksum ? ` · sha:${file.checksum}` : ""}
                                    </div>
                                    <a className="link" href={file.url} download>Download</a>
                                </div>
                            ))
                        ) : (
                            <div className="muted tiny">Ainda não existem ficheiros publicados.</div>
                        )}
                    </div>
                </section>
            </div>
        </TopLayerDialog>
    )
}
