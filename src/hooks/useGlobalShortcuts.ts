import { useEffect, useRef } from "react"
import type { SectionKey } from "../types"

interface Options {
    /** true quando há um diálogo aberto (paleta ou modal) */
    dialogOpen: boolean
    onTogglePalette: () => void
    onSection: (section: SectionKey) => void
    focusTerminal: () => void
    focusFirstCard: () => void
}

/** Atalhos globais: Ctrl/Cmd+K, Alt+1/2/3, setas entre cartões, Esc. */
export function useGlobalShortcuts(options: Options) {
    const ref = useRef(options)
    ref.current = options

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            const o = ref.current
            const target = event.target as HTMLElement | null
            const inInput = !!target?.closest("input, textarea")

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                // Não alterna a paleta por cima de um modal de projeto
                if (o.dialogOpen) return
                event.preventDefault()
                o.onTogglePalette()
                return
            }
            // Com diálogo aberto, o <dialog> trata do Esc e do foco
            if (o.dialogOpen) return

            if (!inInput && event.altKey) {
                if (event.key === "1") {
                    event.preventDefault()
                    o.onSection("inicio")
                } else if (event.key === "2") {
                    event.preventDefault()
                    o.onSection("projetos")
                    o.focusFirstCard()
                } else if (event.key === "3") {
                    event.preventDefault()
                    o.onSection("terminal")
                    o.focusTerminal()
                }
            }

            if (!inInput && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
                const cards = Array.from(
                    document.querySelectorAll<HTMLElement>("[data-lab-card='true']")
                )
                const index = cards.findIndex((c) => c === document.activeElement)
                if (index >= 0) {
                    event.preventDefault()
                    const next =
                        event.key === "ArrowRight"
                            ? Math.min(cards.length - 1, index + 1)
                            : Math.max(0, index - 1)
                    cards[next]?.focus()
                }
            }

            if (event.key === "Escape") o.focusTerminal()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])
}
