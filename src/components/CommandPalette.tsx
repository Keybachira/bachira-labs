import { useEffect, useMemo, useState } from "react"
import type { PaletteItem } from "../types"
import { TopLayerDialog } from "./TopLayerDialog"

interface Props {
    items: PaletteItem[]
    onClose: () => void
}

export function CommandPalette({ items, onClose }: Props) {
    const [query, setQuery] = useState("")
    const [index, setIndex] = useState(0)

    const results = useMemo(() => {
        const q = query.toLowerCase().trim()
        return q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items
    }, [items, query])

    useEffect(() => setIndex(0), [query])

    const choose = (item?: PaletteItem) => {
        if (!item) return
        onClose()
        item.action()
    }

    return (
        <TopLayerDialog onClose={onClose} labelledBy="palette-title" className="top-dialog--top">
            <div className="modal modal--palette">
                <div id="palette-title" className="modal__title">Paleta de comandos</div>
                <input
                    autoFocus
                    role="combobox"
                    aria-expanded="true"
                    aria-controls="palette-list"
                    aria-activedescendant={results[index] ? `palette-item-${index}` : undefined}
                    aria-label="Pesquisar secções, comandos e projetos"
                    placeholder="Pesquisar secções, comandos, projetos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault()
                            setIndex((v) => Math.min(v + 1, Math.max(0, results.length - 1)))
                        } else if (e.key === "ArrowUp") {
                            e.preventDefault()
                            setIndex((v) => Math.max(v - 1, 0))
                        } else if (e.key === "Enter") {
                            e.preventDefault()
                            choose(results[index])
                        }
                    }}
                />
                <div id="palette-list" role="listbox" className="palette-list">
                    {results.length === 0 && <div className="muted small">Sem resultados.</div>}
                    {results.map((item, i) => (
                        <div
                            key={`${item.type}-${i}-${item.label}`}
                            id={`palette-item-${i}`}
                            role="option"
                            aria-selected={i === index}
                            className={`palette-item${i === index ? " is-active" : ""}`}
                            onMouseEnter={() => setIndex(i)}
                            onClick={() => choose(item)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </TopLayerDialog>
    )
}
